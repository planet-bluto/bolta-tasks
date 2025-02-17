import path from 'path';

export default {
  entry: './src/background_main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.webpack.json"
          }
        }],
        exclude: [path.resolve("node_modules"), path.resolve("src/main.ts")],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'background.js',
    path: path.resolve('dist'),
  },
};