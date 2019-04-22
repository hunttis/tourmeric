const functions = require('firebase-functions');
const fs = require('fs');
const admin = require('firebase-admin');


exports.host = functions.https.onRequest((req, res) => {
  console.log('headers', req.headers);
  console.log('req path: ', req.headers['user-agent']);
  let indexHTML = fs.readFileSync('./hosting/index.html').toString();
  const userAgent = req.headers['user-agent'].toLowerCase();
  const path = req.headers.referer ? req.headers.referer.split('/') : req.path;
  console.log('path is: ', path);
  const ogPlaceholder = '<meta name="functions-insert-dynamic-og">';
  const metaPlaceholder = '<meta name="functions-insert-dynamic-meta">';

  const isBot = !!(userAgent.includes('googlebot') ||
    userAgent.includes('yahoou') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('baiduspider') ||
    userAgent.includes('yandex') ||
    userAgent.includes('yeti') ||
    userAgent.includes('yodaobot') ||
    userAgent.includes('gigabot') ||
    userAgent.includes('ia_archiver') ||
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('developers.google.com'));

  if (isBot && (path && path.length > 1 && path[3] === 'event')) {
    console.log('Is a bot, returning edited index');
    const slug = path[4];
    return admin.database().ref(`events/${slug}`).once('value').then((snapshot) => {
      console.log('Printing info for ', snapshot.val());
      const event = snapshot.val();
      indexHTML = indexHTML.replace(metaPlaceholder, getMeta(event));
      indexHTML = indexHTML.replace(ogPlaceholder, getOpenGraph(event));
      res.status(200).send(indexHTML);
    });
    
  }
  console.log('Not a bot, so just returning the normal index', indexHTML);

  // optional - turn on caching: res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  indexHTML = indexHTML.replace(metaPlaceholder, getMeta());
  indexHTML = indexHTML.replace(ogPlaceholder, getOpenGraph());
  res.status(200).send(indexHTML);
});


const defaultDesc = 'The mobsters, bootleggers and gangsters of the 1920s and 30s, such as Al Capone, Lucky Luciano, and Bugs Moran.';
const defaultTitle = 'Original Gangsters';
const defaultLogo = 'http://huntt.is/images/turmeric.jpg';

const getOpenGraph = (event) => {
  let og = '<meta property="fb:app_id" content="921373517372" />';
  og += '<meta property="og:type" content="website" />';

  if (!event) {
    og += `<meta property="og:title" content="${defaultTitle}" />`;
    og += `<meta property="og:description" content="${defaultDesc}" />`;
    og += `<meta property="og:image" content="${defaultLogo}" />`;
    og += '<meta property="og:url" content="https://tourmeric.firebaseapp.com" />';
    return og;
  }
  og += `<meta property="og:title" content="${event.name}" />`;
  og += `<meta property="og:description" content="${event.notes || defaultDesc}" />`;
  og += `<meta property="og:image" content="${event.logo_url || defaultLogo}" />`;
  og += `<meta property="og:url" content="https://tourmeric.firebaseapp.com/organisation/${event.slug}" />`;
  return og;
};

const getMeta = (event) => {
  // return other meta tags
};
