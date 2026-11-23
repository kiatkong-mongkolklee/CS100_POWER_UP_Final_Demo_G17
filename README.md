# CS100 POWER UP! — Learning Portfolio (G17)

เว็บ Learning Portfolio สำหรับ CS100 Final Demo ของกลุ่ม G17 ใช้บันทึกประสบการณ์การเรียนรู้ ทักษะ สิ่งที่ได้ลงมือทำ และ Reflection จากแต่ละกิจกรรมหรือโปรเจกต์ ระบบใช้ Node.js + Express เป็น Server และเก็บข้อมูลเป็นไฟล์ JSON ฝั่ง Server (ไม่ใช้ localStorage) พร้อมหน้า Challenge ประจำบูธ G17 ที่ให้ผู้เล่นสร้าง Portfolio Item JSON ไป Import เข้า Portfolio ของตัวเองได้

---

## 1. Main Features

**Portfolio**
- สร้าง Portfolio ใหม่ได้หลายอัน (Display Name, What I Enjoy, What I've Tried, What I'm Curious About)
- ชื่อ Portfolio ห้ามซ้ำกัน (ตรวจแบบไม่สนตัวพิมพ์เล็ก/ใหญ่)
- Dropdown เลือก Portfolio เพิ่มตามจำนวน Portfolio ที่สร้างไว้โดยอัตโนมัติ

**Portfolio Item**
- เพิ่ม Item ให้ Portfolio ที่เลือก: Title, Type (Project / Course / Activity / Competition / Other), Date, Role, Description
- Skills คั่นด้วยเครื่องหมายจุลภาค เช่น `HTML, CSS`
- Reflection 4 ช่อง: What I Did, What I Learned, Challenge, Next Step
- Evidence URL อย่างน้อย 1 ลิงก์ (ต้องขึ้นต้นด้วย `http://` หรือ `https://`)
- แนบรูปภาพและไฟล์ได้ รูปแสดงเป็น thumbnail และไฟล์แสดงเป็นลิงก์ดาวน์โหลดในการ์ด Item

**View / Export / Import**
- View Portfolio: ดูข้อมูลโปรไฟล์และการ์ด Item ทั้งหมดของ Portfolio ที่เลือก
- Export Portfolio ที่เลือกเป็นไฟล์ `my-portfolio.json`
- Import Portfolio Item โดยวาง JSON แล้วเลือก Portfolio ปลายทาง (ตรวจรูปแบบและกัน Import ซ้ำ)

**Challenge (หน้า `challenge.html`)**
- เกม Verified Human Quiz 4 ข้อ เรื่องการส่งข้อมูลแบบ POST ด้วย HTML Form กับ `fetch()`
- ตอบครบแล้วกด "สร้าง Portfolio Item JSON" และ "Copy JSON" เพื่อนำไป Import ในหน้าแรก

**Server**
- ตรวจข้อมูลทุกช่องซ้ำอีกครั้งฝั่ง Server ก่อนบันทึก (ไม่เชื่อข้อมูลจาก Browser อย่างเดียว)
- หน้าเว็บคุยกับ Server ผ่าน `fetch()` จึงไม่ต้องโหลดหน้าใหม่และ URL ไม่เปลี่ยน

---

## 2. Technologies Used

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla JS), Bootstrap 5.3.3 (CDN), ฟอนต์ Kanit (Google Fonts) |
| Backend | Node.js, Express 5 |
| Data | ไฟล์ JSON (`data/portfolios.json`) ผ่านโมดูล `fs` |
| Deploy | AWS EC2 |

---

## 3. Project Structure

