export interface Message {
  id: string;
  created_at: string;
  content: string;
  sender_type: string;
  conversation_id?: string;
  isNewBotMessage?: boolean;
  is_negative_feedback?: boolean;
  cited_excerpts?: Array<{
    id: string;
    source_id: number;
    text: string;
    page: number;
    score: number;
  }>;
}
