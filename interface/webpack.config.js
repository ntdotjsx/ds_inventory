const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,  // ใช้ regex เพื่อแปลงทั้ง .js และ .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',  // ทำให้ jQuery สามารถใช้ได้ทั่วทั้งโปรเจกต์
      jQuery: 'jquery',
    }),
  ],
  mode: 'development',
};
