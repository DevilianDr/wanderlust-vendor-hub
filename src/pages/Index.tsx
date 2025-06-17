
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hotel, Car, MapPin, Users, Calendar, Star } from "lucide-react";
import VendorDashboard from "@/components/VendorDashboard";
import PropertyListings from "@/components/PropertyListings";
import BookingInterface from "@/components/BookingInterface";

const Index = () => {
  const [activeView, setActiveView] = useState("listings");
  const [isVendor, setIsVendor] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                TravelHub
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={!isVendor ? "default" : "outline"}
                onClick={() => setIsVendor(false)}
                className="transition-all duration-200"
              >
                Customer View
              </Button>
              <Button
                variant={isVendor ? "default" : "outline"}
                onClick={() => setIsVendor(true)}
                className="transition-all duration-200"
              >
                Vendor Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isVendor ? (
          <VendorDashboard />
        ) : (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Discover Amazing Travel Experiences
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Book hotels, rent cars, and explore tour packages from trusted vendors worldwide
              </p>
              
              {/* Service Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Hotel className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Hotels</h3>
                    <p className="text-gray-600">Comfortable stays with various room types and amenities</p>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-teal-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Car className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Car Rentals</h3>
                    <p className="text-gray-600">Reliable vehicles for your travel adventures</p>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-indigo-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Tour Packages</h3>
                    <p className="text-gray-600">Curated experiences and guided adventures</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="listings">Browse Properties</TabsTrigger>
                <TabsTrigger value="booking">Book Now</TabsTrigger>
              </TabsList>
              
              <TabsContent value="listings" className="mt-8">
                <PropertyListings />
              </TabsContent>
              
              <TabsContent value="booking" className="mt-8">
                <BookingInterface />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
