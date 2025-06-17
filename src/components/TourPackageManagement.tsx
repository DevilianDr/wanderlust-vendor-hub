import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Edit, Trash2, Clock, MapPin, Star } from "lucide-react";
import { useVendorProperties, useCreateTourPackage, useUpdateTourPackage, useDeleteTourPackage } from "@/hooks/useVendorData";

const TourPackageManagement = () => {
  const { data: properties, isLoading } = useVendorProperties();
  const createTourMutation = useCreateTourPackage();
  const updateTourMutation = useUpdateTourPackage();
  const deleteTourMutation = useDeleteTourPackage();

  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [tourFormData, setTourFormData] = useState({
    name: "",
    description: "",
    duration_days: "1",
    max_participants: "",
    price_per_person: "",
    difficulty_level: "",
    includes: ""
  });

  const tourProperties = properties?.filter(p => p.type === 'tour') || [];

  const difficultyColors: { [key: string]: string } = {
    "easy": "green",
    "moderate": "yellow",
    "challenging": "red"
  };

  const handleAddTour = async () => {
    if (!selectedProperty || !tourFormData.name || !tourFormData.price_per_person || !tourFormData.max_participants) {
      return;
    }

    const tourData = {
      property_id: selectedProperty.id,
      name: tourFormData.name,
      description: tourFormData.description,
      duration_days: parseInt(tourFormData.duration_days),
      max_participants: parseInt(tourFormData.max_participants),
      price_per_person: parseFloat(tourFormData.price_per_person),
      difficulty_level: tourFormData.difficulty_level,
      includes: tourFormData.includes ? tourFormData.includes.split(',').map(i => i.trim()) : []
    };

    await createTourMutation.mutateAsync(tourData);
    setIsAddingTour(false);
    resetForm();
  };

  const handleEditTour = async () => {
    if (!editingTour || !tourFormData.name || !tourFormData.price_per_person || !tourFormData.max_participants) {
      return;
    }

    const tourData = {
      id: editingTour.id,
      name: tourFormData.name,
      description: tourFormData.description,
      duration_days: parseInt(tourFormData.duration_days),
      max_participants: parseInt(tourFormData.max_participants),
      price_per_person: parseFloat(tourFormData.price_per_person),
      difficulty_level: tourFormData.difficulty_level,
      includes: tourFormData.includes ? tourFormData.includes.split(',').map(i => i.trim()) : []
    };

    await updateTourMutation.mutateAsync(tourData);
    setEditingTour(null);
    resetForm();
  };

  const handleDeleteTour = async (tourId: string) => {
    await deleteTourMutation.mutateAsync(tourId);
  };

  const resetForm = () => {
    setTourFormData({
      name: "",
      description: "",
      duration_days: "1",
      max_participants: "",
      price_per_person: "",
      difficulty_level: "",
      includes: ""
    });
  };

  const openEditDialog = (tour: any) => {
    setEditingTour(tour);
    setTourFormData({
      name: tour.name,
      description: tour.description || "",
      duration_days: tour.duration_days.toString(),
      max_participants: tour.max_participants.toString(),
      price_per_person: tour.price_per_person.toString(),
      difficulty_level: tour.difficulty_level || "",
      includes: tour.includes ? tour.includes.join(', ') : ""
    });
  };

  if (isLoading) {
    return <div>Loading tour packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tour Package Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tourProperties.map((property) => (
          <div key={property.id} className="space-y-4">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>{property.name}</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedProperty(property);
                      setIsAddingTour(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Package
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{property.location}</span>
                </div>
                
                <div className="space-y-3">
                  {property.tour_packages?.map((tour: any) => (
                    <div key={tour.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{tour.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{tour.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-purple-600">${tour.price_per_person}</span>
                          <span className="text-gray-500 text-sm">/person</span>
                          <div className="flex space-x-1 mt-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => openEditDialog(tour)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteTour(tour.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span>{tour.duration_days} day{tour.duration_days > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span>Max {tour.max_participants} people</span>
                        </div>
                        {tour.difficulty_level && (
                          <div>
                            <Badge 
                              variant="outline" 
                              className={`border-${difficultyColors[tour.difficulty_level]}-300 text-${difficultyColors[tour.difficulty_level]}-700`}
                            >
                              {tour.difficulty_level}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {tour.includes && tour.includes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Includes:</p>
                          <div className="flex flex-wrap gap-1">
                            {tour.includes.map((item: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
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

      {/* Add Tour Package Dialog */}
      <Dialog open={isAddingTour} onOpenChange={setIsAddingTour}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Tour Package to {selectedProperty?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tour-name">Package Name</Label>
              <Input 
                id="tour-name" 
                placeholder="Amazing Adventure Tour" 
                value={tourFormData.name}
                onChange={(e) => setTourFormData({...tourFormData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="tour-description">Description</Label>
              <Textarea 
                id="tour-description" 
                placeholder="Describe the tour experience" 
                value={tourFormData.description}
                onChange={(e) => setTourFormData({...tourFormData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input 
                  id="duration" 
                  type="number"
                  placeholder="1" 
                  value={tourFormData.duration_days}
                  onChange={(e) => setTourFormData({...tourFormData, duration_days: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="price">Price per Person ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="299" 
                  value={tourFormData.price_per_person}
                  onChange={(e) => setTourFormData({...tourFormData, price_per_person: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max-participants">Max Participants</Label>
                <Input 
                  id="max-participants" 
                  type="number" 
                  placeholder="12" 
                  value={tourFormData.max_participants}
                  onChange={(e) => setTourFormData({...tourFormData, max_participants: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={tourFormData.difficulty_level} onValueChange={(value) => setTourFormData({...tourFormData, difficulty_level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="includes">Includes (comma-separated)</Label>
              <Input 
                id="includes" 
                placeholder="Guide, Meals, Equipment" 
                value={tourFormData.includes}
                onChange={(e) => setTourFormData({...tourFormData, includes: e.target.value})}
              />
            </div>
            <Button 
              className="w-full"
              onClick={handleAddTour}
              disabled={createTourMutation.isPending}
            >
              {createTourMutation.isPending ? "Adding..." : "Add Tour Package"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tour Package Dialog */}
      <Dialog open={!!editingTour} onOpenChange={(open) => !open && setEditingTour(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tour Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-tour-name">Package Name</Label>
              <Input 
                id="edit-tour-name" 
                placeholder="Amazing Adventure Tour" 
                value={tourFormData.name}
                onChange={(e) => setTourFormData({...tourFormData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-tour-description">Description</Label>
              <Textarea 
                id="edit-tour-description" 
                placeholder="Describe the tour experience" 
                value={tourFormData.description}
                onChange={(e) => setTourFormData({...tourFormData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-duration">Duration (days)</Label>
                <Input 
                  id="edit-duration" 
                  type="number"
                  placeholder="1" 
                  value={tourFormData.duration_days}
                  onChange={(e) => setTourFormData({...tourFormData, duration_days: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price per Person ($)</Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  placeholder="299" 
                  value={tourFormData.price_per_person}
                  onChange={(e) => setTourFormData({...tourFormData, price_per_person: e.target.value})}
                />
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={handleEditTour}
              disabled={updateTourMutation.isPending}
            >
              {updateTourMutation.isPending ? "Updating..." : "Update Tour Package"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TourPackageManagement;
