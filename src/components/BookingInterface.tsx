import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useProperties, useCreateBooking } from "@/hooks/useSupabaseData";
import { toast } from "@/components/ui/use-toast";

const BookingInterface = () => {
  const [bookingType, setBookingType] = useState("hotel");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [location, setLocation] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedResource, setSelectedResource] = useState("");

  const { data: properties, isLoading } = useProperties();
  const createBookingMutation = useCreateBooking();

  const filteredProperties = properties?.filter(property => 
    property.type === bookingType && 
    (!location || property.location.toLowerCase().includes(location.toLowerCase()))
  ) || [];

  const selectedPropertyData = filteredProperties.find(p => p.id === selectedProperty);
  
  const getResourceOptions = () => {
    if (!selectedPropertyData) return [];
    
    switch (bookingType) {
      case 'hotel':
        return selectedPropertyData.room_types || [];
      case 'car_rental':
        return selectedPropertyData.vehicles || [];
      case 'tour':
        return selectedPropertyData.tour_packages || [];
      default:
        return [];
    }
  };

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || !selectedResource) return 0;
    
    const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const resource = getResourceOptions().find(r => r.id === selectedResource);
    
    if (!resource) return 0;
    
    let basePrice = 0;
    let quantity = 1;
    
    switch (bookingType) {
      case 'hotel':
        // Type assertion for room type
        basePrice = Number((resource as any).base_price) || 0;
        quantity = rooms;
        break;
      case 'car_rental':
        // Type assertion for vehicle
        basePrice = Number((resource as any).daily_rate) || 0;
        quantity = 1;
        break;
      case 'tour':
        // Type assertion for tour package
        basePrice = Number((resource as any).price_per_person) || 0;
        quantity = guests;
        break;
    }
    
    return basePrice * quantity * days;
  };

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate || !selectedProperty || !selectedResource) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to make a booking.",
        variant: "destructive",
      });
      return;
    }

    try {
      const bookingData = {
        property_id: selectedProperty,
        booking_type: bookingType,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        total_amount: calculateTotal(),
        ...(bookingType === 'hotel' && {
          room_type_id: selectedResource,
          rooms_count: rooms,
        }),
        ...(bookingType === 'car_rental' && {
          vehicle_id: selectedResource,
        }),
        ...(bookingType === 'tour' && {
          tour_package_id: selectedResource,
          participants_count: guests,
        }),
      };

      await createBookingMutation.mutateAsync(bookingData);
      
      toast({
        title: "Booking Successful!",
        description: "Your booking has been created successfully.",
      });
      
      // Reset form
      setSelectedProperty("");
      setSelectedResource("");
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Experience</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find and book hotels, rental cars, and tour packages for your perfect trip
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Book</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking Type Selection */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "hotel", label: "Hotels" },
              { value: "car_rental", label: "Car Rentals" },
              { value: "tour", label: "Tours" }
            ].map((type) => (
              <Button
                key={type.value}
                variant={bookingType === type.value ? "default" : "outline"}
                onClick={() => {
                  setBookingType(type.value);
                  setSelectedProperty("");
                  setSelectedResource("");
                }}
                className="w-full"
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  placeholder="Where to?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => date < (checkInDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">
                {bookingType === 'hotel' ? 'Rooms & Guests' : bookingType === 'tour' ? 'Participants' : 'Guests'}
              </Label>
              <div className="flex space-x-2">
                {bookingType === 'hotel' && (
                  <Input
                    type="number"
                    placeholder="Rooms"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    min="1"
                    className="flex-1"
                  />
                )}
                <div className="relative flex-1">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder={bookingType === 'tour' ? 'People' : 'Guests'}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    min="1"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Selection */}
          {filteredProperties.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property">Select Property</Label>
                <Select value={selectedProperty} onValueChange={(value) => {
                  setSelectedProperty(value);
                  setSelectedResource("");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a property..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        <div className="flex items-center space-x-2">
                          <span>{property.name}</span>
                          <span className="text-gray-500">- {property.location}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resource Selection */}
              {selectedProperty && getResourceOptions().length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="resource">
                    Select {bookingType === 'hotel' ? 'Room Type' : bookingType === 'car_rental' ? 'Vehicle' : 'Package'}
                  </Label>
                  <Select value={selectedResource} onValueChange={setSelectedResource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an option..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getResourceOptions().map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          <div className="flex justify-between w-full">
                            <span>{(resource as any).name || `${(resource as any).make} ${(resource as any).model}`}</span>
                            <span className="font-medium">
                              ${bookingType === 'hotel' ? (resource as any).base_price : 
                                bookingType === 'car_rental' ? (resource as any).daily_rate : 
                                (resource as any).price_per_person}
                              {bookingType === 'tour' ? '/person' : '/night'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Booking Summary */}
          {selectedResource && checkInDate && checkOutDate && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Dates:</span>
                  <span>{format(checkInDate, "MMM dd")} - {format(checkOutDate, "MMM dd")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Book Button */}
          <Button 
            onClick={handleBooking}
            disabled={!selectedResource || !checkInDate || !checkOutDate || createBookingMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {createBookingMutation.isPending ? "Booking..." : "Book Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingInterface;
