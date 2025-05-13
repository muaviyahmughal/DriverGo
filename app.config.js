module.exports = {
  name: 'GoDriver',
  slug: 'godriver',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  assetBundlePatterns: ["assets/*"],
  jsEngine: 'hermes',
  plugins: [
    [
      'expo-splash-screen',
      {
        enabled: false,
        androidSplashImage: null,
        iosSplashImage: null
      }
    ]
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.sufyanmughal522.godriver'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    edgeToEdgeEnabled: true,
    package: 'com.sufyanmughal522.godriver'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    eas: {
      projectId: 'a3427f87-802a-4d81-8f1e-eb8149b59875'
    }
  }
};
