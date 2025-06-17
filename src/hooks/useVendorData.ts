
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Vendor Properties
export const useVendorProperties = () => {
  return useQuery({
    queryKey: ['vendor-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          room_types(*),
          vehicles(*),
          tour_packages(*)
        `)
        .eq('active', true);
      
      if (error) throw error;
      return data;
    },
  });
};

// Add Property
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (propertyData: any) => {
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Property Added",
        description: "Property has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Update Property
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...propertyData }: any) => {
      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Property Updated",
        description: "Property has been updated successfully.",
      });
    },
  });
};

// Delete Property
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .update({ active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Property Deleted",
        description: "Property has been deleted successfully.",
      });
    },
  });
};

// Room Types
export const useCreateRoomType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roomData: any) => {
      const { data, error } = await supabase
        .from('room_types')
        .insert(roomData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Room Type Added",
        description: "Room type has been created successfully.",
      });
    },
  });
};

export const useUpdateRoomType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...roomData }: any) => {
      const { data, error } = await supabase
        .from('room_types')
        .update(roomData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Room Type Updated",
        description: "Room type has been updated successfully.",
      });
    },
  });
};

export const useDeleteRoomType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('room_types')
        .update({ active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Room Type Deleted",
        description: "Room type has been deleted successfully.",
      });
    },
  });
};

// Vehicles
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicleData: any) => {
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Vehicle Added",
        description: "Vehicle has been created successfully.",
      });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...vehicleData }: any) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Vehicle Updated",
        description: "Vehicle has been updated successfully.",
      });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .update({ active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Vehicle Deleted",
        description: "Vehicle has been deleted successfully.",
      });
    },
  });
};

// Tour Packages
export const useCreateTourPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tourData: any) => {
      const { data, error } = await supabase
        .from('tour_packages')
        .insert(tourData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Tour Package Added",
        description: "Tour package has been created successfully.",
      });
    },
  });
};

export const useUpdateTourPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...tourData }: any) => {
      const { data, error } = await supabase
        .from('tour_packages')
        .update(tourData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Tour Package Updated",
        description: "Tour package has been updated successfully.",
      });
    },
  });
};

export const useDeleteTourPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tour_packages')
        .update({ active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast({
        title: "Tour Package Deleted",
        description: "Tour package has been deleted successfully.",
      });
    },
  });
};
