import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface School {
  id: string;
  school_id: string; // Format: NC-XXXXXXXX
  name: string;
  state: string;
  lga: string;
  chapter: string;
  proprietor_id: string;
  type: string;
  category: string;
  address: string;
  total_enrollment: number;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'suspended';
}

export interface Proprietor {
  id: string;
  submission_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
  passport_photo_url?: string;
  chapters: string[];
  napps_registered: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  reference: string;
  proprietor_id: string;
  school_id: string;
  amount: number;
  dues_breakdown: {
    local: number;
    state: number;
    zonal: number;
    national: number;
    id_card: number;
  };
  deductions: {
    national: number;
    zonal: number;
    state: number;
  };
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'opay' | 'bank_transfer';
  receipt_number: string;
  school_id_generated?: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  school_id: string;
  level: string;
  male: number;
  female: number;
  created_at: string;
}
