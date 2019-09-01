import { FirebaseProfile, Participation, User, ProviderData, Location } from '~/models/ReduxState';
import { TourmericEvent } from '~/models/Events';
import { Settings } from '~/models/Settings';
import { UploadedFile, Category } from '~/models/Category';

export const mockEventId = 'mockEvent1';

export const mockUserId = 'mockUserId';

export const mockLocation: Location = {
  pathname: '/events/2018/10',
  search: 'search',
  hash: 'hash',
  key: 'key',
};

export const mockProviderData: ProviderData = {
  displayName: 'MockName',
  email: 'mock@userton.com',
  photoURL: 'http://url',
  providerId: 'facebook',
  uid: '1234567890',
};

export const mockUser: User = {
  avatarUrl: 'http://www.google.fi/google.png',
  displayName: 'Mock Userton',
  firstName: 'Mock',
  lastName: 'Userton',
  providerData: mockProviderData,
  email: 'mock@userton.com',
  username: 'Mockie',
  dciNumber: '123456',
  role: 'user',
  active: true,
};

export const mockProfile: FirebaseProfile = {
  avatarUrl: 'https://foo.com/picture',
  dciNumber: '123512351112',
  displayName: 'Test Person',
  email: 'fake@fake.com',
  firstName: 'Test',
  lastName: 'Person',
  providerData: [{
    displayName: 'Test Person',
    email: 'fake@fake.com',
    photoURL: 'https://foo.com/picture',
    providerId: 'facebook.com',
    uid: '1234567890',
  }],
  role: 'admin',
  isEmpty: false,
  isLoaded: true,
};

export const mockSingleEvent: TourmericEvent = {
  category: 'category1',
  createDate: '2018-05-24T17:00:46.500Z',
  date: '2018-09-24',
  entryFee: '10',
  format: 'Miniatures',
  link: 'http://www.google.fi',
  name: 'Warhammer thing',
  notes: 'Bring your war face!',
  playerSlots: '10',
  prizes: 'Glory!',
  published: true,
  rulesLevel: 'Casual',
  time: 'Kill everything',
  eventType: 'single',
};

export const mockUnorderedEvents: {[key: string]: TourmericEvent} = {
  mockEvent1: mockSingleEvent,
  mockEvent2: {
    category: 'category2',
    createDate: '2018-05-20T16:46:32.009Z',
    date: '2018-05-20',
    entryFee: '6',
    format: 'Standard',
    name: 'Tapahtuma',
    notes: 'FIJoijgasdsdgasdggagads',
    playerSlots: '14',
    prizes: 'Foooooooooooooooo',
    rulesLevel: 'Competitive',
    time: '10:00',
  },
  mockEvent3: {
    category: 'category2',
    createDate: '2018-05-20T16:04:29.595Z',
    date: '2018-05-21',
    entryFee: '5',
    format: 'Modern',
    link: 'https://magic.wizards.com/en/game-info/gameplay/formats/modern',
    name: 'Monday Modern',
    notes: 'Bring a friend!',
    playerSlots: '31',
    prizes: 'Three (3) OMG credits per player into the prizepool.',
    published: true,
    rulesLevel: 'Regular',
    time: '19:00',
  },
};

