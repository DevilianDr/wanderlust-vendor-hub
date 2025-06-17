
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  
  return useMutation({
    mutationFn: async (bookingData: any) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
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
