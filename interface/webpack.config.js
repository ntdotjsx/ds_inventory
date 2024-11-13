const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
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
            presets: ['@babel/preset-env', '@babel/preset-react'],  // สำหรับ React และ JSX
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
    extensions: ['.js', '.jsx'],  // เพิ่ม .jsx ในการ resolve
  },
  devServer: {
    static: path.join(__dirname, 'dist'),  // ใช้ static แทน contentBase
    compress: true,
    port: 9000,
    open: true,  // เปิด browser อัตโนมัติเมื่อเริ่ม dev server
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  mode: 'development',  // เพิ่มการตั้งค่านี้
};
