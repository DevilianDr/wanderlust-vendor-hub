
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Plus, Edit, Trash2, Clock, MapPin, Star } from "lucide-react";

const TourPackageManagement = () => {
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Miami Beach Adventure",
      description: "Explore the beautiful beaches and vibrant nightlife of Miami",
      duration: "3 days / 2 nights",
      groupSize: 12,
      price: 299,
      difficulty: "Easy",
      includes: ["Hotel", "Breakfast", "Guide", "Transportation"],
      location: "Miami, FL",
      rating: 4.7,
      availability: "Available"
    },
    {
      id: 2,
      name: "Mountain Hiking Expedition",
      description: "Challenge yourself with breathtaking mountain trails and scenic views",
      duration: "5 days / 4 nights",
      groupSize: 8,
      price: 599,
      difficulty: "Challenging",
      includes: ["Camping Gear", "Meals", "Guide", "Equipment"],
      location: "Colorado Rockies",
      rating: 4.9,
      availability: "Available"
    },
    {
      id: 3,
      name: "City Culture Tour",
      description: "Discover the rich history and culture of the city through guided tours",
      duration: "1 day",
      groupSize: 20,
      price: 89,
      difficulty: "Easy",
      includes: ["Lunch", "Guide", "Museum Entry", "Transportation"],
      location: "New York, NY",
      rating: 4.5,
      availability: "Fully Booked"
    }
  ]);

  const difficultyColors = {
    "Easy": "green",
    "Moderate": "yellow",
    "Challenging": "red"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tour Package Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Tour Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="package-name">Package Name</Label>
                <Input id="package-name" placeholder="Amazing Adventure Tour" />
              </div>
              <div>
                <Label htmlFor="package-description">Description</Label>
                <Textarea id="package-description" placeholder="Describe the tour experience" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="3 days / 2 nights" />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="299" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="group-size">Max Group Size</Label>
                  <Input id="group-size" type="number" placeholder="12" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Miami, FL" />
                </div>
              </div>
              <Button className="w-full">Add Package</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>{pkg.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{pkg.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                  </div>
                  <Badge 
                    variant={pkg.availability === 'Available' ? 'default' : 'secondary'}
                    className={pkg.availability === 'Available' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {pkg.availability}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{pkg.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Max {pkg.groupSize} people</span>
                </div>
                <div>
                  <Badge 
                    variant="outline" 
                    className={`border-${difficultyColors[pkg.difficulty]}-300 text-${difficultyColors[pkg.difficulty]}-700`}
                  >
                    {pkg.difficulty}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-600">${pkg.price}</span>
                  <span className="text-gray-500 text-sm">/person</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Includes:</p>
                <div className="flex flex-wrap gap-1">
                  {pkg.includes.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
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

export default TourPackageManagement;
