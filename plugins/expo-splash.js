module.exports = function (config) {
  return {
    ...config,
    splashScreen: {
      ...config.splashScreen,
      enabled: true,
    },
  };
};
