import { Settings } from './Settings';
import { Category, UploadedFile } from './Category';
import { OpeningHoursException } from './OpeningHours';
import { TourmericEvent } from './Events';
import { TourmericStoreCreditData, StoreCreditCategory } from './StoreCredit';

export interface ReduxState {
  admin: any;
  firebase: FirebaseObject;
  localize: any;
  router: Router;
  editor: Editor;
}

interface Editor {
  returnLocation: string;
}

export interface FirebaseObject {
  data: FirebaseData;
  ordered: OrderedFirebaseData;
  auth: FirebaseAuth;
  profile: FirebaseProfile;
}

export interface Router {
  location: Location;
  action: string;
}

export interface Location {
  pathname: string;
  search: string;
  hash: string;
  key: string;
}

interface OrderedFirebaseData {
  events: { key: string, value: TourmericEvent }[];
  eventsongoing: { key: string, value: TourmericEvent }[];
  news: { key: string, value: SingleNewsItem }[];
  users: { key: string, value: User }[];
  uploadedArticleImages: { key: string, value: UploadedFile}[];
}

interface FirebaseData {
  settings: Settings;
  highlights: { [key: string]: HighLight };
  events: { [key: string]: TourmericEvent };
  eventsongoing: { [key: string]: TourmericEvent };
  categories: { [key: string]: Category };
  participations: { [key: string]: Participation };
  uploadedFiles: { [key: string]: UploadedFile };
  uploadedCategoryLogos: { [key: string]: UploadedFile };
  uploadedHighlightBanners: { [key: string]: UploadedFile };
  uploadedNewsImages: { [key: string]: UploadedFile };
  uploadedArticleImages: { [key: string]: UploadedFile };
  uploadedFooterItems: { [key: string]: UploadedFile };
  uploadedStoreinfoFiles: { [key: string]: UploadedFile };
  openinghoursexceptions: { [key: string]: OpeningHoursException };
  storecreditcategories: { [key: string]: StoreCreditCategory };
  users: { [key: string]: User };
  news: { [key: string]: SingleNewsItem };
  articles: { [key: string]: Article };
  storecredit: { [key: string]: { [key: string]: TourmericStoreCreditData }};
}

export interface SingleNewsItem {
  createDate: string;
  date: string;
  linkName: string;
  link: string;
  image: string;
  active: boolean;
  name: string;
  text: string;
  summary: string;
}

export interface Article {
  createDate: string;
  published: boolean;
  date: string;
  articleItems?: { [key: string]: ArticleItem };
  title: string;
  titleLocked?: boolean;
  content?: string;
}

export interface ArticleItem {
  itemType: string;
  imageUrl?: string;
  text?: string;
  orderNumber: number;
  locked?: boolean;
}

export interface HighLight {
  active: boolean;
  image: string;
  createDate: string;
  date: string;
  name: string;
}

export interface Participation {
  [key: string]: ParticipationData;
}

export interface ParticipationData {
  date: string;
  firstName: string;
  lastName: string;
  userId: string;
  comment: string;
}

export interface FirebaseAuth {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string | null;
  emailVerified: boolean;
  providerData: ProviderData;
  apiKey: string;
  isEmpty: boolean;
  isLoaded: boolean;
}

export interface ProviderData {
  displayName: string;
  email: string;
  photoURL: string;
  providerId: string;
  uid: string;
}

export interface FirebaseProfile {
  email: string;
  acceptedPrivacyPolicy?: string;
  acceptsNewsLetter?: boolean;
  avatarUrl: string;
  betaParticipation?: any;
  dciNumber: string;
  displayName: string;
  favoriteCategories?: string;
  firstName: string;
  lastName: string;
  landingPage?: PageOption;
  otherEmail?: string;
  providerData: ProviderData[];
  role: string;
  useOtherEmail?: boolean;
  isEmpty: boolean;
  isLoaded: boolean;
}

export type PageOption = 'today' | 'events' | 'storeinfo' | 'userinfo' | 'companyinfo' | 'admintools' | 'admintoolsevents' | 'adminsitesettings' | '';

export interface User {
  avatarUrl?: string;
  displayName?: string;
  providerData?: ProviderData;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  dciNumber?: string;
  role?: string;
  active: boolean;
}
