
-- Create vendors table for vendor accounts
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create properties table for hotels, car rentals, tours
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hotel', 'car_rental', 'tour')),
  description TEXT,
  location TEXT NOT NULL,
  address TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  amenities TEXT[], -- Array of amenities
  images TEXT[], -- Array of image URLs
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room_types table for hotels
CREATE TABLE public.room_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  max_occupancy INTEGER NOT NULL DEFAULT 2,
  size_sqm INTEGER,
  amenities TEXT[], -- Array of room amenities
  images TEXT[], -- Array of room image URLs
  total_rooms INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table for car rentals
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL, -- sedan, suv, convertible, etc.
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  seats INTEGER NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  features TEXT[], -- Array of vehicle features
  images TEXT[], -- Array of vehicle image URLs
  license_plate TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tour_packages table for tours
CREATE TABLE public.tour_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL DEFAULT 1,
  max_participants INTEGER NOT NULL,
  price_per_person DECIMAL(10,2) NOT NULL,
  includes TEXT[], -- What's included in the tour
  itinerary JSONB, -- Tour itinerary details
  images TEXT[], -- Array of tour image URLs
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'challenging')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table for all types of bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users NOT NULL,
  property_id UUID REFERENCES public.properties(id) NOT NULL,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('hotel', 'car_rental', 'tour')),
  
  -- For hotel bookings
  room_type_id UUID REFERENCES public.room_types(id),
  rooms_count INTEGER DEFAULT 1,
  
  -- For car rental bookings
  vehicle_id UUID REFERENCES public.vehicles(id),
  
  -- For tour bookings
  tour_package_id UUID REFERENCES public.tour_packages(id),
  participants_count INTEGER DEFAULT 1,
  
  -- Common booking fields
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  special_requests TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create availability table for date-based availability management
CREATE TABLE public.availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('room_type', 'vehicle', 'tour_package')),
  resource_id UUID NOT NULL, -- References room_type_id, vehicle_id, or tour_package_id
  date DATE NOT NULL,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  base_price DECIMAL(10,2), -- Can override base price for specific dates
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(resource_type, resource_id, date)
);

-- Create deals table for promotions and discounts
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deal_type TEXT NOT NULL CHECK (deal_type IN ('percentage', 'fixed_amount', 'buy_one_get_one')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_stay INTEGER DEFAULT 1,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  applicable_to TEXT NOT NULL CHECK (applicable_to IN ('all', 'room_types', 'vehicles', 'tour_packages')),
  applicable_resources UUID[], -- Array of room_type_ids, vehicle_ids, or tour_package_ids
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendors
CREATE POLICY "Vendors can view their own data" ON public.vendors FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Vendors can create their own data" ON public.vendors FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Vendors can update their own data" ON public.vendors FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for properties
CREATE POLICY "Vendors can manage their properties" ON public.properties FOR ALL USING (
  vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
);
CREATE POLICY "Public can view active properties" ON public.properties FOR SELECT USING (active = true);

-- RLS Policies for room_types
CREATE POLICY "Vendors can manage their room types" ON public.room_types FOR ALL USING (
  property_id IN (
    SELECT p.id FROM public.properties p 
    JOIN public.vendors v ON p.vendor_id = v.id 
    WHERE v.user_id = auth.uid()
  )
);
CREATE POLICY "Public can view active room types" ON public.room_types FOR SELECT USING (
  active = true AND property_id IN (SELECT id FROM public.properties WHERE active = true)
);

-- RLS Policies for vehicles
CREATE POLICY "Vendors can manage their vehicles" ON public.vehicles FOR ALL USING (
  property_id IN (
    SELECT p.id FROM public.properties p 
    JOIN public.vendors v ON p.vendor_id = v.id 
    WHERE v.user_id = auth.uid()
  )
);
CREATE POLICY "Public can view active vehicles" ON public.vehicles FOR SELECT USING (
  active = true AND property_id IN (SELECT id FROM public.properties WHERE active = true)
);

-- RLS Policies for tour_packages
CREATE POLICY "Vendors can manage their tour packages" ON public.tour_packages FOR ALL USING (
  property_id IN (
    SELECT p.id FROM public.properties p 
    JOIN public.vendors v ON p.vendor_id = v.id 
    WHERE v.user_id = auth.uid()
  )
);
CREATE POLICY "Public can view active tour packages" ON public.tour_packages FOR SELECT USING (
  active = true AND property_id IN (SELECT id FROM public.properties WHERE active = true)
);

-- RLS Policies for bookings
CREATE POLICY "Customers can view their own bookings" ON public.bookings FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Vendors can view bookings for their properties" ON public.bookings FOR SELECT USING (
  property_id IN (
    SELECT p.id FROM public.properties p 
    JOIN public.vendors v ON p.vendor_id = v.id 
    WHERE v.user_id = auth.uid()
  )
);
CREATE POLICY "Vendors can update bookings for their properties" ON public.bookings FOR UPDATE USING (
  property_id IN (
    SELECT p.id FROM public.properties p 
    JOIN public.vendors v ON p.vendor_id = v.id 
    WHERE v.user_id = auth.uid()
  )
);

-- RLS Policies for availability
CREATE POLICY "Vendors can manage availability for their resources" ON public.availability FOR ALL USING (
  CASE 
    WHEN resource_type = 'room_type' THEN 
      resource_id IN (
        SELECT rt.id FROM public.room_types rt
        JOIN public.properties p ON rt.property_id = p.id
        JOIN public.vendors v ON p.vendor_id = v.id
        WHERE v.user_id = auth.uid()
      )
    WHEN resource_type = 'vehicle' THEN 
      resource_id IN (
        SELECT vh.id FROM public.vehicles vh
        JOIN public.properties p ON vh.property_id = p.id
        JOIN public.vendors v ON p.vendor_id = v.id
        WHERE v.user_id = auth.uid()
      )
    WHEN resource_type = 'tour_package' THEN 
      resource_id IN (
        SELECT tp.id FROM public.tour_packages tp
        JOIN public.properties p ON tp.property_id = p.id
        JOIN public.vendors v ON p.vendor_id = v.id
        WHERE v.user_id = auth.uid()
      )
    ELSE false
  END
);
CREATE POLICY "Public can view availability" ON public.availability FOR SELECT USING (true);

