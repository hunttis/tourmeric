export interface TourmericStoreCreditData {
  date: string;
  creditAddedByName: string;
  creditAddedBy?: string;
  note: string;
  value: number;
  category: CreditCategories;
  userId: string;
}

export interface StoreCreditCategory { [key: string]: string }

export const CATEGORY_RED: CreditCategories = 'red';
export const CATEGORY_YELLOW: CreditCategories = 'yellow';
export const CATEGORY_GREEN: CreditCategories = 'green';
export const CATEGORY_BLUE: CreditCategories = 'blue';
export const CATEGORY_WHITE: CreditCategories = '';
export const CATEGORY_UNCATEGORIZED: CreditCategories = 'uncategorized';

export type CreditCategories = 'yellow' | 'red' | 'green' | 'blue' | '' | 'uncategorized';
