const stages = [
  {
    title: 'ข้อ 1: ส่งฟอร์ม HTML ธรรมดา แล้วหน้าเว็บเป็นยังไง?',
    options: [
      'หน้าเปลี่ยนทั้งหน้า และ URL เปลี่ยน',
      'อยู่หน้าเดิม URL ไม่เปลี่ยน',
      'ไม่มีอะไรเกิดขึ้น'
    ],
    answer: 0,
    hint: '💡 การส่งฟอร์ม HTML ธรรมดาจะทำให้เบราว์เซอร์เปลี่ยนไปแสดงหน้าที่เซิร์ฟเวอร์ตอบกลับ',
    praise: 'ถูกต้อง! ผ่านข้อแรกแล้ว 🎉'
  },
  {
    title: 'ข้อ 2: ถ้าส่งข้อมูลด้วย fetch() หน้าเว็บจะเป็นยังไง?',
    options: [
      'หน้าเปลี่ยนทั้งหน้า',
      'อยู่หน้าเดิม ไม่ต้องโหลดใหม่',
      'เบราว์เซอร์ปิดตัวเอง'
    ],
    answer: 1,
    hint: '💡 fetch() ส่งข้อมูลเบื้องหลังได้ โดยไม่ต้องโหลดหน้าเว็บใหม่',
    praise: 'เก่งมาก! เข้าใจ fetch() แล้ว'
  },
  {
    title: 'ข้อ 3: ตอนส่งข้อมูลไปหาเซิร์ฟเวอร์ ใครเป็นคนส่งจริง ๆ?',
    options: [
      'ตัวฟอร์ม HTML',
      'เบราว์เซอร์',
      'ไฟล์ PHP'
    ],
    answer: 1,
    hint: '💡 เบราว์เซอร์เป็นผู้ส่ง HTTP Request ไปยังเซิร์ฟเวอร์',
    praise: 'ใช่เลย! ตอบถูกอีกข้อแล้ว'
  },
  {
    title: 'ข้อ 4: อยากให้ข้อความบนหน้าเว็บเปลี่ยนโดยไม่ให้หน้ากระพริบ ควรใช้วิธีไหน?',
    options: [
      'กดรีเฟรชหน้าเอง',
      'ฟอร์ม HTML ธรรมดา',
      'JavaScript fetch()'
    ],
    answer: 2,
    hint: '💡 fetch() รับข้อมูล แล้ว JavaScript สามารถนำไปอัปเดตข้อความโดยไม่ต้องโหลดหน้าใหม่',
    praise: 'สุดยอด! ผ่านครบทุกข้อแล้ว 🎉'
  }
];

let i = 0;
let mistakes = 0;

const $ = id => document.getElementById(id);

function say(message) {
  $('bubble').textContent = message;
}

function render() {
  const progress = Math.round(i / stages.length * 100);

  $('fill').style.width = progress + '%';
  $('pct').textContent = progress + '%';

  if (i >= stages.length) {
    finish();
    return;
  }

  const s = stages[i];

  let html = `
    <h3>${s.title}</h3>

    <div class="chips">
      ${s.options.map((option, k) => `
        <button class="opt" data-k="${k}">
          ${option}
        </button>
      `).join('')}
    </div>

    <p class="hint" id="hint"></p>

    <button class="btn btn-primary" id="next" disabled>
      ข้อต่อไป
    </button>
  `;

  $('card').innerHTML = html;

  $('next').onclick = () => {
    i++;
    render();
  };

  bindChoice(s);
}

function bindChoice(s) {
  document.querySelectorAll('.opt').forEach(button => {
    button.onclick = () => {
      if (!$('next').disabled) return;

      if (+button.dataset.k === s.answer) {
        button.classList.add('ok');
        $('hint').textContent = s.hint;
        $('next').disabled = false;
        say(s.praise);
      } else {
        button.classList.add('bad');
        mistakes++;
        say('ยังไม่ใช่นะ ลองใหม่อีกครั้ง 🤔');

        setTimeout(() => {
          button.classList.remove('bad');
        }, 450);
      }
    };
  });
}

