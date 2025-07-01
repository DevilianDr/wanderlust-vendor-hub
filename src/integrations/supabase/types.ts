export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          images: string[] | null
          location: string
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          location: string
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          location?: string
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          available_quantity: number
          base_price: number | null
          created_at: string
          date: string
          id: string
          resource_id: string
          resource_type: string
          updated_at: string
        }
        Insert: {
          available_quantity?: number
          base_price?: number | null
          created_at?: string
          date: string
          id?: string
          resource_id: string
          resource_type: string
          updated_at?: string
        }
        Update: {
          available_quantity?: number
          base_price?: number | null
          created_at?: string
          date?: string
          id?: string
          resource_id?: string
          resource_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_status: string
          booking_type: string
          check_in_date: string
          check_out_date: string
          created_at: string
          customer_id: string
          id: string
          participants_count: number | null
          payment_status: string
          property_id: string
          room_type_id: string | null
          rooms_count: number | null
          special_requests: string | null
          total_amount: number
          tour_package_id: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          booking_status?: string
          booking_type: string
          check_in_date: string
          check_out_date: string
          created_at?: string
          customer_id: string
          id?: string
          participants_count?: number | null
          payment_status?: string
          property_id: string
          room_type_id?: string | null
          rooms_count?: number | null
          special_requests?: string | null
          total_amount: number
          tour_package_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          booking_status?: string
          booking_type?: string
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          customer_id?: string
          id?: string
          participants_count?: number | null
          payment_status?: string
          property_id?: string
          room_type_id?: string | null
          rooms_count?: number | null
          special_requests?: string | null
          total_amount?: number
          tour_package_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tour_package_id_fkey"
            columns: ["tour_package_id"]
            isOneToOne: false
            referencedRelation: "tour_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          active: boolean | null
          applicable_resources: string[] | null
          applicable_to: string
          created_at: string
          deal_type: string
          description: string | null
          discount_value: number
          id: string
          max_uses: number | null
          minimum_stay: number | null
          property_id: string
          title: string
          updated_at: string
          used_count: number | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          active?: boolean | null
          applicable_resources?: string[] | null
          applicable_to: string
          created_at?: string
          deal_type: string
          description?: string | null
          discount_value: number
          id?: string
          max_uses?: number | null
          minimum_stay?: number | null
          property_id: string
          title: string
          updated_at?: string
          used_count?: number | null
          valid_from: string
          valid_until: string
        }
        Update: {
          active?: boolean | null
          applicable_resources?: string[] | null
          applicable_to?: string
          created_at?: string
          deal_type?: string
          description?: string | null
          discount_value?: number
          id?: string
          max_uses?: number | null
          minimum_stay?: number | null
          property_id?: string
          title?: string
          updated_at?: string
          used_count?: number | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          active: boolean | null
          address: string | null
          amenities: string[] | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          location: string
          name: string
          rating: number | null
          type: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location: string
          name: string
          rating?: number | null
          type: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location?: string
          name?: string
          rating?: number | null
          type?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          active: boolean | null
          amenities: string[] | null
          base_price: number
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          max_occupancy: number
          name: string
          property_id: string
          size_sqm: number | null
          total_rooms: number
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          amenities?: string[] | null
          base_price: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          max_occupancy?: number
          name: string
          property_id: string
          size_sqm?: number | null
          total_rooms?: number
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          amenities?: string[] | null
          base_price?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          max_occupancy?: number
          name?: string
          property_id?: string
          size_sqm?: number | null
          total_rooms?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_packages: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_days: number
          id: string
          images: string[] | null
          includes: string[] | null
          itinerary: Json | null
          max_participants: number
          name: string
          price_per_person: number
          property_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_days?: number
          id?: string
          images?: string[] | null
          includes?: string[] | null
          itinerary?: Json | null
          max_participants: number
          name: string
          price_per_person: number
          property_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_days?: number
          id?: string
          images?: string[] | null
          includes?: string[] | null
          itinerary?: Json | null
          max_participants?: number
          name?: string
          price_per_person?: number
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_packages_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          active: boolean | null
          created_at: string
          daily_rate: number
          features: string[] | null
          fuel_type: string
          id: string
          images: string[] | null
          license_plate: string | null
          make: string
          model: string
          property_id: string
          seats: number
          transmission: string
          type: string
          updated_at: string
          year: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          daily_rate: number
          features?: string[] | null
          fuel_type: string
          id?: string
          images?: string[] | null
          license_plate?: string | null
          make: string
          model: string
          property_id: string
          seats: number
          transmission: string
          type: string
          updated_at?: string
          year: number
        }
        Update: {
          active?: boolean | null
          created_at?: string
          daily_rate?: number
          features?: string[] | null
          fuel_type?: string
          id?: string
          images?: string[] | null
          license_plate?: string | null
          make?: string
          model?: string
          property_id?: string
          seats?: number
          transmission?: string
          type?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          business_name: string
          created_at: string
          email: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          business_name: string
          created_at?: string
          email: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          business_name?: string
          created_at?: string
          email?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
