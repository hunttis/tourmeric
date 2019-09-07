import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import moment from 'moment/min/moment-with-locales';

interface Event {
  date: string;
  time: string;
  format?: string | null;
  name: string;
  notes?: string;
}

interface Metadata {
  description: string;
  image: string;
  title: string;
  url: string;
}

admin.initializeApp();
moment.locale('fi');

const readFile = (path: string): Promise<string> => new Promise((resolve, reject) => {
  fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data.toString())));
});

// Change these to be correct for your app
const defaultMetadata: Metadata = {
  description: 'Open Source Event Calendar and LGS app!',
  image: 'http://huntt.is/images/turmeric.jpg',
  title: 'Tourmeric',
  url: 'https://tourmeric.firebaseapp.com',
};

const formatMetadata = (data: Metadata): string => `
  <meta property="og:image" content="${data.image}">
  <meta property="og:title" content="${data.title}">
  <meta property="og:url" content="${data.url}">
  <meta property="og:description" content="${data.description}">
`;

const getEventMetadata = (event: Event, url: string): Metadata => {
  const { date, format, name, notes, time } = event;
  const formattedDate = `${moment(date, 'YYYY-MM-DD').format(
    'DD.MM.YYYY (dddd)',
  )} klo ${time}`;
  const formattedFormat = format ? `${format}-turnaus ` : '';
  return {
    description: `${formattedFormat}${formattedDate}. ${notes || ''}`,
    image: defaultMetadata.image,
    title: name,
    url,
  };
};

const getEvent = async (id: string): Promise<Event | undefined> => {
  const snapshot = await admin
    .database()
    .ref(`/events/${id}`)
    .once('value');
  return snapshot.val();
};

const getUrl = (req: functions.https.Request): string => `${req.protocol}://${req.host}${req.originalUrl}`;

export const addMetadata = functions.https.onRequest(async (req, res) => {
  const match = req.path.match(/^\/event\/([A-z0-9_-]+)/);
  const event = match && await getEvent(match[1]);
  const metadata = event
    ? getEventMetadata(event, getUrl(req))
    : defaultMetadata;
  const html = await readFile('index.html');
  const formattedHtml = html.replace(
    '<meta name="insert-dynamic-metadata">',
    formatMetadata(metadata),
  );
  res.type('html').send(formattedHtml);
});
