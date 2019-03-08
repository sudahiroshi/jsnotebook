import webpack from 'webpack';

const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export default {
  mode: ENV,
  devtool: ENV === 'development' ? 'source-map' : false,
  output: {
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.es6'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              useBuiltIns: 'usage',
            }],
          ],
        },
      },
      {
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: true,
        },
      }],
    }],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: ENV,
      DEBUG: ENV === 'development',
    }),
  ],
};
