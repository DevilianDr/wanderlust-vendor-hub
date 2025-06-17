
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hotel, Car, Users, Star, MapPin, Calendar } from "lucide-react";

const PropertyListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const properties = [
    {
      id: 1,
      type: "hotel",
      name: "Ocean View Resort",
      location: "Miami Beach, FL",
      rating: 4.8,
      price: 120,
      priceUnit: "night",
      image: "/placeholder.svg",
      description: "Luxury beachfront resort with stunning ocean views",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant"]
    },
    {
      id: 2,
      type: "car",
      name: "Tesla Model 3",
      location: "Downtown Miami",
      rating: 4.9,
      price: 120,
      priceUnit: "day",
      image: "/placeholder.svg",
      description: "Premium electric vehicle with autopilot features",
      amenities: ["GPS", "Bluetooth", "AC", "Supercharging"]
    },
    {
      id: 3,
      type: "tour",
      name: "Miami Beach Adventure",
      location: "Miami, FL",
      rating: 4.7,
      price: 299,
      priceUnit: "person",
      image: "/placeholder.svg",
      description: "3-day adventure exploring beautiful beaches and nightlife",
      amenities: ["Guide", "Transport", "Meals", "Activities"]
    },
    {
      id: 4,
      type: "hotel",
      name: "Mountain Lodge",
      location: "Aspen, CO",
      rating: 4.6,
      price: 180,
      priceUnit: "night",
      image: "/placeholder.svg",
      description: "Cozy mountain retreat perfect for winter getaways",
      amenities: ["WiFi", "Fireplace", "Hot Tub", "Ski Storage"]
    },
    {
      id: 5,
      type: "car",
      name: "Jeep Wrangler",
      location: "Denver, CO",
      rating: 4.5,
      price: 95,
      priceUnit: "day",
      image: "/placeholder.svg",
      description: "Perfect for mountain adventures and off-road exploration",
      amenities: ["4WD", "GPS", "Bluetooth", "AC"]
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hotel': return Hotel;
      case 'car': return Car;
      case 'tour': return Users;
      default: return Hotel;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'hotel': return 'blue';
      case 'car': return 'teal';
      case 'tour': return 'purple';
      default: return 'gray';
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || property.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search properties or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="hotel">Hotels</SelectItem>
            <SelectItem value="car">Car Rentals</SelectItem>
            <SelectItem value="tour">Tour Packages</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const TypeIcon = getTypeIcon(property.type);
          const typeColor = getTypeColor(property.type);
          
          return (
            <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                  <TypeIcon className={`h-16 w-16 text-${typeColor}-400`} />
                </div>
                <Badge 
                  className={`absolute top-3 left-3 bg-${typeColor}-600 hover:bg-${typeColor}-700`}
                >
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </Badge>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">{property.rating}</span>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                    {property.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{property.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className={`text-2xl font-bold text-${typeColor}-600`}>
                      ${property.price}
                    </span>
                    <span className="text-gray-500 text-sm">/{property.priceUnit}</span>
                  </div>
                  <Button className={`bg-${typeColor}-600 hover:bg-${typeColor}-700`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyListings;
