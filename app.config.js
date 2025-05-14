module.exports = {
  name: 'GoDriver',
  slug: 'expo-ts-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F2EDE1'
  },
  assetBundlePatterns: ["assets/*"],
  jsEngine: 'hermes',
  plugins: ["./plugins/expo-splash.js"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.sufyanmughal522.godriver'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#F2EDE1'
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