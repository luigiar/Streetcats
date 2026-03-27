export interface Comment {
  id?: number;
  cat_id: number;
  user_id?: number;
  username?: string;
  content: string;
  created_at?: string;
}
