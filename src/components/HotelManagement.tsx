import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Hotel, Plus, Edit, Trash2, Star, MapPin, Wifi, Car, Coffee, Dumbbell } from "lucide-react";
import { useVendorProperties, useCreateRoomType, useUpdateRoomType, useDeleteRoomType } from "@/hooks/useVendorData";

const HotelManagement = () => {
  const { data: properties, isLoading } = useVendorProperties();
  const createRoomTypeMutation = useCreateRoomType();
  const updateRoomTypeMutation = useUpdateRoomType();
  const deleteRoomTypeMutation = useDeleteRoomType();

  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [roomFormData, setRoomFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    max_occupancy: "2",
    total_rooms: "1",
    amenities: ""
  });

  const hotels = properties?.filter(p => p.type === 'hotel') || [];

  const amenityIcons = {
    WiFi: Wifi,
    Pool: Hotel,
    Spa: Star,
    Gym: Dumbbell,
    Restaurant: Coffee,
    Parking: Car
  };

  const handleAddRoom = async () => {
    if (!selectedHotel || !roomFormData.name || !roomFormData.base_price) {
      return;
    }

    const roomData = {
      property_id: selectedHotel.id,
      name: roomFormData.name,
      description: roomFormData.description,
      base_price: parseFloat(roomFormData.base_price),
      max_occupancy: parseInt(roomFormData.max_occupancy),
      total_rooms: parseInt(roomFormData.total_rooms),
      amenities: roomFormData.amenities ? roomFormData.amenities.split(',').map(a => a.trim()) : []
    };

    await createRoomTypeMutation.mutateAsync(roomData);
    setIsAddingRoom(false);
    resetForm();
  };

  const handleEditRoom = async () => {
    if (!editingRoom || !roomFormData.name || !roomFormData.base_price) {
      return;
    }

    const roomData = {
      id: editingRoom.id,
      name: roomFormData.name,
      description: roomFormData.description,
      base_price: parseFloat(roomFormData.base_price),
      max_occupancy: parseInt(roomFormData.max_occupancy),
      total_rooms: parseInt(roomFormData.total_rooms),
      amenities: roomFormData.amenities ? roomFormData.amenities.split(',').map(a => a.trim()) : []
    };

    await updateRoomTypeMutation.mutateAsync(roomData);
    setEditingRoom(null);
    resetForm();
  };

  const handleDeleteRoom = async (roomId: string) => {
    await deleteRoomTypeMutation.mutateAsync(roomId);
  };

  const resetForm = () => {
    setRoomFormData({
      name: "",
      description: "",
      base_price: "",
      max_occupancy: "2",
      total_rooms: "1",
      amenities: ""
    });
  };

  const openEditDialog = (room: any) => {
    setEditingRoom(room);
    setRoomFormData({
      name: room.name,
      description: room.description || "",
      base_price: room.base_price.toString(),
      max_occupancy: room.max_occupancy.toString(),
      total_rooms: room.total_rooms.toString(),
      amenities: room.amenities ? room.amenities.join(', ') : ""
    });
  };

  if (isLoading) {
    return <div>Loading hotels...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hotel Management</h2>
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
                {hotel.amenities?.map((amenity: string, index: number) => {
                  const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
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
                  <h4 className="font-medium">Room Types ({hotel.room_types?.length || 0})</h4>
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
                  {hotel.room_types?.map((room: any) => (
                    <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{room.name}</p>
                        <p className="text-xs text-gray-600">
                          ${room.base_price}/night • {room.max_occupancy} guests
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {room.amenities?.map((amenity: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openEditDialog(room)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
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
              <Input 
                id="room-name" 
                placeholder="e.g., Deluxe Suite" 
                value={roomFormData.name}
                onChange={(e) => setRoomFormData({...roomFormData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="room-description">Description</Label>
              <Textarea 
                id="room-description" 
                placeholder="Room description" 
                value={roomFormData.description}
                onChange={(e) => setRoomFormData({...roomFormData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="room-price">Price per night</Label>
                <Input 
                  id="room-price" 
                  type="number" 
                  placeholder="150" 
                  value={roomFormData.base_price}
                  onChange={(e) => setRoomFormData({...roomFormData, base_price: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="room-capacity">Max Guests</Label>
                <Input 
                  id="room-capacity" 
                  type="number" 
                  placeholder="2" 
                  value={roomFormData.max_occupancy}
                  onChange={(e) => setRoomFormData({...roomFormData, max_occupancy: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="total-rooms">Total Rooms</Label>
                <Input 
                  id="total-rooms" 
                  type="number" 
                  placeholder="1" 
                  value={roomFormData.total_rooms}
                  onChange={(e) => setRoomFormData({...roomFormData, total_rooms: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="room-amenities">Amenities (comma-separated)</Label>
              <Input 
                id="room-amenities" 
                placeholder="WiFi, AC, TV, Mini Bar" 
                value={roomFormData.amenities}
                onChange={(e) => setRoomFormData({...roomFormData, amenities: e.target.value})}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleAddRoom}
              disabled={createRoomTypeMutation.isPending}
            >
              {createRoomTypeMutation.isPending ? "Adding..." : "Add Room Type"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Room Type Dialog */}
      <Dialog open={!!editingRoom} onOpenChange={(open) => !open && setEditingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-room-name">Room Name</Label>
              <Input 
                id="edit-room-name" 
                placeholder="e.g., Deluxe Suite" 
                value={roomFormData.name}
                onChange={(e) => setRoomFormData({...roomFormData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-room-description">Description</Label>
              <Textarea 
                id="edit-room-description" 
                placeholder="Room description" 
                value={roomFormData.description}
                onChange={(e) => setRoomFormData({...roomFormData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-room-price">Price per night</Label>
                <Input 
                  id="edit-room-price" 
                  type="number" 
                  placeholder="150" 
                  value={roomFormData.base_price}
                  onChange={(e) => setRoomFormData({...roomFormData, base_price: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-room-capacity">Max Guests</Label>
                <Input 
                  id="edit-room-capacity" 
                  type="number" 
                  placeholder="2" 
                  value={roomFormData.max_occupancy}
                  onChange={(e) => setRoomFormData({...roomFormData, max_occupancy: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-total-rooms">Total Rooms</Label>
                <Input 
                  id="edit-total-rooms" 
                  type="number" 
                  placeholder="1" 
                  value={roomFormData.total_rooms}
                  onChange={(e) => setRoomFormData({...roomFormData, total_rooms: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-room-amenities">Amenities (comma-separated)</Label>
              <Input 
                id="edit-room-amenities" 
                placeholder="WiFi, AC, TV, Mini Bar" 
                value={roomFormData.amenities}
                onChange={(e) => setRoomFormData({...roomFormData, amenities: e.target.value})}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleEditRoom}
              disabled={updateRoomTypeMutation.isPending}
            >
              {updateRoomTypeMutation.isPending ? "Updating..." : "Update Room Type"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelManagement;