```
CS100_POWER_UP_Final_Demo_G17/
├── public/                     # ไฟล์หน้าเว็บ (Server เปิดให้เข้าถึงผ่าน URL ได้เฉพาะโฟลเดอร์นี้)
│   ├── index.html              # หน้าหลัก: Create / View / Export / Import Portfolio
│   ├── challenge.html          # หน้า Challenge (Verified Human Quiz)
│   ├── challenge-export.json   # ข้อมูล Challenge ของกลุ่ม G17 (G17-C01)
│   ├── challenge.json          # ตัวอย่าง Item รางวัลจาก Challenge
│   ├── css/
│   │   ├── style.css           # สไตล์หน้าหลัก
│   │   └── challenge.css       # สไตล์หน้า Challenge
│   └── js/
│       ├── app.js              # ฟอร์ม, validation ฝั่ง Browser, เรียก API, render การ์ด
│       ├── challenge quiz.js   # เกมตอบคำถาม + สร้าง/คัดลอก Portfolio Item JSON
│       └── challenge.js        # Challenge Exchange (อ่าน/ดาวน์โหลด challenge-export.json)
├── data/
│   └── portfolios.json         # ข้อมูลจริง (สร้างเองตอนรัน, ไม่ขึ้น Git)
├── server.js                   # Express server + REST API
├── validation.js               # ตรวจข้อมูลฝั่ง Server
├── sample-portfolio-1.json     # ข้อมูลตัวอย่างสำหรับ seed ครั้งแรก
├── sample-portfolio-2.json
├── portfolio-item.json         # ตัวอย่าง Portfolio Item สำหรับ Challenge ที่บูธ
├── portfolio-item2.json
├── package.json
└── README.md
```

---

## 4. Requirements

