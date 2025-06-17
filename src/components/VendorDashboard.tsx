
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hotel, Car, Users, Plus, Eye, Edit, Trash2 } from "lucide-react";
import HotelManagement from "./HotelManagement";
import CarRentalManagement from "./CarRentalManagement";
import TourPackageManagement from "./TourPackageManagement";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Total Properties", value: "12", icon: Hotel, color: "blue" },
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
        <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Property
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="cars">Car Rentals</TabsTrigger>
          <TabsTrigger value="tours">Tour Packages</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default VendorDashboard;
