module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporarily removed 'nativewind/babel' to isolate Babel plugin errors.
      'react-native-reanimated/plugin',
    ],
  };
};
