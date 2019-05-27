# Tourmeric event organizer

This project is a collection of tools for event organizers. It contains an event calendar, user management, participation in the event, news, and store credit management (and will have reporting in the future). 

It's aimed to have as-cheap-as-possible setup and hosting using google's firebase service.

## Quick info

## dev

`yarn dev` => `http://localhost:1234/`

## build

`yarn build`

# Creating the firebase project

Go to http://firebase.google.com

Sign in with your google account.

Click `Add project` and give the project a name. If you want, you can choose the locations by clicking the pen-button. Next you need to check the boxes for the privacy stuff, but make sure you read what you're agreeing to.

Click `Create`. Click `Continue`.

The project is created once the project view opens up.

Open the page `Develop` > `Authentication`. Go into `Sign-in method` and enable the `email/password` signup. Click `Save`.

Next click the cog icon next to `Project Overview` and select `Project settings`. Then under `General` > `Your apps` click the `</>` icon.

Open a file in the project: `src/config-template.js`.

Copy everything inside `var config` (meaning, everything between the {}-brackets) into the project file located in `src/config.js` and place the data into the `default`-object.

Add the following key (see example below) to the config: `titleText`. This will be the text that is shown on the page, when it's loaded.

Ensure that you have the `fileMetadataFactory` in your config as well.

Your config.js will look something like this: 

```const config = {
  default: {
    titleText: 'Tourmeric server!',
    apiKey: 'some garbled mess of characters in this box',
    authDomain: 'your app name.firebaseapp.com',
    databaseURL: 'https:// your app name.firebaseio.com',
    projectId: 'your app name here too',
    storageBucket: 'and your app name here as well.appspot.com',
    messagingSenderId: 'a huuuuuuge number here',
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
  },
  production: {

    // If you want to have a separate production environment you will have similar data here as above. For example, if you are a dev and want to add your own features.

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
  },
};

exports.get = function get(env, deployment) {
  // return config.production;
  return config.testing;
  if (deployment === 'TESTING') {
    return config.testing;
  }
  return config[env] || config.default;
};
```

You can now start up the app by running `yarn` first to install the dependencies and then `yarn dev` to start up the project locally.

# Deployment

You can build the project with `yarn build`. The files will be generated into the `deploy` folder. If you want to use firebase hosting, you can deploy the project using `yarn firebase-init` and following the instructions. After that, you can use `yarn firebase-deploy` to deploy new versions to your firebase-hosted environment.

