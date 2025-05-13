const { withSplashScreen } = require('expo-splash-screen/android');

module.exports = function (config) {
  return {
    ...config,
    splashScreen: {
      ...config.splashScreen,
      enabled: false,
    },
  };
};
