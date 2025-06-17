
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Plus, Edit, Trash2, Users, Fuel, Cog } from "lucide-react";

const CarRentalManagement = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      make: "Toyota",
      model: "Camry",
      year: 2023,
      category: "Sedan",
      dailyRate: 65,
      capacity: 5,
      transmission: "Automatic",
      fuelType: "Gasoline",
      features: ["GPS", "Bluetooth", "AC", "Backup Camera"],
      availability: "Available",
      location: "Downtown Miami"
    },
    {
      id: 2,
      make: "Jeep",
      model: "Wrangler",
      year: 2023,
      category: "SUV",
      dailyRate: 95,
      capacity: 5,
      transmission: "Manual",
      fuelType: "Gasoline",
      features: ["4WD", "GPS", "Bluetooth", "AC"],
      availability: "Rented",
      location: "Airport"
    },
    {
      id: 3,
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      category: "Electric",
      dailyRate: 120,
      capacity: 5,
      transmission: "Automatic",
      fuelType: "Electric",
      features: ["Autopilot", "GPS", "Premium Audio", "Supercharging"],
      availability: "Available",
      location: "Downtown Miami"
    }
  ]);

  const categoryColors = {
    "Sedan": "blue",
    "SUV": "green",
    "Electric": "purple",
    "Truck": "orange",
    "Convertible": "pink"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Car Rental Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" placeholder="Toyota" />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="Camry" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" placeholder="2023" />
                </div>
                <div>
                  <Label htmlFor="daily-rate">Daily Rate ($)</Label>
                  <Input id="daily-rate" type="number" placeholder="65" />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="convertible">Convertible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Downtown Miami" />
              </div>
              <Button className="w-full">Add Vehicle</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-teal-600" />
                    <span>{vehicle.make} {vehicle.model}</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">{vehicle.year}</p>
                </div>
                <Badge 
                  variant={vehicle.availability === 'Available' ? 'default' : 'secondary'}
                  className={vehicle.availability === 'Available' ? 'bg-green-100 text-green-800' : ''}
                >
                  {vehicle.availability}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`border-${categoryColors[vehicle.category]}-300 text-${categoryColors[vehicle.category]}-700`}>
                  {vehicle.category}
                </Badge>
                <span className="text-2xl font-bold text-teal-600">${vehicle.dailyRate}/day</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{vehicle.capacity} passengers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cog className="h-4 w-4 text-gray-500" />
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  <span>{vehicle.fuelType}</span>
                </div>
                <div className="text-gray-600">
                  {vehicle.location}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {vehicle.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
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
    </div>
  );
};

export default CarRentalManagement;
