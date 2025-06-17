
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Clock, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BookingInterface = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: ""
  });

  const sampleProperties = [
    {
      id: 1,
      type: "hotel",
      name: "Ocean View Resort",
      location: "Miami Beach, FL",
      price: 120,
      priceUnit: "night"
    },
    {
      id: 2,
      type: "car",
      name: "Tesla Model 3",
      location: "Downtown Miami",
      price: 120,
      priceUnit: "day"
    },
    {
      id: 3,
      type: "tour",
      name: "Miami Beach Adventure",
      location: "Miami, FL",
      price: 299,
      priceUnit: "person"
    }
  ];

  const handleBooking = () => {
    if (!selectedProperty) {
      toast({
        title: "Please select a property",
        description: "Choose a property to continue with your booking.",
        variant: "destructive"
      });
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast({
        title: "Please select dates",
        description: "Check-in and check-out dates are required.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking Submitted!",
      description: `Your booking for ${selectedProperty.name} has been submitted successfully.`,
    });
  };

  const calculateTotal = () => {
    if (!selectedProperty || !bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (selectedProperty.type === 'tour') {
      return selectedProperty.price * bookingData.guests;
    } else {
      return selectedProperty.price * Math.max(days, 1) * (selectedProperty.type === 'hotel' ? 1 : 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Book Your Experience</h2>
        <p className="text-gray-600">Complete your reservation in just a few steps</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Property Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Select Property</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleProperties.map((property) => (
              <div
                key={property.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedProperty?.id === property.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{property.name}</h3>
                    <p className="text-sm text-gray-600">{property.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">${property.price}</p>
                    <p className="text-xs text-gray-500">per {property.priceUnit}</p>
                  </div>
                </div>
                <Badge variant="outline" className="mt-2">
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Booking Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="check-in">Check-in Date</Label>
                <Input
                  id="check-in"
                  type="date"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="check-out">Check-out Date</Label>
                <Input
                  id="check-out"
                  type="date"
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Select value={bookingData.guests.toString()} onValueChange={(value) => setBookingData({...bookingData, guests: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="special-requests">Special Requests</Label>
              <Textarea
                id="special-requests"
                placeholder="Any special requirements or requests..."
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary */}
      {selectedProperty && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Booking Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="font-medium">{selectedProperty.name}</span>
                <span>{selectedProperty.location}</span>
              </div>
              
              {bookingData.checkIn && bookingData.checkOut && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span>Duration</span>
                  <span>
                    {selectedProperty.type === 'tour' 
                      ? 'Tour Package' 
                      : `${Math.max(Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24)), 1)} ${selectedProperty.priceUnit}(s)`
                    }
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between py-2 border-b">
                <span>Guests</span>
                <span>{bookingData.guests}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 text-xl font-bold border-t">
                <span>Total</span>
                <span className="text-blue-600">${calculateTotal()}</span>
              </div>
              
              <Button 
                onClick={handleBooking} 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg py-6"
              >
                Complete Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingInterface;
