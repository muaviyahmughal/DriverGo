import { getDefaultConfig } from 'expo/metro-config';

const config = getDefaultConfig(__dirname);

// Add any custom configurations here
// For example, if you need to add more file extensions:
// config.resolver.assetExts.push('db');

export default config;
