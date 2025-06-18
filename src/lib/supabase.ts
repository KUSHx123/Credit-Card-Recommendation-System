import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          monthly_income: number | null;
          spending_habits: any | null;
          preferred_benefits: string[] | null;
          credit_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          monthly_income?: number | null;
          spending_habits?: any | null;
          preferred_benefits?: string[] | null;
          credit_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          monthly_income?: number | null;
          spending_habits?: any | null;
          preferred_benefits?: string[] | null;
          credit_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          assistant_id: string | null;
          thread_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assistant_id?: string | null;
          thread_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assistant_id?: string | null;
          thread_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: string;
          content?: string;
          created_at?: string;
        };
      };
      credit_cards: {
        Row: {
          id: string;
          name: string;
          issuer: string;
          image_url: string;
          joining_fee: number;
          annual_fee: number;
          reward_type: string;
          reward_rate: number;
          min_income: number;
          min_credit_score: number;
          special_perks: string[];
          categories: any;
          features: string[];
          apply_link: string;
          welcome_bonus: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          issuer: string;
          image_url: string;
          joining_fee: number;
          annual_fee: number;
          reward_type: string;
          reward_rate: number;
          min_income: number;
          min_credit_score: number;
          special_perks: string[];
          categories: any;
          features: string[];
          apply_link: string;
          welcome_bonus?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          issuer?: string;
          image_url?: string;
          joining_fee?: number;
          annual_fee?: number;
          reward_type?: string;
          reward_rate?: number;
          min_income?: number;
          min_credit_score?: number;
          special_perks?: string[];
          categories?: any;
          features?: string[];
          apply_link?: string;
          welcome_bonus?: string | null;
          created_at?: string;
        };
      };
    };
  };
};