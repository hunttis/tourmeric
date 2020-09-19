
export interface Settings {
  activeLocationImage?: string;
  activeLogo: string;
  browserTitle?: string;
  companyinfo?: string;
  dateFormat: string;
  features?: Features;
  introText?: string;
  location?: Location;
  openingHours?: OpeningHours;
  pageSubtitle: string;
  pageTitle: string;
  privacyPolicy?: string;
  showSponsors?: boolean;
  subtitleTextColor: string;
  theme: string;
  titleBarAngle: string;
  titleBarColor: string;
  titleBarColor2: string;
  titleBarPercentage: string;
  titleTextColor: string;
  footer?: {[key: string]: Footer};
  locationImage?: string;
}

interface Features {
  events: Feature;
  highlights: Feature;
  storeinfo: Feature;
}

interface Feature {
  active: boolean;
  introtext: boolean;
}

interface Location {
  address: string;
  directions: string;
  email: string;
  phone: string;
}


export interface OpeningHours {
  additionalinfo: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Footer {
  link: string;
  image: string;
  text: string;
}
