export interface EventData {
  category: string;
  createDate: string;
  date: string;
  endDate: string;
  entryFee: string;
  eventType: string;
  name: string;
  published: boolean;
  time: string;
}

export interface Event {
  key: string;
  value: EventData;
}
