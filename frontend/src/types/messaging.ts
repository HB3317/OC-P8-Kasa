export type Conversation = {
  id: number;
  property_id: string;
  property_title: string;
  client_id: number;
  owner_id: number;
  peer_name: string;
  peer_picture: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread: number;
};

export type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  created_at: string;
  read_at: string | null;
};
