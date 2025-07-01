
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Hotel, Car, Users, Plus, Eye, Edit, Trash2, FileText } from "lucide-react";
import HotelManagement from "./HotelManagement";
import CarRentalManagement from "./CarRentalManagement";
import TourPackageManagement from "./TourPackageManagement";
import { useVendorProperties, useCreateProperty } from "@/hooks/useVendorData";
import { useCreateArticle } from "@/hooks/useArticles";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    type: "",
    description: "",
    location: "",
    address: "",
    amenities: ""
  });
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    location: "",
    excerpt: "",
    featured_image: "",
    images: "",
    published: false
  });

  const { data: properties, isLoading } = useVendorProperties();
  const createPropertyMutation = useCreateProperty();
  const createArticleMutation = useCreateArticle();

  const handleAddProperty = async () => {
    if (!newProperty.name || !newProperty.type || !newProperty.location) {
      return;
    }

    const propertyData = {
      ...newProperty,
      amenities: newProperty.amenities ? newProperty.amenities.split(',').map(a => a.trim()) : [],
      vendor_id: '00000000-0000-0000-0000-000000000000' // This will need proper vendor ID
    };

    await createPropertyMutation.mutateAsync(propertyData);
    setIsAddingProperty(false);
    setNewProperty({
      name: "",
      type: "",
      description: "",
      location: "",
      address: "",
      amenities: ""
    });
  };

  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.content || !newArticle.location) {
      return;
    }

    const articleData = {
      ...newArticle,
      images: newArticle.images ? newArticle.images.split(',').map(img => img.trim()).filter(img => img) : []
    };

    await createArticleMutation.mutateAsync(articleData);
    setIsAddingArticle(false);
    setNewArticle({
      title: "",
      content: "",
      location: "",
      excerpt: "",
      featured_image: "",
      images: "",
      published: false
    });
  };

  const stats = [
    { title: "Total Properties", value: properties?.length.toString() || "0", icon: Hotel, color: "blue" },
    { title: "Active Bookings", value: "45", icon: Users, color: "green" },
    { title: "Revenue This Month", value: "$15,240", icon: Car, color: "purple" },
    { title: "Reviews", value: "4.8/5", icon: Users, color: "yellow" },
  ];

  const recentBookings = [
    { id: 1, property: "Ocean View Hotel", guest: "John Doe", dates: "Dec 20-25", status: "confirmed", type: "hotel" },
    { id: 2, property: "City Car Rental", guest: "Jane Smith", dates: "Dec 18-22", status: "pending", type: "car" },
    { id: 3, property: "Mountain Adventure Tour", guest: "Mike Johnson", dates: "Dec 30", status: "confirmed", type: "tour" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your properties and bookings</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingProperty} onOpenChange={setIsAddingProperty}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="property-name">Property Name</Label>
                  <Input
                    id="property-name"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select value={newProperty.type} onValueChange={(value) => setNewProperty({...newProperty, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="car_rental">Car Rental</SelectItem>
                      <SelectItem value="tour">Tour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="property-location">Location</Label>
                  <Input
                    id="property-location"
                    value={newProperty.location}
                    onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="property-address">Address</Label>
                  <Input
                    id="property-address"
                    value={newProperty.address}
                    onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                    placeholder="Enter full address"
                  />
                </div>
                <div>
                  <Label htmlFor="property-description">Description</Label>
                  <Textarea
                    id="property-description"
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                    placeholder="Enter property description"
                  />
                </div>
                <div>
                  <Label htmlFor="property-amenities">Amenities (comma-separated)</Label>
                  <Input
                    id="property-amenities"
                    value={newProperty.amenities}
                    onChange={(e) => setNewProperty({...newProperty, amenities: e.target.value})}
                    placeholder="WiFi, Pool, Parking, etc."
                  />
                </div>
                <Button 
                  onClick={handleAddProperty} 
                  className="w-full"
                  disabled={createPropertyMutation.isPending}
                >
                  {createPropertyMutation.isPending ? "Adding..." : "Add Property"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingArticle} onOpenChange={setIsAddingArticle}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Write Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Write New Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="article-title">Article Title</Label>
                  <Input
                    id="article-title"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    placeholder="Enter article title"
                  />
                </div>
                <div>
                  <Label htmlFor="article-location">Location</Label>
                  <Input
                    id="article-location"
                    value={newArticle.location}
                    onChange={(e) => setNewArticle({...newArticle, location: e.target.value})}
                    placeholder="Enter location (e.g., Paris, Bali, Tokyo)"
                  />
                </div>
                <div>
                  <Label htmlFor="article-excerpt">Short Description</Label>
                  <Textarea
                    id="article-excerpt"
                    value={newArticle.excerpt}
                    onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                    placeholder="Brief description for article preview"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="article-content">Article Content</Label>
                  <Textarea
                    id="article-content"
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    placeholder="Write your article content here..."
                    rows={8}
                  />
                </div>
                <div>
                  <Label htmlFor="article-featured-image">Featured Image URL</Label>
                  <Input
                    id="article-featured-image"
                    value={newArticle.featured_image}
                    onChange={(e) => setNewArticle({...newArticle, featured_image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="article-images">Additional Images (comma-separated URLs)</Label>
                  <Textarea
                    id="article-images"
                    value={newArticle.images}
                    onChange={(e) => setNewArticle({...newArticle, images: e.target.value})}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="article-published"
                    checked={newArticle.published}
                    onCheckedChange={(checked) => setNewArticle({...newArticle, published: checked})}
                  />
                  <Label htmlFor="article-published">Publish immediately</Label>
                </div>
                <Button 
                  onClick={handleAddArticle} 
                  className="w-full"
                  disabled={createArticleMutation.isPending}
                >
                  {createArticleMutation.isPending ? "Publishing..." : "Create Article"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="cars">Car Rentals</TabsTrigger>
          <TabsTrigger value="tours">Tour Packages</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        booking.type === 'hotel' ? 'bg-blue-100' : 
                        booking.type === 'car' ? 'bg-teal-100' : 'bg-purple-100'
                      }`}>
                        {booking.type === 'hotel' ? <Hotel className="h-5 w-5 text-blue-600" /> :
                         booking.type === 'car' ? <Car className="h-5 w-5 text-teal-600" /> :
                         <Users className="h-5 w-5 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{booking.property}</p>
                        <p className="text-sm text-gray-600">{booking.guest} • {booking.dates}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotels">
          <HotelManagement />
        </TabsContent>

        <TabsContent value="cars">
          <CarRentalManagement />
        </TabsContent>

        <TabsContent value="tours">
          <TourPackageManagement />
        </TabsContent>

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Your Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No articles yet. Start writing about amazing places!</p>
                <Button onClick={() => setIsAddingArticle(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Write Your First Article
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorDashboard;
