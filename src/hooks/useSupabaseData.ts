
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          room_types(*),
          vehicles(*),
          tour_packages(*),
          deals(*)
        `)
        .eq('active', true);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (bookingData: any) => {
      if (!user) throw new Error('User must be authenticated to create bookings');
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id, // Ensure user_id is set for RLS
          customer_id: user.id // Keep existing field for compatibility
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
};

export const useAvailability = (resourceType: string, resourceId: string, dateRange: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['availability', resourceType, resourceId, dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId)
        .gte('date', dateRange.start)
        .lte('date', dateRange.end);
      
      if (error) throw error;
      return data;
    },
    enabled: !!resourceType && !!resourceId && !!dateRange.start && !!dateRange.end,
  });
};
