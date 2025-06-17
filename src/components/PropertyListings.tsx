
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Hotel, Car, Users } from "lucide-react";
import { useProperties } from "@/hooks/useSupabaseData";

const PropertyListings = () => {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading properties: {error.message}</p>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties available</h3>
        <p className="text-gray-600">Check back later for new listings.</p>
      </div>
    );
  }

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'hotel': return Hotel;
      case 'car_rental': return Car;
      case 'tour': return Users;
      default: return Hotel;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel': return 'Hotel';
      case 'car_rental': return 'Car Rental';
      case 'tour': return 'Tour Package';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Properties</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover amazing hotels, car rentals, and tour packages from verified vendors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const IconComponent = getPropertyIcon(property.type);
          const primaryImage = property.images?.[0] || '/placeholder.svg';
          
          return (
            <Card key={property.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={primaryImage} 
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90">
                    <IconComponent className="h-3 w-3 mr-1" />
                    {getTypeLabel(property.type)}
                  </Badge>
                </div>
                {property.rating > 0 && (
                  <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1 flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                    <span className="text-xs font-medium">{property.rating}</span>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{property.name}</CardTitle>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                
                {property.amenities && property.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{property.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-gray-600">
                    {property.type === 'hotel' && property.room_types?.length > 0 && (
                      <span>{property.room_types.length} room type{property.room_types.length > 1 ? 's' : ''}</span>
                    )}
                    {property.type === 'car_rental' && property.vehicles?.length > 0 && (
                      <span>{property.vehicles.length} vehicle{property.vehicles.length > 1 ? 's' : ''}</span>
                    )}
                    {property.type === 'tour' && property.tour_packages?.length > 0 && (
                      <span>{property.tour_packages.length} package{property.tour_packages.length > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </div>

                {property.deals && property.deals.length > 0 && (
                  <div className="bg-green-50 p-2 rounded-lg">
                    <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                      Special Deal Available
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyListings;
