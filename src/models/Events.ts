export interface TourmericEvent {
  category: string;
  createDate: string;
  date: string;
  endDate?: string;
  format?: string | null;
  entryFee: string;
  eventType?: string;
  name: string;
  published?: boolean;
  time: string;
  rulesLevel?: string;
  playerSlots?: string;
  prizes?: string;
  link?: string;
  notes?: string;
  rules?: string;
}

export interface TourmericEventEntry {
  key: string;
  value: TourmericEvent;
}