- [Node.js](https://nodejs.org/) 18 ขึ้นไป (มี npm มาด้วย)
- Web Browser เช่น Google Chrome, Microsoft Edge หรือ Firefox
- Internet สำหรับ `npm install` ครั้งแรก และโหลด Bootstrap / ฟอนต์จาก CDN
- Visual Studio Code (แนะนำ)

---

## 5. Installation & Run

1. Clone หรือดาวน์โหลดโปรเจกต์
   ```bash
   git clone https://github.com/kiatkong-mongkolklee/CS100_POWER_UP_Final_Demo_G17.git
   cd CS100_POWER_UP_Final_Demo_G17
   ```
2. ติดตั้ง dependency (ทำครั้งแรกครั้งเดียว)
   ```bash
   npm install
   ```
3. รัน Server
   ```bash
   npm start
   ```
   Terminal จะขึ้นข้อความ `Portfolio server running at http://localhost:3000`
4. เปิด Browser ไปที่ `http://localhost:3000`

> ต้องเปิดผ่าน Server เท่านั้น การดับเบิลคลิก `index.html` ตรง ๆ จะใช้งานไม่ได้ เพราะหน้าเว็บต้องเรียก API ของ Server
>
> เปลี่ยน port ได้ด้วย environment variable `PORT` เช่น `PORT=8080 npm start`

---

## 6. How to Use

**สร้าง Portfolio**
1. ไปที่ส่วน Create Portfolio แล้วกรอก Display Name, What I Enjoy, What I've Tried, What I'm Curious About
2. กด **Create Portfolio** → Portfolio ใหม่จะขึ้นใน dropdown ทันที

**เพิ่ม Portfolio Item**
1. เลือก Portfolio ใน Select Portfolio
2. กรอก Title, Type, Date, Role, Description, Skills และ Reflection ให้ครบ 4 ช่อง
3. ใส่ Evidence URL อย่างน้อย 1 ลิงก์ (ใส่หลายลิงก์ได้โดยคั่นด้วยจุลภาค)
4. แนบรูป / ไฟล์ได้ถ้าต้องการ
5. กด **Add Portfolio Item** → ขึ้นข้อความ "Portfolio saved!" และการ์ดใหม่แสดงในส่วน View Portfolio

**ดูและ Export**
1. เลือก Portfolio ใน View Portfolio เพื่อดูโปรไฟล์และ Item ทั้งหมด
2. กด **Export My Portfolio (.json)** เพื่อดาวน์โหลด `my-portfolio.json`

**เล่น Challenge แล้ว Import**
1. กดเมนู **Challenge** ที่ navbar แล้วตอบคำถามให้ครบ 4 ข้อ
2. กด **สร้าง Portfolio Item JSON** แล้วกด **Copy JSON**
3. กลับมาหน้าแรก วาง JSON ในส่วน Import Portfolio Item และเลือก Portfolio ปลายทาง
4. กด **Import Item ลงเซิร์ฟเวอร์** → ขึ้นข้อความ "Imported item into portfolio successfully!"

---

## 7. Data Storage

- ข้อมูลทั้งหมดเก็บที่ `data/portfolios.json` ซึ่งอยู่นอกโฟลเดอร์ `public/` จึงเปิดหรือดาวน์โหลดผ่าน URL ตรง ๆ ไม่ได้
- ตอนรันครั้งแรก ถ้ายังไม่มีไฟล์นี้ Server จะสร้างให้เองจาก `sample-portfolio-1.json` และ `sample-portfolio-2.json`
- Server เขียนลงไฟล์ชั่วคราว (`.tmp`) ก่อนแล้วค่อยเปลี่ยนชื่อทับ เพื่อลดโอกาสไฟล์เสียระหว่างบันทึก
- ข้อมูลยังอยู่หลัง restart Server ตราบใดที่ไฟล์ยังอยู่บนเครื่อง
- อยากล้างข้อมูลกลับไปเป็นค่าเริ่มต้น: หยุด Server ลบ `data/portfolios.json` แล้วรันใหม่

---

## 8. API

| Method | Path | หน้าที่ | สำเร็จ | ผิดพลาด |
|--------|------|--------|--------|---------|
| GET | `/api/portfolios` | ดึง Portfolio ทั้งหมด | 200 | – |
| POST | `/api/portfolios` | สร้าง Portfolio ใหม่ | 201 | 400 (ข้อมูลไม่ครบ / ชื่อซ้ำ) |
| POST | `/api/portfolios/:id/items` | บันทึกโปรไฟล์ + เพิ่ม Item | 201 | 400, 404 |
| POST | `/api/portfolios/:id/import` | Import Item จาก JSON | 201 | 400, 404, 409 (Import ซ้ำ) |

`:id` คือรหัส Portfolio เช่น `portfolio_1`, `portfolio_2`, `portfolio_3` (Server สร้างเลขถัดไปให้อัตโนมัติ)

**ตัวอย่าง: สร้าง Portfolio**
```json
POST /api/portfolios
{
  "displayName": "Adam Smith",
  "whatIEnjoy": "Coding",
  "whatIveTried": "CS100",
  "whatImCuriousAbout": "JavaScript"
}
```

**รูปแบบคำตอบ**
```json
// สำเร็จ
{ "ok": true, "portfolio": { "id": "portfolio_3", "displayName": "Adam Smith", "items": [] } }

// ข้อมูลไม่ผ่าน
{ "ok": false, "errors": { "displayName": "A portfolio with this name already exists." } }
```

---

## 9. Validation Rules

ตรวจทั้งฝั่ง Browser (`public/js/app.js`) และฝั่ง Server (`validation.js`)

| ช่อง | กฎ |
|------|----|
| Display Name และข้อมูลโปรไฟล์ 3 ช่อง | ห้ามว่าง, ชื่อห้ามซ้ำกับ Portfolio อื่น |
| Title, Type, Role, Description | ห้ามว่าง |
| Date | รูปแบบ `YYYY-MM-DD` และต้องเป็นวันที่มีจริง (เช่น `2026-02-31` ไม่ผ่าน) |
| Skills | อย่างน้อย 1 รายการ (ตัดช่องว่างและค่าซ้ำออกให้) |
| Reflection | ต้องกรอกครบ 4 ช่อง |
| Evidence | อย่างน้อย 1 ลิงก์ ขึ้นต้นด้วย `http://` หรือ `https://` |
| รูปภาพ / ไฟล์ | ไม่เกิน 5MB ต่อไฟล์ และไม่เกิน 10 ไฟล์ต่อช่อง |
| Import | ห้าม Import Item เดิมซ้ำเข้า Portfolio เดียวกัน |

---

## 10. Portfolio Item JSON (สำหรับ Import)

```json
{
  "schemaVersion": "1.0",
  "id": "item-g17-001",
  "challengeId": "g17-challenge-1",
  "hostGroup": "G17",
  "category": "discover",
  "title": "Verified Human Quiz Challenge",
  "type": "Activity",
  "date": "2026-11-24",
  "role": "Challenger",
  "description": "ผ่านแบบทดสอบเรื่อง HTML Form และ fetch() ครบ 4 ข้อ",
  "skills": ["Web Basics", "HTTP", "Fetch API"],
  "reflection": {
    "whatIDid": "ทำแบบทดสอบ 4 ข้อ",
    "whatILearned": "fetch() ส่งข้อมูลได้โดยไม่ต้องโหลดหน้าใหม่",
    "challenge": "ต้องเข้าใจลำดับการทำงานของเบราว์เซอร์",
    "nextStep": "ลองใช้ fetch() กับ API จริง"
  },
  "evidence": ["https://github.com/kiatkong-mongkolklee/CS100_POWER_UP_Final_Demo_G17"],
  "photos": [],
  "files": []
}
```

- ช่องที่ต้องมี: `title`, `type`, `date`, `role`, `description`, `skills`, `reflection` (ครบ 4 ช่อง), `evidence`
- `schemaVersion`, `challengeId`, `hostGroup`, `category` และ `id` เป็นข้อมูลเสริม Server จะเก็บไว้ด้วย (`id` เก็บเป็น `sourceId`) เพื่อใช้ตรวจ Import ซ้ำ

---

## 11. Challenge ของกลุ่ม G17

**G17-C01 — Verified Human Quiz + Drawing Game** (หมวด `discover`, ประมาณ 5 นาที)

1. เปิดเว็บ Learning Portfolio ของ G17 แล้วกดเมนู Challenge
2. ตอบคำถาม 4 ข้อเกี่ยวกับการส่งข้อมูลแบบ POST ด้วย HTML Form และ `fetch()` (ตอบผิดลองใหม่ได้)
3. ดูหน้าสรุปผลว่าพลาดไปกี่ครั้ง
4. มินิเกมวาดภาพ: สังเกตหน้าเว็บ 5–10 วินาที แล้ววาดสิ่งที่จำได้ลงกระดาษ
5. สร้าง Portfolio Item JSON แล้ว Import เข้า Portfolio ของตัวเอง

---

## 12. How to Test

- [ ] สร้าง Portfolio ใหม่ แล้วชื่อขึ้นใน dropdown ทั้งส่วน Create, View และ Import
- [ ] สร้าง Portfolio ชื่อซ้ำ → ต้องขึ้น "A portfolio with this name already exists."
- [ ] เพิ่ม Item ครบทุกช่อง → ขึ้น "Portfolio saved!" และการ์ดแสดงใน View Portfolio
- [ ] เว้นช่องว่าง / ใส่ลิงก์ที่ไม่ขึ้นต้นด้วย `http://` → ระบบแจ้ง error และไม่บันทึก
- [ ] แนบรูปและไฟล์ → รูปขึ้นเป็น thumbnail และไฟล์เป็นลิงก์ดาวน์โหลด
- [ ] Refresh หน้าเว็บ → ข้อมูลยังอยู่ (ดึงจาก Server)
- [ ] Export → ได้ไฟล์ `my-portfolio.json`
- [ ] เล่น Challenge จนจบ → Copy JSON → Import สำเร็จ
- [ ] Import JSON เดิมซ้ำ → ระบบไม่ยอมบันทึกซ้ำ

---

## 13. Deploy บน AWS EC2

1. สร้าง EC2 instance แล้วติดตั้ง Node.js
2. Clone โปรเจกต์ลงเครื่อง แล้วรัน `npm install`
3. รัน `npm start` (แนะนำใช้ `pm2` หรือ `systemd` ให้ Server รันค้างไว้และกลับมาทำงานเองหลัง reboot)
4. เปิด port ที่ใช้ (ค่าเริ่มต้น `3000`) ใน Security Group
5. เข้าเว็บที่ `http://3.107.94.198:3000 `

---

## 14. Security Notes

- อย่า commit AWS credentials, ไฟล์ `.pem`, `.env` หรือข้อมูลส่วนตัวขึ้น GitHub
- `.gitignore` ตั้งไว้แล้วให้ไม่ขึ้น `node_modules/`, `data/portfolios.json`, `data/*.tmp`, `*.pem` และ `.env`
- ไฟล์ข้อมูลอยู่นอก `public/` ผู้ใช้จึงเปิดดูไฟล์ JSON ผ่าน URL ไม่ได้

---

## 15. GitHub Repository

https://github.com/kiatkong-mongkolklee/CS100_POWER_UP_Final_Demo_G17