export const config = {
  default: {
    titleText: 'Foo',
    apiKey: 'Foo',
    authDomain: 'Foo',
    databaseURL: 'Foo',
    projectId: 'Foo',
    storageBucket: 'Foo',
    messagingSenderId: 'Foo',
    fileMetadataFactory: (uploadRes) => {
      const { metadata: { name, fullPath, downloadURLs } } = uploadRes;
      return {
        name,
        fullPath,
        downloadURL: downloadURLs,
      };
    },
  },
};

exports.get = function get() {
  return config.default;
};
