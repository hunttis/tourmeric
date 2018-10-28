const config = {
  default: {
    // Your firebase config for development here

    fileMetadataFactory: (uploadRes) => {
      const { metadata: { name, fullPath, downloadURLs } } = uploadRes;
      return {
        name,
        fullPath,
        downloadURL: downloadURLs,
      };
    },
  },
  testing: {
    // Your firebase config for your testing environment here

    fileMetadataFactory: (uploadRes) => {
      const { metadata: { name, fullPath, downloadURLs } } = uploadRes;
      return {
        name,
        fullPath,
        downloadURL: downloadURLs,
      };
    },
  },

  production: {
    // Your firebase config for production here
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

exports.get = function get(env, deployment) {
  if (deployment && deployment === 'TESTING') {
    return config.testing;
  }
  return config[env] || config.default;
};
