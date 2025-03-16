export type MessageType = 
  | '1er_message'
  | '1er_followup'
  | '2eme_followup'
  | '3eme_followup'
  | '4eme_followup'
  | '5eme_followup'
  | 'rdv'
  | 'pas_interesse'
  | 'non_contacté';

export type Status =
  | 'non_contacté'
  | 'message_envoye'
  | 'en_discussion'
  | 'rdv'
  | 'pas_interesse';

export interface Message {
  id: number;
  profile_id: number;
  type: MessageType;
  sent_at: string;
  created_at: string;
}

export interface FollowUpProfile {
  id: number;
  instagram_url: string;
  username: string;
  full_name: string;
  list_id: number;
  list_name: string;
  status: Status;
  messages: Message[];
  start_date: string;
}

interface DateRange {
  start: Date;
  end: Date;
}