export interface Profile {
  id?: number;
  instagram_url?: string;
  username: string;
  full_name?: string;
  bio: string;
  website?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  language?: string;
  followers: number;
}

export interface List {
  id: number;
  name: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

interface ListProfile {
  list_id: number;
  profile_id: number;
  created_at?: string;
}