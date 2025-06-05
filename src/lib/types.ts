// /lib/types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          name: string
          instagram_handle: string
          profile_picture_url: string | null
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          instagram_handle: string
          profile_picture_url?: string | null
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          instagram_handle?: string
          profile_picture_url?: string | null
          role?: string
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          name: string
          instagram_handle: string
          profile_picture_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          instagram_handle: string
          profile_picture_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          instagram_handle?: string
          profile_picture_url?: string | null
        }
      }
      schedules: {
        Row: {
          id: string
          created_at: string
          client_id: string
          month: number
          year: number
          public_link: string
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          month: number
          year: number
          public_link: string
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          month?: number
          year?: number
          public_link?: string
        }
      }
      schedule_items: {
        Row: {
          id: string
          created_at: string
          schedule_id: string
          art_url: string
          caption: string
          order: number
        }
        Insert: {
          id?: string
          created_at?: string
          schedule_id: string
          art_url: string
          caption: string
          order: number
        }
        Update: {
          id?: string
          created_at?: string
          schedule_id?: string
          art_url?: string
          caption?: string
          order?: number
        }
      }
      item_feedbacks: {
        Row: {
          id: string
          item_id: string
          status: string
          comment: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          item_id: string
          status: string
          comment?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          item_id?: string
          status?: string
          comment?: string | null
          created_at?: string | null
        }
      }
    }
  }
}

export type Client = Database['public']['Tables']['clients']['Row']
export type Schedule = Database['public']['Tables']['schedules']['Row']
export type ScheduleItem = Database['public']['Tables']['schedule_items']['Row']
export type ItemFeedback = Database['public']['Tables']['item_feedbacks']['Row']