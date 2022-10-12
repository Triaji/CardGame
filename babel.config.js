module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@assets': ['./src/Assets'],
          '@components': ['./src/Components'],
          '@fragments': ['./src/Fragments'],
          '@models': ['./src/Models'],
          '@routes': ['./src/Routes'],
          '@screens': ['./src/Screens'],
          '@store': ['./src/Store'],
          '@testUtils': ['./src/TestUtils'],
          '@utils': ['./src/Utils'],
        },
      },
    ],
  ],
};
