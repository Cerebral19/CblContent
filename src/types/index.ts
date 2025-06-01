export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  instagram_handle: string;
  profile_picture_url: string;
  created_at: string;
}

export interface Schedule {
  id: string;
  client_id: string;
  month: number;
  year: number;
  created_at: string;
  public_link: string;
}

export interface ScheduleItem {
  id: string;
  schedule_id: string;
  art_url: string;
  caption: string;
  order: number;
  created_at: string;
}

export interface Feedback {
  id: string;
  item_id: string;
  status: 'approved' | 'rejected' | 'caption_review' | 'art_review';
  comment: string;
  created_at: string;
}