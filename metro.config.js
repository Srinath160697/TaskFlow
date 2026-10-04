const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow `require('../sample-data/tasks.csv')` to resolve as a bundled asset,
// so the Bulk Upload screen can load the sample file without a native file
// picker.
config.resolver.assetExts.push('csv');

module.exports = config;