export const mockEvents: {key: string, value: TourmericEvent}[] = [
  { key: 'mockEvent1',
    value: mockSingleEvent },
  { key: 'mockEvent2',
    value: {
      category: 'category2',
      createDate: '2018-05-20T16:46:32.009Z',
      date: '2018-05-20',
      entryFee: '6',
      format: 'Standard',
      name: 'Tapahtuma',
      notes: 'FIJoijgasdsdgasdggagads',
      playerSlots: '14',
      prizes: 'Foooooooooooooooo',
      rulesLevel: 'Competitive',
      time: '10:00',
    } },
  { key: 'mockEvent3',
    value: {
      category: 'category2',
      createDate: '2018-05-20T16:04:29.595Z',
      date: '2018-05-21',
      entryFee: '5',
      format: 'Modern',
      link: 'https://magic.wizards.com/en/game-info/gameplay/formats/modern',
      name: 'Monday Modern',
      notes: 'Bring a friend!',
      playerSlots: '31',
      prizes: 'Three (3) OMG credits per player into the prizepool.',
      published: true,
      rulesLevel: 'Regular',
      time: '19:00',
    } },
  { key: 'mockEvent4',
    value: {
      category: '-LDIw-1LFgiM0EJZGfus',
      createDate: '2018-05-24T20:58:06.938Z',
      date: '2018-05-24',
      entryFee: '5',
      format: 'League',
      link: 'jokulinkki.fi',
      name: 'Necromunda League',
      notes: 'Shame! Shame! Shame! *DING DING DING*',
      playerSlots: '12',
      prizes: 'I am Loot.',
      published: true,
      rulesLevel: 'Casual',
      time: '17:00',
    } },
  { key: 'mockEvent5',
    value: {
      category: '-LAlvCmIWNzYKpa7-7HI',
      createDate: '2018-05-24T17:01:53.909Z',
      date: '2018-05-26',
      entryFee: '0',
      format: 'Board game',
      link: 'https://geekandsundry.com/international-tabletop-day-april-28-2018/',
      name: 'Lautapeli Lauantai',
      notes: 'Bring a friend and get a surprise gift!',
      playerSlots: '30',
      prizes: "A Supi's surprise prize for all participants!",
      published: true,
      rulesLevel: 'Casual',
      time: '00:00',
    } },
  { key: 'mockEventId1',
    value: {
      category: 'category1',
      createDate: '2018-05-24T17:00:46.500Z',
      date: '2018-09-24',
      entryFee: '10',
      format: 'Miniatures',
      link: 'http://www.google.fi',
      name: 'Warhammer thing',
      notes: 'Bring your war face!',
      playerSlots: '10',
      prizes: 'Glory!',
      published: true,
      rulesLevel: 'Casual',
      time: 'Kill everything',
    } },
];

export const mockSettings: Settings = {
  activeLogo: 'http://foo.com/image.png',
  dateFormat: 'DD.MM.YYYY',
  pageSubtitle: '',
  pageTitle: '',
  subtitleTextColor: '#000',
  theme: 'darkly',
  titleBarAngle: '150',
  titleBarColor: '#000',
  titleBarColor2: '#ec1c22',
  titleBarPercentage: '50',
  titleTextColor: '',
};

export const mockUploadedLogos: {[key: string]: UploadedFile} =
  {
    15271953483568546: { downloadURL: 'http://foo.com/image.png', name: 'image' },
    '152719372155055672': { downloadURL: 'http://foo.com/image.png', name: 'image' },
    '152719272536668394': { downloadURL: 'http://foo.com/image.png', name: 'image' },
    '1527227370219137123': { downloadURL: 'http://foo.com/image.png', name: 'image' },
    '152722965771313789': { downloadURL: 'http://foo.com/image.png', name: 'image' },
    '152722747904159438': { downloadURL: 'http://foo.com/image.png', name: 'image' },
  };

export const mockParticipations: {[key: string]: Participation} = {
  mockEventId1: {
    mockUserId: {
      comment: 'Jee',
      date: '2018-06-23T09:40:26.992Z',
      firstName: 'Test',
      lastName: 'Person',
      userId: 'mockUserId',
    },
  },
};

export const mockCategories: {[key: string]: Category} = {
  category1: {
    abbreviation: 'WH40K',
    logo: '1527227370219137123',
    name: 'Warhammer 40,000',
    type: 'Miniatures',
  },
  category2: {
    abbreviation: 'MtG',
    logo: '152722965771313789',
    name: 'Magic: The Gathering',
    type: 'TCG',
  },
  '-LAlvCmIWNzYKpa7-7HI': {
    abbreviation: 'Lautapelit',
    logo: '152719272536668394',
    name: 'Lautapelit / Board games',
    type: 'Boardgame',
  },
  '-LCmESny8m9JVEFQ_qOt': {
    abbreviation: 'PKM',
    logo: '152722747904159438',
    name: 'Pokémon',
    type: 'TCG',
  },
  '-LDImTAGxkzrorL0tQdi': {
    abbreviation: 'VG',
    logo: '152719372155055672',
    name: 'Videogames',
    type: 'Videogames',
  },
  '-LDIw-1LFgiM0EJZGfus': {
    abbreviation: 'Necromunda',
    logo: '15271953483568546',
    name: 'Necromunda',
    type: 'Miniatures',
  },
};