function finish() {
  $('fill').style.width = '100%';
  $('pct').textContent = '100%';

  say(`ผ่านแล้ว! พลาด ${mistakes} ครั้ง 😁`);

  $('card').innerHTML = `
    <div class="result">
      <div class="tick">✓</div>
      <h2>Verified Human 100%</h2>
      <p>
        คุณตอบคำถามครบทั้ง 4 ข้อแล้ว
        (พลาด ${mistakes} ครั้ง)
      </p>
      <button class="btn btn-primary" id="restart">
        เล่นอีกรอบ
      </button>
    </div>
  `;

  // โชว์กล่อง Export Challenge ตอนตอบครบทุกข้อ
  const exportSection = $('export-challenge-section');
  if (exportSection) {
    exportSection.classList.remove('hidden');
  }

  $('restart').onclick = () => {
    i = 0;
    mistakes = 0;
    say('พร้อมเล่นเกมหรือยัง? 😊');

    // ซ่อนกล่อง Export และกล่องผลลัพธ์ JSON กลับไปเหมือนเดิมเมื่อกดเริ่มใหม่
    if (exportSection) exportSection.classList.add('hidden');
    const resultBox = $('json-result-box');
    if (resultBox) resultBox.classList.add('hidden');

    render();
  };
}

// ==========================================
// ส่วนสร้าง Item JSON และปุ่ม Copy
// ==========================================
function generateItemJSON() {
  const itemData = {
    title: "Verified Human Quiz Challenge",
    type: "Activity",
    date: new Date().toISOString().split('T')[0],
    role: "Challenger",
    description: "ผ่านแบบทดสอบความเข้าใจเรื่องการทำงานของ HTML Form และ JavaScript fetch() ครบทั้ง 4 ข้อ",
    skills: ["Web Basics", "HTTP", "Fetch API"],
    reflection: {
      whatIDid: "ทำแบบทดสอบเรื่องความแตกต่างระหว่างการส่งฟอร์ม HTML ปกติกับการใช้ fetch() จำนวน 4 ข้อ",
      whatILearned: "เข้าใจกลไกการส่ง HTTP Request เบื้องหลังผ่าน JavaScript โดยไม่ต้องโหลดหน้าเว็บใหม่ทั้งหน้า",
      challenge: "ต้องวิเคราะห์การทำงานของเบราว์เซอร์ในแต่ละขั้นตอนให้แม่นยำ",
      nextStep: "นำความรู้เรื่อง fetch() ไปประยุกต์ใช้เชื่อมต่อ API ในโปรเจกต์จริง"
    },
    evidence: ["https://example.com/verified-human-quiz"],
    photos: [],
    files: []
  };

  return JSON.stringify(itemData, null, 2);
}

// ผูกปุ่ม "สร้าง Portfolio Item JSON"
const exportChallengeBtn = $('export-challenge-btn');
if (exportChallengeBtn) {
  exportChallengeBtn.addEventListener('click', () => {
    const jsonTextarea = $('challenge-item-json');
    const resultBox = $('json-result-box');

    if (jsonTextarea) {
      jsonTextarea.value = generateItemJSON();
    }
    if (resultBox) {
      resultBox.classList.remove('hidden');
    }
  });
}

// ผูกปุ่ม "📋 Copy JSON"
const copyJsonBtn = $('copy-json-btn');
if (copyJsonBtn) {
  copyJsonBtn.addEventListener('click', async () => {
    const jsonTextarea = $('challenge-item-json');
    if (!jsonTextarea || !jsonTextarea.value) return;

    try {
      await navigator.clipboard.writeText(jsonTextarea.value);
    } catch (err) {
      jsonTextarea.select();
      document.execCommand('copy');
    }

    alert('คัดลอกโค้ด JSON เรียบร้อยแล้ว! นำไปวางในหน้าแรกได้เลย');
  });
}

render();