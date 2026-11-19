# Personal Learning Portfolio

เว็บไซต์ Personal Learning Portfolio เป็น Web Application สำหรับสร้าง Portfolio ส่วนตัว เพื่อบันทึกประสบการณ์การเรียนรู้ ทักษะ สิ่งที่ได้ลงมือทำ และสิ่งที่ได้เรียนรู้จากแต่ละกิจกรรมหรือโปรเจกต์

## 1. Project Description

เว็บไซต์นี้ช่วยให้ผู้ใช้สามารถสร้างและจัดการ Portfolio ของตนเองได้ โดยไม่จำเป็นต้องมีผลงานขนาดใหญ่ก่อนเริ่มต้น สามารถบันทึกประสบการณ์และพัฒนาการเรียนรู้ของตนเองได้อย่างเป็นระบบ

ตอนนี้โปรเจกต์มี **Backend Server** (Node.js / Express) แล้ว: หน้าเว็บส่งข้อมูลไปที่ Server ด้วย `fetch()` (POST, JSON) แทน Local Storage, Server จะ **ตรวจสอบความถูกต้องของข้อมูลอีกชั้น** ก่อนบันทึก แล้วเก็บข้อมูลทั้งหมดลงไฟล์ JSON บนเครื่อง Server (ใช้ได้ทั้งตอนรันบนเครื่องตัวเองและตอน deploy ขึ้น EC2) โดยไฟล์ JSON นี้ถูกเก็บไว้ **นอกโฟลเดอร์ Public** จึงไม่สามารถเปิดดูหรือดาวน์โหลดไฟล์ได้โดยตรงจาก URL

## 2. Technologies Used

**Frontend**
* HTML5 – ใช้สร้างโครงสร้างเว็บไซต์
* CSS3 – ใช้ตกแต่งและจัดรูปแบบเว็บไซต์
* JavaScript (Vanilla JS) – เก็บ/ดึงข้อมูลผ่าน API ของ Server ด้วย `fetch()` และจัดการ UI
* Bootstrap 5.3.3 – ใช้ช่วยในการออกแบบหน้าตาเว็บไซต์ (โหลดจาก CDN)

**Backend**
* Node.js – JavaScript runtime ฝั่ง Server
* Express 5 – Web framework สำหรับ Server Script และ REST API
* File System (`fs`) – บันทึกข้อมูล Portfolio ลงไฟล์ `data/portfolios.json` (แทน Database)

## 3. Project Structure

```
CS100_POWER_UP_Final_Demo_G17/
│
├── public/                 <- โฟลเดอร์ Public เดียวที่ Server เปิดให้เข้าถึงผ่าน URL
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js          <- เรียก API ด้วย fetch() แทน Local Storage
│   └── index.html
│
├── data/                    <- ซ่อนไว้นอก Public: Browser เข้าไม่ถึงไฟล์นี้โดยตรง
│   └── portfolios.json      <- สร้างอัตโนมัติตอนรัน Server ครั้งแรก (ไม่ได้ push ขึ้น Git)
│
├── server.js                <- Server Script หลัก (Express routes + static file server)
├── validation.js             <- Server-side Validation (ตรวจข้อมูลอีกชั้นก่อนบันทึก)
├── package.json
├── sample-portfolio-1.json  <- ข้อมูลตัวอย่าง ใช้ seed ข้อมูลตอนรัน Server ครั้งแรก
├── sample-portfolio-2.json
└── README.md
```

## 4. Requirements

ก่อนเปิดใช้งานเว็บไซต์ ควรมีสิ่งต่อไปนี้

