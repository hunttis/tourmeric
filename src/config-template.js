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

exports.get = function get(env) {
  return config[env] || config.default;
};
