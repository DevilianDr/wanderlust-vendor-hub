
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyListings from "@/components/PropertyListings";
import BookingInterface from "@/components/BookingInterface";
import VendorDashboard from "@/components/VendorDashboard";
import ArticlesList from "@/components/ArticlesList";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Properties</TabsTrigger>
            <TabsTrigger value="articles">Travel Articles</TabsTrigger>
            <TabsTrigger value="book">Book Now</TabsTrigger>
            <TabsTrigger value="vendor">Vendor Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <PropertyListings />
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <ArticlesList />
          </TabsContent>

          <TabsContent value="book" className="mt-6">
            <ProtectedRoute>
              <BookingInterface />
            </ProtectedRoute>
          </TabsContent>

          <TabsContent value="vendor" className="mt-6">
            <ProtectedRoute>
              <VendorDashboard />
            </ProtectedRoute>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
