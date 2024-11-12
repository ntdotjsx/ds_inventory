import { defineConfig } from 'vite';

export default defineConfig({
  // กำหนดการตั้งค่าเพิ่มเติมได้ที่นี่
  base: './', // กำหนดให้ base เป็น relative path เพื่อให้ทำงานร่วมกับ Lua ใน FiveM ได้
  build: {
    outDir: '../dist', // กำหนดโฟลเดอร์ output เมื่อ build
    emptyOutDir: true, // ลบไฟล์ในโฟลเดอร์ outDir ก่อน build ใหม่
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js', // กำหนดชื่อไฟล์ JS หลัก
        chunkFileNames: 'chunks/[name]-[hash].js', // กำหนดชื่อไฟล์ JS chunk
        assetFileNames: 'assets/[name][extname]' // กำหนดชื่อไฟล์ asset (เช่น CSS, รูปภาพ)
      }
    }
  },
  // อื่น ๆ เช่น plugins, server settings สามารถเพิ่มได้ที่นี่ตามต้องการ
});
