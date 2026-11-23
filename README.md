# CS100 POWER UP! — Learning Portfolio (G17)

เว็บ Learning Portfolio สำหรับ CS100 Final Demo กลุ่ม G17 ใช้ Node.js + Express เป็น Server และเก็บข้อมูลเป็นไฟล์ JSON ฝั่ง Server (ไม่ใช้ localStorage)

## Requirements
- Node.js 18 ขึ้นไป
- Web Browser
- Internet สำหรับโหลด Bootstrap จาก CDN

## Run locally
```bash
npm install
npm start
```
จากนั้นเปิด `http://localhost:3000`

## Data storage
ข้อมูลเก็บที่ `data/portfolios.json` ซึ่งอยู่นอกโฟลเดอร์ `public/` จึงเปิดผ่าน URL ตรง ๆ ไม่ได้ ตอนรันครั้งแรก Server จะสร้างไฟล์นี้ให้เองจาก `sample-portfolio-1.json` และ `sample-portfolio-2.json`

## Main features
- สร้าง Portfolio (ชื่อห้ามซ้ำ) และเลือก Portfolio จาก dropdown ที่เพิ่มตามจำนวนที่สร้างไว้
- เพิ่ม Portfolio Item พร้อม Skills, Reflection 4 ช่อง และ Evidence URL
- แนบรูปภาพ/ไฟล์ แล้วแสดงในการ์ด item (รูป + ลิงก์ดาวน์โหลด)
- View Portfolio ดูข้อมูลโปรไฟล์และ item ทั้งหมด
- Export Portfolio ที่เลือกเป็น `my-portfolio.json`
- Import Portfolio Item ด้วยการวาง JSON (ตรวจรูปแบบและกันข้อมูลซ้ำ)
- หน้า Challenge: เกม Verified Human Quiz 4 ข้อ ผ่านแล้วกดสร้าง/คัดลอก Portfolio Item JSON ไป Import ได้
- Server ตรวจข้อมูล (validation) ก่อนบันทึกทุกครั้ง

## API
- `GET /api/portfolios` — ดึง Portfolio ทั้งหมด
- `POST /api/portfolios` — สร้าง Portfolio ใหม่
- `POST /api/portfolios/:id/items` — เพิ่ม Portfolio Item
- `POST /api/portfolios/:id/import` — Import Item จาก JSON

## Project structure
```
public/         หน้าเว็บ (index.html, challenge.html, css/, js/)
data/           portfolios.json (สร้างเองตอนรัน ไม่ขึ้น Git)
server.js       Express server + API
validation.js   ตรวจข้อมูลฝั่ง Server
```

## Deploy บน AWS EC2 (สรุป)
1. ติดตั้ง Node.js บน EC2
2. clone โปรเจกต์ แล้วรัน `npm install`
3. รัน `npm start` (ใช้ pm2 หรือ systemd ให้ Server รันค้างไว้)
4. เปิด port 3000 ใน Security Group
5. เข้าเว็บที่ `http://<EC2-Public-IP>:3000`

**สำคัญ:** อย่า commit `.env`, ไฟล์ `.pem` หรือ `data/portfolios.json` ขึ้น GitHub (ใส่ไว้ใน `.gitignore` แล้ว)
