export default {
  apiKey: 'AIzaSyD6BVkGpUN9Ygj_HQSgYc1R14nYHbgYFeE',
  authDomain: 'omg-tournament-test.firebaseapp.com',
  databaseURL: 'https://omg-tournament-test.firebaseio.com',
  projectId: 'omg-tournament-test',
  storageBucket: 'omg-tournament-test.appspot.com',
  messagingSenderId: '982080315942',
  fileMetadataFactory: (uploadRes) => {
    // upload response from Firebase's storage upload
    const { metadata: { name, fullPath, downloadURLs } } = uploadRes;
    // default factory includes name, fullPath, downloadURL
    return {
      name,
      fullPath,
      downloadURL: downloadURLs,
    };
  },
};
