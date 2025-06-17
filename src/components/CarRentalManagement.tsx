import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Plus, Edit, Trash2, Users, Fuel, Cog } from "lucide-react";
import { useVendorProperties, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from "@/hooks/useVendorData";

const CarRentalManagement = () => {
  const { data: properties, isLoading } = useVendorProperties();
  const createVehicleMutation = useCreateVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [vehicleFormData, setVehicleFormData] = useState({
    make: "",
    model: "",
    year: "",
    type: "",
    transmission: "",
    fuel_type: "",
    seats: "5",
    daily_rate: "",
    features: "",
    license_plate: ""
  });

  const carRentals = properties?.filter(p => p.type === 'car_rental') || [];

  const categoryColors: { [key: string]: string } = {
    "Sedan": "blue",
    "SUV": "green",
    "Electric": "purple",
    "Truck": "orange",
    "Convertible": "pink"
  };

  const handleAddVehicle = async () => {
    if (!selectedProperty || !vehicleFormData.make || !vehicleFormData.model || !vehicleFormData.daily_rate) {
      return;
    }

    const vehicleData = {
      property_id: selectedProperty.id,
      make: vehicleFormData.make,
      model: vehicleFormData.model,
      year: parseInt(vehicleFormData.year),
      type: vehicleFormData.type,
      transmission: vehicleFormData.transmission,
      fuel_type: vehicleFormData.fuel_type,
      seats: parseInt(vehicleFormData.seats),
      daily_rate: parseFloat(vehicleFormData.daily_rate),
      features: vehicleFormData.features ? vehicleFormData.features.split(',').map(f => f.trim()) : [],
      license_plate: vehicleFormData.license_plate
    };

    await createVehicleMutation.mutateAsync(vehicleData);
    setIsAddingVehicle(false);
    resetForm();
  };

  const handleEditVehicle = async () => {
    if (!editingVehicle || !vehicleFormData.make || !vehicleFormData.model || !vehicleFormData.daily_rate) {
      return;
    }

    const vehicleData = {
      id: editingVehicle.id,
      make: vehicleFormData.make,
      model: vehicleFormData.model,
      year: parseInt(vehicleFormData.year),
      type: vehicleFormData.type,
      transmission: vehicleFormData.transmission,
      fuel_type: vehicleFormData.fuel_type,
      seats: parseInt(vehicleFormData.seats),
      daily_rate: parseFloat(vehicleFormData.daily_rate),
      features: vehicleFormData.features ? vehicleFormData.features.split(',').map(f => f.trim()) : [],
      license_plate: vehicleFormData.license_plate
    };

    await updateVehicleMutation.mutateAsync(vehicleData);
    setEditingVehicle(null);
    resetForm();
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    await deleteVehicleMutation.mutateAsync(vehicleId);
  };

  const resetForm = () => {
    setVehicleFormData({
      make: "",
      model: "",
      year: "",
      type: "",
      transmission: "",
      fuel_type: "",
      seats: "5",
      daily_rate: "",
      features: "",
      license_plate: ""
    });
  };

  const openEditDialog = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setVehicleFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year.toString(),
      type: vehicle.type,
      transmission: vehicle.transmission,
      fuel_type: vehicle.fuel_type,
      seats: vehicle.seats.toString(),
      daily_rate: vehicle.daily_rate.toString(),
      features: vehicle.features ? vehicle.features.join(', ') : "",
      license_plate: vehicle.license_plate || ""
    });
  };

  if (isLoading) {
    return <div>Loading car rentals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Car Rental Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {carRentals.map((property) => (
          <div key={property.id} className="space-y-4">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-teal-600" />
                    <span>{property.name}</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedProperty(property);
                      setIsAddingVehicle(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Vehicle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{property.location}</p>
                <div className="space-y-3">
                  {property.vehicles?.map((vehicle: any) => (
                    <div key={vehicle.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                          <p className="text-sm text-gray-600">{vehicle.year}</p>
                          <Badge 
                            variant="outline" 
                            className={`border-${categoryColors[vehicle.type] || 'blue'}-300 text-${categoryColors[vehicle.type] || 'blue'}-700 mt-1`}
                          >
                            {vehicle.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-teal-600">${vehicle.daily_rate}/day</span>
                          <div className="flex space-x-1 mt-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => openEditDialog(vehicle)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span>{vehicle.seats} seats</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Cog className="h-3 w-3 text-gray-500" />
                          <span>{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Fuel className="h-3 w-3 text-gray-500" />
                          <span>{vehicle.fuel_type}</span>
                        </div>
                      </div>

                      {vehicle.features && vehicle.features.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vehicle to {selectedProperty?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make</Label>
                <Input 
                  id="make" 
                  placeholder="Toyota" 
                  value={vehicleFormData.make}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, make: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input 
                  id="model" 
                  placeholder="Camry" 
                  value={vehicleFormData.model}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, model: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input 
                  id="year" 
                  type="number" 
                  placeholder="2023" 
                  value={vehicleFormData.year}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, year: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="daily-rate">Daily Rate ($)</Label>
                <Input 
                  id="daily-rate" 
                  type="number" 
                  placeholder="65" 
                  value={vehicleFormData.daily_rate}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, daily_rate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={vehicleFormData.type} onValueChange={(value) => setVehicleFormData({...vehicleFormData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="convertible">Convertible</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select value={vehicleFormData.transmission} onValueChange={(value) => setVehicleFormData({...vehicleFormData, transmission: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fuel-type">Fuel Type</Label>
                <Select value={vehicleFormData.fuel_type} onValueChange={(value) => setVehicleFormData({...vehicleFormData, fuel_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="seats">Seats</Label>
              <Input 
                id="seats" 
                type="number" 
                placeholder="5" 
                value={vehicleFormData.seats}
                onChange={(e) => setVehicleFormData({...vehicleFormData, seats: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input 
                id="features" 
                placeholder="GPS, Bluetooth, AC" 
                value={vehicleFormData.features}
                onChange={(e) => setVehicleFormData({...vehicleFormData, features: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="license">License Plate</Label>
              <Input 
                id="license" 
                placeholder="ABC-123" 
                value={vehicleFormData.license_plate}
                onChange={(e) => setVehicleFormData({...vehicleFormData, license_plate: e.target.value})}
              />
            </div>
            <Button 
              className="w-full"
              onClick={handleAddVehicle}
              disabled={createVehicleMutation.isPending}
            >
              {createVehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={!!editingVehicle} onOpenChange={(open) => !open && setEditingVehicle(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-make">Make</Label>
                <Input 
                  id="edit-make" 
                  placeholder="Toyota" 
                  value={vehicleFormData.make}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, make: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-model">Model</Label>
                <Input 
                  id="edit-model" 
                  placeholder="Camry" 
                  value={vehicleFormData.model}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, model: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-year">Year</Label>
                <Input 
                  id="edit-year" 
                  type="number" 
                  placeholder="2023" 
                  value={vehicleFormData.year}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, year: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-daily-rate">Daily Rate ($)</Label>
                <Input 
                  id="edit-daily-rate" 
                  type="number" 
                  placeholder="65" 
                  value={vehicleFormData.daily_rate}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, daily_rate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-type">Type</Label>
              <Select value={vehicleFormData.type} onValueChange={(value) => setVehicleFormData({...vehicleFormData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="convertible">Convertible</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-transmission">Transmission</Label>
                <Select value={vehicleFormData.transmission} onValueChange={(value) => setVehicleFormData({...vehicleFormData, transmission: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-fuel-type">Fuel Type</Label>
                <Select value={vehicleFormData.fuel_type} onValueChange={(value) => setVehicleFormData({...vehicleFormData, fuel_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-seats">Seats</Label>
              <Input 
                id="edit-seats" 
                type="number" 
                placeholder="5" 
                value={vehicleFormData.seats}
                onChange={(e) => setVehicleFormData({...vehicleFormData, seats: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-features">Features (comma-separated)</Label>
              <Input 
                id="edit-features" 
                placeholder="GPS, Bluetooth, AC" 
                value={vehicleFormData.features}
                onChange={(e) => setVehicleFormData({...vehicleFormData, features: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-license">License Plate</Label>
              <Input 
                id="edit-license" 
                placeholder="ABC-123" 
                value={vehicleFormData.license_plate}
                onChange={(e) => setVehicleFormData({...vehicleFormData, license_plate: e.target.value})}
              />
            </div>
            <Button 
              className="w-full"
              onClick={handleEditVehicle}
              disabled={updateVehicleMutation.isPending}
            >
              {updateVehicleMutation.isPending ? "Updating..." : "Update Vehicle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarRentalManagement;
