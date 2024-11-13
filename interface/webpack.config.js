const path = require('path');

module.exports = {
  entry: './src/index.js',  // พาธไปยังไฟล์เริ่มต้นของคุณ
  output: {
    path: path.resolve(__dirname, 'dist'),  // พาธที่ Webpack จะนำไฟล์ไปวางหลัง bundle
    filename: 'bundle.js',  // ชื่อไฟล์ที่สร้างจากการ bundle
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // ใช้ Babel แปลงไฟล์ .js
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],  // สำหรับ React และ ES6+
          },
        },
      },
      {
        test: /\.css$/,  // ใช้ loader สำหรับไฟล์ .css
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),  // พาธไปยังไฟล์ที่ต้องการให้ Webpack Dev Server ใช้งาน
    compress: true,  // เปิดการบีบอัดไฟล์
    port: 9000,  // พอร์ตสำหรับการรัน server
  },
};
