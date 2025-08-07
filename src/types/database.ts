export interface Booking {
  id: string;
  created_at: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  consultation_type: 'Text' | 'Voice' | 'Video';
  duration_minutes: number;
  total_amount: number;
  consultant_profiles: {
    user_id: string;
    full_name: string;
    title: string;
  } | null;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}