* [Node.js](https://nodejs.org/) (v18 ขึ้นไป แนะนำ) และ npm (ติดตั้งมาพร้อม Node.js)
* Web Browser เช่น Google Chrome, Microsoft Edge หรือ Firefox
* โปรแกรม Visual Studio Code (แนะนำ)
* Internet Connection สำหรับ `npm install` ครั้งแรก และสำหรับโหลด Bootstrap จาก CDN

## 5. How to Run the Website

เว็บไซต์นี้ต้องรันผ่าน **Backend Server** (ไม่สามารถเปิด `index.html` ตรง ๆ ได้อีกต่อไป เพราะหน้าเว็บต้องคุยกับ Server ผ่าน API)

1. ดาวน์โหลดโปรเจกต์จาก GitHub โดยกดปุ่ม Code และเลือก Download ZIP (หรือ `git clone` repo นี้) แล้วแตกไฟล์ ZIP
2. เปิด Terminal ในโฟลเดอร์โปรเจกต์ แล้วติดตั้ง dependency (ครั้งแรกครั้งเดียว):
   ```
   npm install
   ```
3. สั่งรัน Server:
   ```
   npm start
   ```
   หรือ
   ```
   node server.js
   ```
4. Terminal จะแสดงข้อความ `Portfolio server running at http://localhost:3000`
5. เปิด Web Browser แล้วไปที่ `http://localhost:3000`

### Deploy ขึ้น EC2 (หรือเครื่อง Server อื่น ๆ)

1. อัปโหลดโค้ดทั้งโปรเจกต์ขึ้นเครื่อง Server (เช่นด้วย `git clone` หรือ `scp`)
2. ติดตั้ง Node.js บนเครื่อง Server (ถ้ายังไม่มี)
3. รัน `npm install` แล้ว `npm start` (หรือใช้ `pm2`/`systemd` เพื่อให้ Server รันค้างไว้เบื้องหลัง)
4. เปิด Port ที่ Server ฟังอยู่ (ค่าเริ่มต้นคือ `3000`, เปลี่ยนได้ด้วย environment variable `PORT`) ใน Security Group ของ EC2
5. เข้าเว็บผ่าน `http://<EC2-Public-IP>:3000`

> ไฟล์ข้อมูล `data/portfolios.json` จะถูกสร้างขึ้นเองบนเครื่อง Server ตอนรันครั้งแรก และจะเก็บอยู่นอกโฟลเดอร์ `public/` เสมอ จึงเปิดดูผ่าน URL ไม่ได้ไม่ว่าจะรันที่เครื่องไหน

## 6. Backend API

| Method | Path                           | หน้าที่ |
|--------|---------------------------------|---------|
| GET    | `/api/portfolios`               | ดึงข้อมูล Portfolio ทั้งหมด (ใช้ตอนโหลดหน้าเว็บ) |
| POST   | `/api/portfolios/:id/items`     | บันทึกข้อมูลโปรไฟล์ + เพิ่ม Portfolio Item ใหม่ (`:id` คือ `portfolio_1` หรือ `portfolio_2`) |

**POST `/api/portfolios/:id/items`** รับ JSON body เดียวกับฟอร์มบนหน้าเว็บ เช่น

```json
{
  "displayName": "Adam Smith",
  "whatIEnjoy": "Coding",
  "whatIveTried": "CS100",
  "whatImCuriousAbout": "Javascript",
  "title": "My Project",
  "type": "Project",
  "date": "2026-11-18",
  "role": "Data Analyst",
  "description": "...",
  "skills": "HTML, CSS",
  "whatIDid": "...",
  "whatILearned": "...",
  "challenge": "...",
  "nextStep": "...",
  "evidence": "https://example.com",
  "photos": [],
  "files": []
}
```

* สำเร็จ: ตอบกลับ `201` พร้อม `{ "ok": true, "portfolio": { ... } }`
* ข้อมูลไม่ผ่านการตรวจสอบ: ตอบกลับ `400` พร้อม `{ "ok": false, "errors": { "ชื่อฟิลด์": "ข้อความ error" } }`

หน้าเว็บ (`public/js/app.js`) จะอ่าน JSON ที่ตอบกลับมาแล้วอัปเดตข้อความบนหน้า (`textContent`/`innerHTML`) เองโดย **ไม่โหลดหน้าใหม่และ URL ไม่เปลี่ยน** (ต่างจาก HTML Form POST แบบดั้งเดิมที่หน้าเว็บจะเปลี่ยนทั้งหน้า)

## 7. Server-Side Validation

`validation.js` ตรวจข้อมูลทุกฟิลด์อีกครั้งบนฝั่ง Server ก่อนบันทึกเสมอ (ชื่อ Field ที่จำเป็นต้องกรอก, รูปแบบวันที่ถูกต้องจริง, Evidence ต้องเป็นลิงก์ `http://`/`https://`, ไฟล์แนบต้องไม่เกินขนาดที่กำหนด) เพราะ Validation ฝั่ง Browser (ใน `public/js/app.js`) **ถูกข้ามได้เสมอ** เช่น ปิด JavaScript, ยิง request ตรงด้วย curl/Postman จึง **ห้ามไว้ใจข้อมูลจาก Client ฝ่ายเดียว**

## 8. How to Test the Website

สามารถทดลองใช้งานฟังก์ชันต่าง ๆ ของเว็บไซต์ได้ตามขั้นตอนดังนี้ (ต้องรัน `node server.js` ค้างไว้ก่อนเสมอ)

### 8.1 Create Portfolio (พร้อม Item แรก)

ฟอร์มของเว็บไซต์นี้รวม "ข้อมูลโปรไฟล์" กับ "Portfolio Item แรก" ไว้ในฟอร์มเดียว ต้องกรอกให้ครบทั้งสองส่วนแล้วกดบันทึกพร้อมกัน

1. เลือก Portfolio ในช่อง Select Portfolio (Portfolio 1 หรือ Portfolio 2)
2. กรอก Display Name, What I Enjoy, What I've Tried, What I'm Curious About
3. เลื่อนลงมากรอก Portfolio Item: Title, Type, Date, Role, Description
4. กรอก Skills อย่างน้อย 1 รายการ (คั่นด้วยเครื่องหมายจุลภาค เช่น `HTML, CSS`)
5. กรอก Reflection ให้ครบทั้ง 4 ส่วน: What I Did, What I Learned, Challenge, Next Step
6. กรอก Evidence link อย่างน้อย 1 ลิงก์ โดยต้องขึ้นต้นด้วย `http://` หรือ `https://` (คั่นหลายลิงก์ด้วยจุลภาคได้เช่นกัน)
7. กดปุ่ม **Create Portfolio**
8. หน้าเว็บจะยิง `fetch()` ไป Server, Server ตรวจสอบและบันทึกลง `data/portfolios.json`, แล้วตอบกลับเป็น JSON — ตรวจสอบว่าข้อความ "Portfolio saved!" ขึ้น และ item ที่สร้างไปปรากฏในส่วน View Portfolio โดยหน้าเว็บไม่ได้ Reload และ URL ไม่เปลี่ยน

### 8.2 Switch Between Portfolios

* เปลี่ยน dropdown **Select Portfolio** เป็น Portfolio อีกอัน → ฟอร์มด้านบนจะโหลดข้อมูลโปรไฟล์ของ Portfolio นั้น (หรือว่างถ้ายังไม่เคยสร้าง) และ dropdown ในส่วน View Portfolio จะสลับตามโดยอัตโนมัติ
* การแก้ไขโปรไฟล์ทำได้โดยแก้ข้อความในฟอร์มแล้วกด Create Portfolio อีกครั้ง (จะบันทึกโปรไฟล์ใหม่พร้อมเพิ่ม item ใหม่ไปด้วย)

> หมายเหตุ: เวอร์ชันนี้ยังไม่มีปุ่ม Edit/Delete สำหรับ Portfolio หรือ Item ที่สร้างไปแล้วโดยตรง

### 8.3 Add Another Portfolio Item

1. เลือก Portfolio ที่ต้องการ (ข้อมูลโปรไฟล์จะโชว์อยู่แล้ว)
2. กรอกข้อมูล Portfolio Item ใหม่ให้ครบตามข้อ 8.1 ข้อ 3-6
3. กดปุ่ม Create Portfolio อีกครั้ง
4. ตรวจสอบว่าตัวนับ Items ใน View Portfolio เพิ่มขึ้น และเห็น item การ์ดใหม่เพิ่มเข้ามา

### 8.4 Skills and Evidence (หลายรายการ)

* ช่อง Skills และ Evidence ไม่มีปุ่มเพิ่ม/ลบช่องแยก แต่ให้พิมพ์หลายรายการในช่องเดียว คั่นด้วยเครื่องหมายจุลภาค เช่น `HTML, CSS, JavaScript` หรือ `https://github.com, https://example.com`
* ระบบจะตัดช่องว่างและรายการซ้ำออกให้อัตโนมัติ (ทั้งฝั่ง Browser และฝั่ง Server)

### 8.5 Form Validation (Client + Server)

* ลองปล่อยช่องที่จำเป็น (required) ว่างไว้แล้วกด Create Portfolio → ช่องนั้นจะขึ้นกรอบแดงพร้อมข้อความแจ้ง และฟอร์มจะไม่ถูกบันทึก (ตรวจที่ Browser ก่อน ยังไม่ทันยิงไป Server)
* ลองใส่วันที่ที่ไม่มีจริง หรือ Evidence link ที่ไม่ขึ้นต้นด้วย `http://`/`https://` → ระบบจะแจ้ง error และไม่บันทึกเช่นกัน
* ทดสอบว่า Server ตรวจข้อมูลจริง ๆ: ยิง request ตรงด้วย curl โดยข้าม Browser ไปเลย เช่น
  ```
  curl -X POST http://localhost:3000/api/portfolios/portfolio_1/items \
    -H "Content-Type: application/json" \
    -d "{}"
  ```
  ควรได้ผลลัพธ์ `400 Bad Request` พร้อมรายการ error ของทุกฟิลด์ที่ขาดไป (แปลว่า Server ไม่ได้ไว้ใจ Validation ฝั่ง Browser อย่างเดียว)

### 8.6 Clear Form

* กดปุ่ม **Clear** จะล้างเฉพาะช่องในส่วน Add Portfolio Item (Title, Type, Date, ..., Evidence, Photo, File) ส่วนข้อมูลโปรไฟล์ด้านบนจะไม่ถูกล้าง

### 8.7 Upload Photo / File Evidence

1. ที่ช่อง Upload Photo เลือกไฟล์รูปภาพได้ (เลือกได้หลายไฟล์)
2. ที่ช่อง Upload Files เลือกไฟล์เอกสาร เช่น .pdf, .docx
3. กด Create Portfolio
4. ตรวจสอบว่าการ์ด item ใน View Portfolio แสดงรูปภาพจริง (thumbnail) ในหัวข้อ Photos และลิงก์ดาวน์โหลดไฟล์จริงในหัวข้อ Files
5. ไฟล์ขนาดใหญ่เกิน 5MB ต่อไฟล์ หรือมากกว่า 10 ไฟล์ต่อช่อง จะถูก Server ปฏิเสธ (error ตอบกลับเป็น JSON)

### 8.8 Data Storage Test

1. สร้าง Portfolio และเพิ่ม Portfolio Item อย่างน้อย 1 รายการ
2. Refresh หน้าเว็บไซต์ (F5) — หน้าเว็บจะ `fetch()` ข้อมูลจาก Server ใหม่
3. ตรวจสอบว่าข้อมูลที่บันทึกไว้ (โปรไฟล์และ item ทั้งหมด) ยังคงแสดงผลอยู่ครบถ้วน แม้จะเปิดจากเครื่อง/เบราว์เซอร์อื่นที่เข้า URL เดียวกัน (เพราะข้อมูลเก็บอยู่บน Server แล้ว ไม่ใช่ Local Storage)
4. ลองพิมพ์ URL ตรงไปที่ไฟล์ข้อมูล เช่น `http://localhost:3000/data/portfolios.json` → ต้องได้ `404 Not Found` เสมอ เพราะไฟล์นี้ถูกซ่อนไว้นอกโฟลเดอร์ `public/`

> หมายเหตุ: เว็บไซต์จัดเก็บข้อมูลจริงไว้ที่ไฟล์ `data/portfolios.json` บนเครื่อง Server (ไม่ใช่ Local Storage ของ Browser อีกต่อไป) ข้อมูลจึงเหมือนกันไม่ว่าจะเปิดจากอุปกรณ์หรือ Browser ไหนก็ตาม ตราบใดที่เข้า URL ของ Server เดียวกัน

## 9. Notes

* ควรเชื่อมต่ออินเทอร์เน็ตเพื่อให้ Bootstrap CDN ทำงานได้ (จำเป็นแค่ตอนเปิดครั้งแรก เบราว์เซอร์จะแคชไว้ให้ในครั้งถัดไป)
* ต้องรัน `node server.js` (หรือ `npm start`) ค้างไว้เสมอขณะใช้งานเว็บไซต์
* รองรับ Portfolio ได้ 2 รายการ (Portfolio 1, Portfolio 2) ตาม dropdown ที่มีให้
* ไฟล์ `data/portfolios.json` ไม่ได้ถูก push ขึ้น Git (ดู `.gitignore`) เพราะเป็นข้อมูลที่สร้าง/แก้ไขได้จากการใช้งานจริงบน Server แต่ละเครื่อง ไม่ใช่ซอร์สโค้ด

## 10. GitHub Repository

Repository: https://github.com/kiatkong-mongkolklee/CS100_POWER_UP_Final_Demo_G17
