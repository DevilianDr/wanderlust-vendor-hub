import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Hotel, Plus, Edit, Trash2, Star, MapPin, Wifi, Car, Coffee, Dumbbell } from "lucide-react";

const HotelManagement = () => {
  const [hotels, setHotels] = useState([
    {
      id: 1,
      name: "Ocean View Resort",
      location: "Miami Beach, FL",
      rating: 4.8,
      rooms: 120,
      description: "Luxury beachfront resort with stunning ocean views",
      amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant"],
      roomTypes: [
        { id: 1, name: "Standard Room", price: 120, capacity: 2, amenities: ["WiFi", "AC", "TV"] },
        { id: 2, name: "Ocean View Suite", price: 250, capacity: 4, amenities: ["WiFi", "AC", "TV", "Balcony", "Mini Bar"] },
        { id: 3, name: "Presidential Suite", price: 500, capacity: 6, amenities: ["WiFi", "AC", "TV", "Balcony", "Mini Bar", "Jacuzzi"] }
      ]
    },
    {
      id: 2,
      name: "Mountain Lodge",
      location: "Aspen, CO",
      rating: 4.6,
      rooms: 80,
      description: "Cozy mountain retreat perfect for winter getaways",
      amenities: ["WiFi", "Fireplace", "Hot Tub", "Ski Storage"],
      roomTypes: [
        { id: 1, name: "Cabin Room", price: 180, capacity: 2, amenities: ["WiFi", "Fireplace", "Heating"] },
        { id: 2, name: "Family Suite", price: 320, capacity: 6, amenities: ["WiFi", "Fireplace", "Heating", "Kitchen"] }
      ]
    }
  ]);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  const amenityIcons = {
    WiFi: Wifi,
    Pool: Hotel,
    Spa: Star,
    Gym: Dumbbell,
    Restaurant: Coffee,
    Parking: Car
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hotel Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hotel-name">Hotel Name</Label>
                <Input id="hotel-name" placeholder="Enter hotel name" />
              </div>
              <div>
                <Label htmlFor="hotel-location">Location</Label>
                <Input id="hotel-location" placeholder="Enter location" />
              </div>
              <div>
                <Label htmlFor="hotel-description">Description</Label>
                <Textarea id="hotel-description" placeholder="Enter description" />
              </div>
              <Button className="w-full">Add Hotel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Hotel className="h-5 w-5 text-blue-600" />
                    <span>{hotel.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{hotel.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{hotel.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity];
                  return (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      {IconComponent && <IconComponent className="h-3 w-3" />}
                      <span>{amenity}</span>
                    </Badge>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Room Types ({hotel.roomTypes.length})</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setIsAddingRoom(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Room
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {hotel.roomTypes.map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{room.name}</p>
                        <p className="text-xs text-gray-600">
                          ${room.price}/night • {room.capacity} guests
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {room.amenities.map((amenity, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Room Type Dialog */}
      <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Room Type to {selectedHotel?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="room-name">Room Name</Label>
              <Input id="room-name" placeholder="e.g., Deluxe Suite" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room-price">Price per night</Label>
                <Input id="room-price" type="number" placeholder="150" />
              </div>
              <div>
                <Label htmlFor="room-capacity">Max Guests</Label>
                <Input id="room-capacity" type="number" placeholder="2" />
              </div>
            </div>
            <div>
              <Label htmlFor="room-amenities">Amenities (comma-separated)</Label>
              <Input id="room-amenities" placeholder="WiFi, AC, TV, Mini Bar" />
            </div>
            <Button className="w-full">Add Room Type</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelManagement;
