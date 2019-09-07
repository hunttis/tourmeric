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
  description?: string;
  image?: string;
  title?: string;
  url?: string;
}

admin.initializeApp();
moment.locale('fi');

const readFile = (path: string): Promise<string> => new Promise((resolve, reject) => {
  fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data.toString())));
});

const escapeHtml = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const setMetaContent = (html: string, [key, value]: [string, string]): string => {
  const find = new RegExp(`<meta property="og:${key}" content="[^"]*">`);
  const replace = `<meta property="og:${key}" content="${escapeHtml(value)}">`;
  return html.replace(find, replace);
};

const getEventMetadata = (event: Event, url: string): Metadata => {
  const { date, format, name, notes, time } = event;
  const formattedDate = `${moment(date, 'YYYY-MM-DD').format(
    'DD.MM.YYYY (dddd)',
  )} klo ${time}`;
  const formattedFormat = format ? `${format}-turnaus ` : '';
  return {
    description: `${formattedFormat}${formattedDate}. ${notes || ''}`,
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
  let html = await readFile('index.html');
  if (event) {
    const metadata = getEventMetadata(event, getUrl(req));
    html = Object.entries(metadata).reduce(setMetaContent, html);
  }
  res.type('html').send(html);
});