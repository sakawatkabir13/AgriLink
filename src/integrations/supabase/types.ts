export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      demand_alerts: {
        Row: {
          buyer_count: number | null
          created_at: string
          crop_name: string
          id: string
          is_active: boolean | null
          message: string | null
          quantity_needed: number
          region: string
          unit: string
          urgency: string
        }
        Insert: {
          buyer_count?: number | null
          created_at?: string
          crop_name: string
          id?: string
          is_active?: boolean | null
          message?: string | null
          quantity_needed: number
          region: string
          unit?: string
          urgency?: string
        }
        Update: {
          buyer_count?: number | null
          created_at?: string
          crop_name?: string
          id?: string
          is_active?: boolean | null
          message?: string | null
          quantity_needed?: number
          region?: string
          unit?: string
          urgency?: string
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          category: string
          change_percent: number | null
          crop_name: string
          id: string
          price_per_unit: number
          recorded_at: string
          region: string
          trend: string
          unit: string
        }
        Insert: {
          category: string
          change_percent?: number | null
          crop_name: string
          id?: string
          price_per_unit: number
          recorded_at?: string
          region: string
          trend?: string
          unit?: string
        }
        Update: {
          category?: string
          change_percent?: number | null
          crop_name?: string
          id?: string
          price_per_unit?: number
          recorded_at?: string
          region?: string
          trend?: string
          unit?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          is_wholesale: boolean | null
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_wholesale?: boolean | null
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          is_wholesale?: boolean | null
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          delivery_charge: number
          id: string
          region: string
          status: string
          stripe_payment_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          delivery_charge?: number
          id?: string
          region: string
          status?: string
          stripe_payment_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          delivery_charge?: number
          id?: string
          region?: string
          status?: string
          stripe_payment_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          approval_status: string
          category: string
          created_at: string
          description: string | null
          farmer_id: string
          freshness_days: number
          id: string
          image_url: string | null
          is_active: boolean | null
          min_wholesale_qty: number
          name: string
          quality_grade: string
          quantity_available: number
          region: string
          retail_price: number
          unit: string
          updated_at: string
          wholesale_price: number
        }
        Insert: {
          approval_status?: string
          category: string
          created_at?: string
          description?: string | null
          farmer_id: string
          freshness_days?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_wholesale_qty?: number
          name: string
          quality_grade?: string
          quantity_available?: number
          region: string
          retail_price: number
          unit?: string
          updated_at?: string
          wholesale_price: number
        }
        Update: {
          approval_status?: string
          category?: string
          created_at?: string
          description?: string | null
          farmer_id?: string
          freshness_days?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_wholesale_qty?: number
          name?: string
          quality_grade?: string
          quantity_available?: number
          region?: string
          retail_price?: number
          unit?: string
          updated_at?: string
          wholesale_price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          crops_grown: string[] | null
          email: string
          farm_name: string | null
          farm_size: string | null
          full_name: string
          id: string
          is_verified_supplier: boolean | null
          phone: string | null
          region: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          crops_grown?: string[] | null
          email: string
          farm_name?: string | null
          farm_size?: string | null
          full_name: string
          id?: string
          is_verified_supplier?: boolean | null
          phone?: string | null
          region?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          crops_grown?: string[] | null
          email?: string
          farm_name?: string | null
          farm_size?: string | null
          full_name?: string
          id?: string
          is_verified_supplier?: boolean | null
          phone?: string | null
          region?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      supply_history: {
        Row: {
          buyer_name: string | null
          created_at: string
          crop_name: string
          delivered_at: string
          farmer_id: string
          id: string
          payment_status: string
          price_per_unit: number
          quantity: number
          region: string
          total_amount: number
          unit: string
        }
        Insert: {
          buyer_name?: string | null
          created_at?: string
          crop_name: string
          delivered_at?: string
          farmer_id: string
          id?: string
          payment_status?: string
          price_per_unit: number
          quantity: number
          region: string
          total_amount: number
          unit?: string
        }
        Update: {
          buyer_name?: string | null
          created_at?: string
          crop_name?: string
          delivered_at?: string
          farmer_id?: string
          id?: string
          payment_status?: string
          price_per_unit?: number
          quantity?: number
          region?: string
          total_amount?: number
          unit?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "buyer" | "farmer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "buyer", "farmer"],
    },
  },
} as const