-- RLS Policies for deals
CREATE POLICY "Vendors can manage their deals" ON public.deals FOR ALL USING (
  property_id IN (
    SELECT p.id FROM public.properties p 
    JOIN public.vendors v ON p.vendor_id = v.id 
    WHERE v.user_id = auth.uid()
  )
);
CREATE POLICY "Public can view active deals" ON public.deals FOR SELECT USING (
  active = true AND valid_from <= CURRENT_DATE AND valid_until >= CURRENT_DATE
);

-- Create indexes for better performance
CREATE INDEX idx_properties_vendor_id ON public.properties(vendor_id);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_room_types_property_id ON public.room_types(property_id);
CREATE INDEX idx_vehicles_property_id ON public.vehicles(property_id);
CREATE INDEX idx_tour_packages_property_id ON public.tour_packages(property_id);
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX idx_availability_resource ON public.availability(resource_type, resource_id, date);
CREATE INDEX idx_deals_property_id ON public.deals(property_id);
CREATE INDEX idx_deals_dates ON public.deals(valid_from, valid_until);

-- Create function to automatically manage availability when bookings are made
CREATE OR REPLACE FUNCTION update_availability_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle hotel bookings
  IF NEW.booking_type = 'hotel' AND NEW.room_type_id IS NOT NULL THEN
    -- Reduce availability for each day of the booking
    WITH date_series AS (
      SELECT generate_series(NEW.check_in_date, NEW.check_out_date - INTERVAL '1 day', INTERVAL '1 day')::date AS booking_date
    )
    INSERT INTO public.availability (resource_type, resource_id, date, available_quantity)
    SELECT 'room_type', NEW.room_type_id, booking_date, 
           COALESCE((SELECT total_rooms FROM public.room_types WHERE id = NEW.room_type_id), 0) - NEW.rooms_count
    FROM date_series
    ON CONFLICT (resource_type, resource_id, date) 
    DO UPDATE SET available_quantity = availability.available_quantity - NEW.rooms_count;
    
  -- Handle car rental bookings
  ELSIF NEW.booking_type = 'car_rental' AND NEW.vehicle_id IS NOT NULL THEN
    WITH date_series AS (
      SELECT generate_series(NEW.check_in_date, NEW.check_out_date - INTERVAL '1 day', INTERVAL '1 day')::date AS booking_date
    )
    INSERT INTO public.availability (resource_type, resource_id, date, available_quantity)
    SELECT 'vehicle', NEW.vehicle_id, booking_date, 0
    FROM date_series
    ON CONFLICT (resource_type, resource_id, date) 
    DO UPDATE SET available_quantity = 0;
    
  -- Handle tour bookings
  ELSIF NEW.booking_type = 'tour' AND NEW.tour_package_id IS NOT NULL THEN
    INSERT INTO public.availability (resource_type, resource_id, date, available_quantity)
    VALUES ('tour_package', NEW.tour_package_id, NEW.check_in_date, 
            COALESCE((SELECT max_participants FROM public.tour_packages WHERE id = NEW.tour_package_id), 0) - NEW.participants_count)
    ON CONFLICT (resource_type, resource_id, date) 
    DO UPDATE SET available_quantity = availability.available_quantity - NEW.participants_count;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking availability management
CREATE TRIGGER booking_availability_trigger
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_availability_on_booking();

-- Create function to restore availability when bookings are cancelled
CREATE OR REPLACE FUNCTION restore_availability_on_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only restore if booking is being cancelled
  IF OLD.booking_status != 'cancelled' AND NEW.booking_status = 'cancelled' THEN
    -- Handle hotel bookings
    IF NEW.booking_type = 'hotel' AND NEW.room_type_id IS NOT NULL THEN
      WITH date_series AS (
        SELECT generate_series(NEW.check_in_date, NEW.check_out_date - INTERVAL '1 day', INTERVAL '1 day')::date AS booking_date
      )
      UPDATE public.availability 
      SET available_quantity = available_quantity + NEW.rooms_count
      WHERE resource_type = 'room_type' 
        AND resource_id = NEW.room_type_id 
        AND date IN (SELECT booking_date FROM date_series);
        
    -- Handle car rental bookings
    ELSIF NEW.booking_type = 'car_rental' AND NEW.vehicle_id IS NOT NULL THEN
      WITH date_series AS (
        SELECT generate_series(NEW.check_in_date, NEW.check_out_date - INTERVAL '1 day', INTERVAL '1 day')::date AS booking_date
      )
      UPDATE public.availability 
      SET available_quantity = 1
      WHERE resource_type = 'vehicle' 
        AND resource_id = NEW.vehicle_id 
        AND date IN (SELECT booking_date FROM date_series);
        
    -- Handle tour bookings
    ELSIF NEW.booking_type = 'tour' AND NEW.tour_package_id IS NOT NULL THEN
      UPDATE public.availability 
      SET available_quantity = available_quantity + NEW.participants_count
      WHERE resource_type = 'tour_package' 
        AND resource_id = NEW.tour_package_id 
        AND date = NEW.check_in_date;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cancellation availability restoration
CREATE TRIGGER booking_cancellation_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION restore_availability_on_cancellation();
