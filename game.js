/* ==========================================================
   منصة المسلم الصغير - UNIFIED GAME ENGINE (Hub & Games)
   ========================================================== */

// --- Anti-Inspect & Security Protection System ---
(function() {
  // 1. Disable Right-Click Context Menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Disable Developer Keyboard Shortcuts
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Ctrl+Shift+I / Cmd+Option+I (Inspect)
    // Ctrl+Shift+J / Cmd+Option+J (Console)
    // Ctrl+Shift+C / Cmd+Option+C (Elements)
    // Ctrl+U / Cmd+U (View Source)
    // Ctrl+S / Cmd+S (Save Page)
    if (
      (e.ctrlKey || e.metaKey) &&
      (
        e.key === 'u' || e.key === 'U' || e.keyCode === 85 ||
        e.key === 's' || e.key === 'S' || e.keyCode === 83 ||
        ((e.shiftKey || e.altKey) && (
          e.key === 'i' || e.key === 'I' || e.keyCode === 73 ||
          e.key === 'j' || e.key === 'J' || e.keyCode === 74 ||
          e.key === 'c' || e.key === 'C' || e.keyCode === 67
        ))
      )
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });

  // 3. Clear and Silence Console
  try {
    if (typeof console !== 'undefined') {
      const noop = function() {};
      console.log = noop;
      console.debug = noop;
      console.info = noop;
    }
  } catch (err) {}
})();

// --- Global Audio Synthesizer & Speech Engine ---
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playCorrect() {
    this.playTone(523.25, 'triangle', 0.1, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.15), 90); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.2), 180); // G5
  }

  playWrong() {
    this.playTone(220, 'sawtooth', 0.18, 0.12);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.25, 0.15), 100);
  }

  playPop() {
    this.playTone(800, 'sine', 0.08, 0.2);
  }

  playFlip() {
    this.playTone(400, 'sine', 0.05, 0.1);
  }

  playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.2), idx * 120);
    });
  }

  playTakbeerMelody() {
    const notes = [440, 493.88, 523.25, 587.33, 523.25, 493.88, 440];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.15), idx * 180);
    });
  }
}

const sfx = new SoundEffects();

// --- Analytics Event Tracking Helper ---
function trackGAEvent(eventName, params = {}) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch (e) {
    // Ignore analytics error
  }
}

// --- Custom In-Game Modal Dialogs (Alert & Confirm) ---
function showCustomAlert(title, message, icon = '💡', btnText = 'حسناً يا بطل 🌟') {
  const modal = document.getElementById('modal-custom-alert');
  const iconElem = document.getElementById('alert-icon-view');
  const titleElem = document.getElementById('alert-title-view');
  const msgElem = document.getElementById('alert-msg-view');
  const primaryBtn = document.getElementById('btn-alert-primary');
  const primaryText = document.getElementById('btn-alert-primary-text');
  const cancelBtn = document.getElementById('btn-alert-cancel');

  if (iconElem) iconElem.innerText = icon;
  if (titleElem) titleElem.innerText = title;
  if (msgElem) msgElem.innerText = message;
  if (primaryText) primaryText.innerText = btnText;
  if (cancelBtn) cancelBtn.style.display = 'none';

  if (primaryBtn) {
    primaryBtn.onclick = () => {
      sfx.playPop();
      if (modal) modal.classList.remove('active');
    };
  }

  if (modal) modal.classList.add('active');
}

function showCustomConfirm(title, message, icon = '⚠️', confirmText = 'نعم، متأكد', cancelText = 'إلغاء ❌', onConfirm, onCancel) {
  const modal = document.getElementById('modal-custom-alert');
  const iconElem = document.getElementById('alert-icon-view');
  const titleElem = document.getElementById('alert-title-view');
  const msgElem = document.getElementById('alert-msg-view');
  const primaryBtn = document.getElementById('btn-alert-primary');
  const primaryText = document.getElementById('btn-alert-primary-text');
  const cancelBtn = document.getElementById('btn-alert-cancel');
  const cancelTextElem = document.getElementById('btn-alert-cancel-text');

  if (iconElem) iconElem.innerText = icon;
  if (titleElem) titleElem.innerText = title;
  if (msgElem) msgElem.innerText = message;
  if (primaryText) primaryText.innerText = confirmText;
  if (cancelTextElem) cancelTextElem.innerText = cancelText;
  if (cancelBtn) cancelBtn.style.display = 'block';

  if (primaryBtn) {
    primaryBtn.onclick = () => {
      if (modal) modal.classList.remove('active');
      if (typeof onConfirm === 'function') onConfirm();
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      sfx.playPop();
      if (modal) modal.classList.remove('active');
      if (typeof onCancel === 'function') onCancel();
    };
  }

  if (modal) modal.classList.add('active');
}

// --- Visual Feedback for Correct Answers ---
function showVisualFeedback(elem, text = "+10 ⭐ أحسنت!") {
  if (!elem) return;

  const rect = elem.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // 1. Floating sparkle badge
  const badge = document.createElement('div');
  badge.className = 'floating-sparkle-badge';
  badge.innerHTML = `<span>✨</span><span>${text}</span>`;
  badge.style.left = `${x}px`;
  badge.style.top = `${y}px`;
  document.body.appendChild(badge);
  setTimeout(() => badge.remove(), 1000);

  // 2. Element glow ripple
  elem.classList.add('correct-glow-burst');
  setTimeout(() => elem.classList.remove('correct-glow-burst'), 600);

  // 3. Mini Confetti Sparkle
  if (typeof confetti === 'function') {
    const normX = Math.max(0.1, Math.min(0.9, x / window.innerWidth));
    const normY = Math.max(0.1, Math.min(0.9, y / window.innerHeight));
    confetti({
      particleCount: 18,
      spread: 45,
      startVelocity: 22,
      origin: { x: normX, y: normY },
      colors: ['#10b981', '#f59e0b', '#38bdf8', '#fbbf24']
    });
  }
}

// ==========================================================
// DATA: HAJJ GAME (GAME 1)
// ==========================================================
const GAME_LEVELS = [
  {
    id: 1,
    title: "تجهيز السفر ونية الإحرام",
    desc: "الإحرام هو نية الدخول في النسك (ركن) وتجهيز ثياب الإحرام البيضاء (سُنّة)",
    fiqhCategory: "rukn",
    fiqhTag: "🌟 ركن وسُنّة",
    stampName: "ختم نية الإحرام والاستعداد",
    stampIcon: "🧳",
    hasanat: 60
  },
  {
    id: 2,
    title: "الميقات الشرعي وترديد التلبية",
    desc: "الإحرام من الميقات المعتبر شرعاً (واجب) وترديد التلبية «لبيك اللهم لبيك» (سُنّة مؤكدة)",
    fiqhCategory: "wajib",
    fiqhTag: "🏷️ واجب وسُنّة",
    stampName: "ختم الميقات والتلبية",
    stampIcon: "🕊️",
    hasanat: 70
  },
  {
    id: 3,
    title: "الطواف 7 أشواط حول الكعبة المشرفة",
    desc: "طواف الإفاضة (ركن الحج) وطواف القدوم والرمل واستلام الحجر (سُنّة)",
    fiqhCategory: "rukn",
    fiqhTag: "🌟 ركن الحج",
    stampName: "ختم الطواف المبارك",
    stampIcon: "🕋",
    hasanat: 100
  },
  {
    id: 4,
    title: "السعي بين الصفا والمروة وماء زمزم",
    desc: "السعي 7 أشواط (ركن الحج) والهرولة بين العلمين وشرب زمزم (سُنّة)",
    fiqhCategory: "rukn",
    fiqhTag: "🌟 ركن الحج",
    stampName: "ختم السعي وزمزم",
    stampIcon: "💧",
    hasanat: 80
  },
  {
    id: 5,
    title: "مخيم منى ويوم التروية (8 ذي الحجة)",
    desc: "المبيت بمنى يوم التروية (سُنّة مستحبة) والمبيت بمنى ليالي التشريق (واجب)",
    fiqhCategory: "sunnah",
    fiqhTag: "🌸 سُنّة مستحبة",
    stampName: "ختم مخيم منى والإحسان",
    stampIcon: "⛺",
    hasanat: 80
  },
  {
    id: 6,
    title: "الوقوف بعرفة (أعظم أركان الحج)",
    desc: "الوقوف بعرفة (ركن أعظم - الحج عرفة) والبقاء للغروب (واجب) والدعاء (سُنّة)",
    fiqhCategory: "rukn",
    fiqhTag: "🌟 ركن الحج الأعظم",
    stampName: "ختم يوم عرفة والدعاء",
    stampIcon: "🤲",
    hasanat: 120
  },
  {
    id: 7,
    title: "ليلة مزدلفة والمشعر الحرام",
    desc: "المبيت بمزدلفة ليلة النحر (واجب) وجمع الحصى لرمي الجمار",
    fiqhCategory: "wajib",
    fiqhTag: "🏷️ واجب الحج",
    stampName: "ختم ليلة مزدلفة",
    stampIcon: "🌌",
    hasanat: 70
  },
  {
    id: 8,
    title: "رمي الجمرات، الحلق وفرحة العيد",
    desc: "رمي الجمار (واجب) والحلق أو التقصير (واجب) والتكبير والعيد (سُنّة)",
    fiqhCategory: "wajib",
    fiqhTag: "🏷️ واجبات الحج",
    stampName: "ختم رمي الجمرات والتحلل",
    stampIcon: "🎈",
    hasanat: 100
  },
  {
    id: 9,
    title: "طواف الوداع وختام مناسك الحج",
    desc: "طواف الوداع (واجب) ليكون آخر عهد الحاج بالبيت الحرام قبل سفره",
    fiqhCategory: "wajib",
    fiqhTag: "🏷️ واجب الحج",
    stampName: "وسام إتمام الحج الأكبر",
    stampIcon: "👑",
    hasanat: 150
  }
];

// ==========================================================
// DATA: MEMORY MATCH GAME (GAME 2)
// ==========================================================
const MEMORY_LEVELS_DATA = {
  1: {
    title: "المستوى 1: السهل",
    timeLimit: 60,
    hasanat: 60,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m1", word: "الْكَوْثَر", meaning: "نَهْرٌ فِي الْجَنَّة", emoji: "🌊" },
      { id: "m2", word: "أَبَابِيل", meaning: "طُيُورٌ مُتَتَابِعَة", emoji: "🕊️" },
      { id: "m3", word: "الصَّمَد", meaning: "المَقْصُودُ فِي الحَوَائِج", emoji: "🤲" },
      { id: "m4", word: "سِجِّيل", meaning: "طِينٌ مُتَحَجِّر", emoji: "🪨" }
    ]
  },
  2: {
    title: "المستوى 2: المتوسط",
    timeLimit: 75,
    hasanat: 100,
    gridClass: "grid-4x3",
    pairs: [
      { id: "m5", word: "الْفَلَق", meaning: "الصُّبْحُ وَضِيَاؤُه", emoji: "🌅" },
      { id: "m6", word: "الْمَاعُون", meaning: "المَعُونَةُ كالْمَاءِ وَالآنِيَة", emoji: "🏺" },
      { id: "m7", word: "إِيلَافِهِم", meaning: "رِحْلَةُ الشِّتَاءِ وَالصَّيْف", emoji: "🐫" },
      { id: "m8", word: "الْخَنَّاس", meaning: "المُخْتَفِي عِنْدَ ذِكْرِ الله", emoji: "🛡️" },
      { id: "m9", word: "غَاسِقٍ إِذَا وَقَب", meaning: "اللَّيْلُ إِذَا أَظْلَم", emoji: "🌑" },
      { id: "m10", word: "حَبْلٌ مِّن مَّسَد", meaning: "حَبْلٌ مَفْتُولٌ قَوِيّ", emoji: "🪢" }
    ]
  },
  3: {
    title: "المستوى 3: المتقدم",
    timeLimit: 90,
    hasanat: 150,
    gridClass: "grid-4x4",
    pairs: [
      { id: "m11", word: "الْعَادِيَاتِ ضَبْحًا", meaning: "الخَيْلُ الَّتِي تَرْكُض", emoji: "🐎" },
      { id: "m12", word: "أَثْقَالَهَا", meaning: "كُنُوزُ وَمَوْتَى الأَرْض", emoji: "🌍" },
      { id: "m13", word: "هَاوِيَة", meaning: "نَارٌ عَمِيقَةٌ حَارَّة", emoji: "🔥" },
      { id: "m14", word: "كَالْفَرَاشِ الْمَبْثُوث", meaning: "المُنْتَشِرُ فِي كُلِّ مَكَان", emoji: "🦋" },
      { id: "m15", word: "الصَّاخَّة", meaning: "صَيْحَةُ يَوْمِ القِيَامَة", emoji: "📢" },
      { id: "m16", word: "لَيْلَةُ الْقَدْر", meaning: "خَيْرٌ مِنْ أَلْفِ شَهْر", emoji: "🌟" },
      { id: "m17", word: "وَقُودُهَا النَّاس", meaning: "حَطَبُهَا وَمَا يُوقِدُهَا", emoji: "🕯️" },
      { id: "m18", word: "سِرَاجًا وَهَّاجًا", meaning: "الشَّمْسُ المُضِيئَة", emoji: "☀️" }
    ]
  }
};

// ==========================================================
// DATA: MIRACLES & PROPHETS' STORIES GAME (GAME 3: معجزات وقصص الأنبياء)
// ==========================================================
const STORY_BLOCKS_DATA = {
  1: {
    title: "المستوى 1: المستكشف الصغير",
    desc: "معجزتان منيرتان (قصص الأنبياء الأساسية)",
    miraclesCount: 2,
    hasanat: 80,
    stories: [
      {
        id: "s1",
        prophet: "سيدنا يونس عليه السلام",
        title: "صاحب الحوت",
        miracles: [
          { icon: "🐋", name: "الحوت العظيم" },
          { icon: "⛵", name: "السفينة" }
        ],
        hint: "نبي التقمه الحوت في ظلمات البحر وهو يسبح الله!",
        moral: "سيدنا يونس عليه السلام في بطن الحوت نادى: «لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ» فنجاه الله بفضله.",
        options: ["سيدنا يونس عليه السلام", "سيدنا نوح عليه السلام", "سيدنا هود عليه السلام", "سيدنا لوط عليه السلام"]
      },
      {
        id: "s2",
        prophet: "سيدنا نوح عليه السلام",
        title: "صانع السفينة والطوفان",
        miracles: [
          { icon: "🚢", name: "السفينة العظيمة" },
          { icon: "🌊", name: "طوفان الماء" }
        ],
        hint: "أمره الله بصنع سفينة ضخمة وركوب المؤمنين وزوجين من كل حيوان!",
        moral: "سيدنا نوح عليه السلام صنع السفينة بأمر الله لإنقاذ المؤمنين من الطوفان العظيم.",
        options: ["سيدنا نوح عليه السلام", "سيدنا يونس عليه السلام", "سيدنا إبراهيم عليه السلام", "سيدنا صالح عليه السلام"]
      },
      {
        id: "s3",
        prophet: "سيدنا موسى عليه السلام",
        title: "كليم الله والعصا المعجزة",
        miracles: [
          { icon: "🐍", name: "العصا المعجزة" },
          { icon: "🌊", name: "انفلاق البحر" }
        ],
        hint: "ضرب البحر بعصاه فانفلق طريقاً يابساً لنجاة بني إسرائيل!",
        moral: "سيدنا موسى عليه السلام كليم الله أيده الله بمعجزة العصا وفلق البحر لنجاة المؤمنين.",
        options: ["سيدنا موسى عليه السلام", "سيدنا عيسى عليه السلام", "سيدنا يوسف عليه السلام", "سيدنا هارون عليه السلام"]
      },
      {
        id: "s4",
        prophet: "حادثة أصحاب الفيل",
        title: "حماية الكعبة المشرفة",
        miracles: [
          { icon: "🐘", name: "الفيل" },
          { icon: "🕋", name: "الكعبة المشرفة" }
        ],
        hint: "جاء أبرهة بفيله لهدم الكعبة فأرسل الله طيراً أبابيل بحجارة من سجيل!",
        moral: "حمى الله بيته الحرام من كيد أصحاب الفيل وأرسل عليهم طيراً أبابيل.",
        options: ["حادثة أصحاب الفيل", "سيدنا إبراهيم عليه السلام", "سيدنا صالح عليه السلام", "سيدنا إسماعيل عليه السلام"]
      }
    ]
  },
  2: {
    title: "المستوى 2: الراوي الماهر",
    desc: "3 معجزات منيرة (تحدي الذكاء والترابط)",
    miraclesCount: 3,
    hasanat: 120,
    stories: [
      {
        id: "s5",
        prophet: "سيدنا إبراهيم عليه السلام",
        title: "خليل الرحمن وبناء الكعبة",
        miracles: [
          { icon: "🔥", name: "النار الباردة" },
          { icon: "🕋", name: "بناء الكعبة" },
          { icon: "🐑", name: "كبش الفداء" }
        ],
        hint: "ألقي في النار فكانت برداً وسلاماً، وبنى الكعبة مع ابنه وفداه الله بكبش عظيم!",
        moral: "سيدنا إبراهيم خليل الرحمن جعل الله النار عليه برداً وسلاماً وبنى الكعبة المشرفة مع ابنه إسماعيل.",
        options: ["سيدنا إبراهيم عليه السلام", "سيدنا يعقوب عليه السلام", "سيدنا إسحاق عليه السلام", "سيدنا شعيب عليه السلام"]
      },
      {
        id: "s6",
        prophet: "سيدنا يوسف عليه السلام",
        title: "الصديق الجميل وعزيز مصر",
        miracles: [
          { icon: "🐺", name: "الذئب" },
          { icon: "🕳️", name: "البئر العميق" },
          { icon: "👕", name: "القميص" }
        ],
        hint: "ألقاه إخوته في الجب وقالوا أكله الذئب، وارتد بصر أبيه بقميصه!",
        moral: "سيدنا يوسف الصديق عليه السلام صبر على الشدائد فرفعه الله ومكنه في الأرض وجعله عزيز مصر.",
        options: ["سيدنا يوسف عليه السلام", "سيدنا يونس عليه السلام", "سيدنا يحيى عليه السلام", "سيدنا زكريا عليه السلام"]
      },
      {
        id: "s7",
        prophet: "سيدنا صالح عليه السلام",
        title: "نبي قوم ثمود والناقة المعجزة",
        miracles: [
          { icon: "🐪", name: "ناقة الله" },
          { icon: "🪨", name: "الصخرة الصماء" },
          { icon: "💧", name: "شرب الماء" }
        ],
        hint: "أخرج الله له ناقة عظيمة من وسط الصخرة لها شرب يوم معلوم!",
        moral: "سيدنا صالح عليه السلام أيده الله بمعجزة خروج الناقة من الصخرة لقوم ثمود.",
        options: ["سيدنا صالح عليه السلام", "سيدنا هود عليه السلام", "سيدنا لوط عليه السلام", "سيدنا شعيب عليه السلام"]
      },
      {
        id: "s8",
        prophet: "سيدنا داوود عليه السلام",
        title: "الملك النبي وصوت المزامير",
        miracles: [
          { icon: "🛡️", name: "الدروع السابغة" },
          { icon: "🔨", name: "إلانة الحديد" },
          { icon: "⛰️", name: "تسبيح الجبال" }
        ],
        hint: "ألان الله له الحديد فصنع الدروع، وكانت الجبال تسبح معه بصوته العذب!",
        moral: "سيدنا داوود عليه السلام ألان الله له الحديد وعلمه صنعة الدروع وسخر الجبال لتسبح معه.",
        options: ["سيدنا داوود عليه السلام", "سيدنا سليمان عليه السلام", "سيدنا موسى عليه السلام", "سيدنا ذو الكفل عليه السلام"]
      }
    ]
  },
  3: {
    title: "المستوى 3: حكيم القصص القرآني",
    desc: "4 معجزات منيرة (تحدي حُفّاظ قصص الأنبياء)",
    miraclesCount: 4,
    hasanat: 160,
    stories: [
      {
        id: "s9",
        prophet: "سيدنا سليمان عليه السلام",
        title: "ملك الأنس والجن والحيوان",
        miracles: [
          { icon: "🪶", name: "الهدهد الذكي" },
          { icon: "🐜", name: "وادي النمل" },
          { icon: "👑", name: "عرش بلقيس" },
          { icon: "🌪️", name: "الريح المسخرة" }
        ],
        hint: "فهم لغة الطير والنمل وسخر الله له الريح والجن وأوتي ملكاً عظيماً!",
        moral: "سيدنا سليمان عليه السلام آتاه الله الحكمة وعلمه منطق الطير وسخر له الريح والجن شكراً لله.",
        options: ["سيدنا سليمان عليه السلام", "سيدنا داوود عليه السلام", "سيدنا يوسف عليه السلام", "سيدنا موسى عليه السلام"]
      },
      {
        id: "s10",
        prophet: "سيدنا عيسى عليه السلام",
        title: "المسيح وكلمة الله",
        miracles: [
          { icon: "🕊️", name: "طين كهيئة الطير" },
          { icon: "👁️", name: "إبراء الأكمه" },
          { icon: "🌸", name: "المائدة السماوية" },
          { icon: "👶", name: "الكلام في المهد" }
        ],
        hint: "تكلم في المهد صبياً وأبرأ الأكمه والأبرص ونفخ في الطين بإذن الله!",
        moral: "سيدنا عيسى المسيح عليه السلام أيده الله بمعجزات باهرة كإبراء المرضى وإحياء الموتى بإذن الله.",
        options: ["سيدنا عيسى عليه السلام", "سيدنا يحيى عليه السلام", "سيدنا زكريا عليه السلام", "سيدنا إدريس عليه السلام"]
      },
      {
        id: "s11",
        prophet: "سيدنا أيوب عليه السلام",
        title: "رمز الصبر والشفاء",
        miracles: [
          { icon: "💧", name: "النبع البارد" },
          { icon: "🌿", name: "الشفاء والبركة" },
          { icon: "🤲", name: "الدعاء الخاشع" },
          { icon: "✨", name: "الصبر الجميل" }
        ],
        hint: "صبر على المرض وفقد الأهل فنادى ربه: «أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ»!",
        moral: "سيدنا أيوب عليه السلام ضرب أعظم مثل في الصبر وعوضه الله خيراً وشفاه بنبع ماء بارد مبارك.",
        options: ["سيدنا أيوب عليه السلام", "سيدنا يونس عليه السلام", "سيدنا يعقوب عليه السلام", "سيدنا إلياس عليه السلام"]
      },
      {
        id: "s12",
        prophet: "خاتم الأنبياء محمد ﷺ",
        title: "رحمة للعالمين ونور الهدى",
        miracles: [
          { icon: "🌿", name: "غار ثور والحمامة" },
          { icon: "📖", name: "القرآن المعجزة" },
          { icon: "🌙", name: "انشقاق القمر" },
          { icon: "🐎", name: "الإسراء والمعراج" }
        ],
        hint: "خاتم الرسل والأنبياء، أنزل عليه القرآن الكريم معجزته الخالدة وأسرى به إلى المسجد الأقصى!",
        moral: "نبينا محمد ﷺ خير خلق الله وخاتم النبيين، أرسله الله رحمة للعالمين بالقرآن الكريم وهديه المبارك.",
        options: ["خاتم الأنبياء محمد ﷺ", "سيدنا إبراهيم عليه السلام", "سيدنا موسى عليه السلام", "سيدنا عيسى عليه السلام"]
      }
    ]
  }
};

// ==========================================================
// GAME 4 DATA: CONQUEST MAP & SAHABA HEROES (خريطة الفتوحات وسفراء الإسلام)
// ==========================================================
const CONQUEST_CAMPAIGNS_DATA = {
  1: {
    id: 1,
    title: "الحملة 1: سفراء الهداية وبداية الدعوة",
    desc: "وجّه سفراء رسول الله ﷺ لنشر نور التوحيد في مكة والمدينة والحبشة ومؤتة",
    hasanat: 120,
    cities: [
      { id: "mutah", name: "مؤتة / الشام", icon: "🛡️", x: 82, y: 18 },
      { id: "madinah", name: "المدينة المنورة", icon: "🌴", x: 46, y: 32 },
      { id: "makkah", name: "مكة المكرمة", icon: "🕋", x: 68, y: 74 },
      { id: "abyssinia", name: "أرض الحبشة", icon: "⛵", x: 18, y: 76 }
    ],
    heroes: [
      {
        id: "musab",
        name: "مصعب بن عمير",
        title: "سفير الإسلام الأول",
        icon: "📜",
        targetCityId: "madinah",
        clue: "سفير رسول الله الأول، ذهب ليعلم أهل يثرب القرآن فأسلم على يديه كبار الأنصار.",
        fact: "مهّد البطل مصعب بن عمير رضي الله عنه لهجرة النبي ﷺ وأسلم بسببه أشراف أهل المدينة."
      },
      {
        id: "jafar",
        name: "جعفر بن أبي طالب",
        title: "خطيب الهجرة والشهيد الطيار",
        icon: "🕊️",
        targetCityId: "abyssinia",
        clue: "قاد المهاجرين الأوائل عبر البحر وخاطب النجاشي ملك الحبشة بآيات سورة مريم بحكمة وبلاغة.",
        fact: "دافع جعفر رضي الله عنه عن المهاجرين ولقبه النبي ﷺ بـ (ذي الجناحين) في الجنة."
      },
      {
        id: "bilal",
        name: "بلال بن رباح",
        title: "مؤذن الرسول ﷺ",
        icon: "🕌",
        targetCityId: "makkah",
        clue: "رمز الصبر والثبات، صدح بأول أذان من فوق ظهر الكعبة المشرفة يوم فتح مكة.",
        fact: "صاحب مقولة (أحدٌ أحد)، واختاره النبي ﷺ ليكون أول مؤذن في تاريخ الإسلام."
      },
      {
        id: "zayd",
        name: "زيد بن حارثة",
        title: "حب رسول الله والقائد",
        icon: "⚔️",
        targetCityId: "mutah",
        clue: "القائد الشجاع الذي ولاه النبي ﷺ قيادة الجيش المتجه نحو بلاد الشام في معركة مؤتة.",
        fact: "الصحابي الجليل الوحيد الذي ذُكر اسمه صريحاً في القرآن الكريم لشرفه ومكانته."
      }
    ]
  },
  2: {
    id: 2,
    title: "الحملة 2: حماة المدينة وبناة النصر",
    desc: "ثبّت حصون الإسلام في الخندق وخيبر وأحد وحمص الشام",
    hasanat: 130,
    cities: [
      { id: "damascus", name: "دمشق / الشام", icon: "🏛️", x: 82, y: 18 },
      { id: "khaybar", name: "حصون خيبر", icon: "🏰", x: 20, y: 28 },
      { id: "khandaq", name: "خندق المدينة", icon: "⛏️", x: 45, y: 54 },
      { id: "uhud", name: "جبل أحد", icon: "⛰️", x: 78, y: 75 }
    ],
    heroes: [
      {
        id: "salman",
        name: "سلمان الفارسي",
        title: "صاحب فكرة الخندق",
        icon: "💡",
        targetCityId: "khandaq",
        clue: "الحكيم الباحث عن الحق، أشار على المسلمين بحفر الخندق حول المدينة لحمايتها من جيوش الأحزاب.",
        fact: "قال عنه النبي ﷺ: (سلمان منا آل البيت) لحكمته العظيمة وصدق إيمانه."
      },
      {
        id: "ali",
        name: "علي بن أبي طالب",
        title: "فارس الإسلام وفاتح الحصن",
        icon: "🛡️",
        targetCityId: "khaybar",
        clue: "ابن عم النبي ﷺ ورابع الخلفاء الراشدين، حمل الراية ففتح حصن خيبر المنيع بشجاعة وبسالة.",
        fact: "قال عنه النبي ﷺ يوم خيبر: (لأعطين الراية غداً رجلاً يحب الله ورسوله ويحبه الله ورسوله)."
      },
      {
        id: "hamza",
        name: "حمزة بن عبد المطلب",
        title: "أسد الله وسيد الشهداء",
        icon: "🦁",
        targetCityId: "uhud",
        clue: "عم رسول الله ﷺ وأعظم الفرسان، قاتل في غزوة أحد ببطولة وشجاعة نادرة حتى نال الشهادة.",
        fact: "لقبه رسول الله ﷺ بـ (أسد الله وأسد رسوله) وسيد الشهداء في الجنة."
      },
      {
        id: "abu_ubaidah",
        name: "أبو عبيدة بن الجراح",
        title: "أمين هذه الأمة",
        icon: "🔑",
        targetCityId: "damascus",
        clue: "أحد العشرة المبشرين بالجنة، قاد جيوش الفتح لدمشق ومدن الشام بعدل ورحمة وإحسان.",
        fact: "قال عنه النبي ﷺ: (لكل أمة أمين، وأمين هذه الأمة أبو عبيدة بن الجراح)."
      }
    ]
  },
  3: {
    id: 3,
    title: "الحملة 3: قادة الفتوحات الكبرى",
    desc: "انشر رايات الإسلام في اليرموك ومصر والقادسية وبحار الإسكندرية",
    hasanat: 150,
    cities: [
      { id: "alexandria", name: "الإسكندرية والبحار", icon: "⚓", x: 20, y: 22 },
      { id: "yarmouk", name: "سهل اليرموك", icon: "⚔️", x: 82, y: 20 },
      { id: "fustat", name: "مصر / الفسطاط", icon: "🏛️", x: 22, y: 76 },
      { id: "qadisiyyah", name: "أرض القادسية", icon: "🏹", x: 78, y: 74 }
    ],
    heroes: [
      {
        id: "khalid",
        name: "خالد بن الوليد",
        title: "سيف الله المسلول",
        icon: "⚔️",
        targetCityId: "yarmouk",
        clue: "العبقري العسكري الفذ الذي لم يُهزم، قاد معركة اليرموك الحاسمة في بلاد الشام ببراعة فائقة.",
        fact: "سماه رسول الله ﷺ (سيف الله المسلول) لشجاعته وحنكته وفتوحاته العظيمة."
      },
      {
        id: "amr",
        name: "عمرو بن العاص",
        title: "فاتح أرض مصر",
        icon: "🌾",
        targetCityId: "fustat",
        clue: "القائد الحكيم الذي فتح أرض مصر، وبنى مدينة الفسطاط وأول مسجد جامع في قارة إفريقيا.",
        fact: "فتح مصر ونشر فيها الإسلام بالعدل والتسامح وحفظ حقوق أهلها."
      },
      {
        id: "saad",
        name: "سعد بن أبي وقاص",
        title: "فارس القادسية وخال النبي",
        icon: "🏹",
        targetCityId: "qadisiyyah",
        clue: "أول من رمى بسهم في الإسلام، قاد المسلمين للنصر التاريخي العظيم في معركة القادسية.",
        fact: "كان مجاب الدعوة وفارساً شجاعاً من العشرة المبشرين بالجنة."
      },
      {
        id: "uthman",
        name: "عثمان بن عفان",
        title: "ذو النورين وناشر المصحف",
        icon: "⛵",
        targetCityId: "alexandria",
        clue: "ثالث الخلفاء الراشدين، جهز جيش العسرة، وأنشأ أول أسطول بحري إسلامي في الإسكندرية والبحار.",
        fact: "جمع القرآن الكريم في مصحف واحد وبنى أول قوة بحرية لحماية بلاد المسلمين."
      }
    ]
  }
};

// ==========================================================
// UNIFIED GAME MANAGER (State & Multi-Profiles)
// ==========================================================
class GameManager {
  constructor() {
    this.profiles = [];
    this.activeProfileId = null;
    this.player = {
      id: "p_default",
      name: "زائر",
      avatar: "boy",
      hasanat: 0,
      currentLevelId: 1,
      completedLevels: [],
      completedMemoryLevels: [],
      completedStoryLevels: [],
      completedConquestLevels: [],
      discoveredWords: [],
      discoveredProphets: [],
      discoveredConquests: [],
      soundEnabled: true
    };

    this.activeStage = null;
    this.activeScreen = 'screen-welcome';
    this.loadState();
  }

  loadState() {
    try {
      const savedV2 = localStorage.getItem('rehlat_bayt_allah_data_v2');
      if (savedV2) {
        const parsed = JSON.parse(savedV2);
        this.profiles = parsed.profiles || [];
        this.activeProfileId = parsed.activeProfileId || (this.profiles[0] ? this.profiles[0].id : null);
        const cur = this.profiles.find(p => p.id === this.activeProfileId);
        if (cur) {
          this.player = cur;
        } else if (this.profiles.length > 0) {
          this.player = this.profiles[0];
          this.activeProfileId = this.player.id;
        }
      } else {
        const savedV1 = localStorage.getItem('rehlat_bayt_allah_data');
        if (savedV1) {
          const old = JSON.parse(savedV1);
          const p = {
            id: "p_" + Date.now(),
            name: old.name || "محمود",
            avatar: old.avatar || "boy",
            hasanat: old.hasanat || 0,
            currentLevelId: old.currentLevelId || 1,
            completedLevels: old.completedLevels || [],
            completedMemoryLevels: [],
            discoveredWords: [],
            soundEnabled: true
          };
          this.profiles = [p];
          this.activeProfileId = p.id;
          this.player = p;
          this.saveState();
        }
      }

      if (!this.player.completedMemoryLevels) this.player.completedMemoryLevels = [];
      if (!this.player.discoveredWords) this.player.discoveredWords = [];
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }

  saveState() {
    try {
      if (!this.player || !this.player.name || this.player.name === 'زائر' || this.player.isGuest) {
        // Do not save progress for guest
        return;
      }
      if (this.player && this.player.id) {
        const idx = this.profiles.findIndex(p => p.id === this.player.id);
        if (idx !== -1) {
          this.profiles[idx] = { ...this.player };
        } else {
          this.profiles.push({ ...this.player });
        }
      }
      const data = {
        activeProfileId: this.activeProfileId,
        profiles: this.profiles
      };
      localStorage.setItem('rehlat_bayt_allah_data_v2', JSON.stringify(data));
      if (this.player) {
        localStorage.setItem('rehlat_bayt_allah_data', JSON.stringify(this.player));
      }
    } catch (e) {
      console.warn("Save error:", e);
    }
  }

  createProfile(name, avatar) {
    const isGuest = !name || name.trim() === '' || name === 'زائر';
    const newP = {
      id: isGuest ? "p_guest" : "p_" + Date.now(),
      name: isGuest ? "زائر" : name.trim(),
      avatar: avatar || 'boy',
      hasanat: 0,
      currentLevelId: 1,
      completedLevels: [],
      completedMemoryLevels: [],
      completedStoryLevels: [],
      discoveredWords: [],
      discoveredProphets: [],
      soundEnabled: true,
      isGuest: isGuest
    };

    if (!isGuest) {
      this.profiles.push(newP);
      this.activeProfileId = newP.id;
      this.player = newP;
      this.saveState();
    } else {
      this.activeProfileId = "p_guest";
      this.player = newP;
    }
    this.updateUI();
  }

  switchProfile(profileId) {
    const target = this.profiles.find(p => p.id === profileId);
    if (target) {
      this.activeProfileId = target.id;
      this.player = target;
      if (!this.player.completedMemoryLevels) this.player.completedMemoryLevels = [];
      if (!this.player.discoveredWords) this.player.discoveredWords = [];
      this.saveState();
      this.updateUI();
      this.switchScreen('screen-hub');
    }
  }

  deleteProfile(profileId) {
    this.profiles = this.profiles.filter(p => p.id !== profileId);
    if (this.profiles.length > 0) {
      if (this.activeProfileId === profileId) {
        this.activeProfileId = this.profiles[0].id;
        this.player = this.profiles[0];
      }
      this.saveState();
      this.renderProfilesModal();
      this.updateUI();
      this.switchScreen('screen-hub');
    } else {
      this.resetAllData();
    }
  }

  resetAllData() {
    localStorage.removeItem('rehlat_bayt_allah_data');
    localStorage.removeItem('rehlat_bayt_allah_data_v2');
    this.profiles = [];
    this.activeProfileId = null;
    this.player = {
      id: "p_" + Date.now(),
      name: "زائر",
      avatar: "boy",
      hasanat: 0,
      currentLevelId: 1,
      completedLevels: [],
      completedMemoryLevels: [],
      discoveredWords: [],
      soundEnabled: true
    };

    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

    const inputName = document.getElementById('input-child-name');
    if (inputName) inputName.value = '';
    const returningBox = document.getElementById('welcome-returning-box');
    const newForm = document.getElementById('welcome-new-user-form');
    if (returningBox) returningBox.style.display = 'none';
    if (newForm) newForm.style.display = 'block';

    this.updateUI();
    this.switchScreen('screen-welcome');
  }

  addHasanat(amount) {
    this.player.hasanat += amount;
    this.saveState();
    this.updateUI();
  }

  completeLevel(levelId) {
    if (!this.player.completedLevels.includes(levelId)) {
      this.player.completedLevels.push(levelId);
      const lvl = GAME_LEVELS.find(l => l.id === levelId);
      if (lvl) {
        this.addHasanat(lvl.hasanat);
      }
    }
    this.saveState();
    this.showSuccessModal(levelId);
  }

  completeMemoryLevel(levelNum, stars, moves) {
    if (!this.player.completedMemoryLevels) this.player.completedMemoryLevels = [];
    if (!this.player.completedMemoryLevels.includes(levelNum)) {
      this.player.completedMemoryLevels.push(levelNum);
    }
    const lvl = MEMORY_LEVELS_DATA[levelNum];
    const earned = lvl.hasanat + (stars * 10);
    this.addHasanat(earned);
    this.saveState();

    sfx.playFanfare();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }

    const modal = document.getElementById('modal-success');
    const title = document.getElementById('success-title');
    const desc = document.getElementById('success-desc');
    const rewardVal = document.getElementById('success-stars');
    const stampName = document.getElementById('success-stamp-name');

    if (title) title.innerText = `ما شاء الله يا ${this.player.name}! 🌟`;
    if (desc) desc.innerText = `أتممت ${lvl.title} في ${moves} محاولة وحصلت على ${stars} نجوم!`;
    if (rewardVal) rewardVal.innerText = `+${earned} حسنة`;
    if (stampName) stampName.innerText = `🎴 كنز كلمات القرآن`;

    if (modal) modal.classList.add('active');

    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) {
      if (levelNum < 3) {
        nextBtn.querySelector('span').innerText = "المستوى التالي ➔";
        nextBtn.onclick = () => {
          modal.classList.remove('active');
          memoryEngine.startLevel(levelNum + 1);
        };
      } else {
        nextBtn.querySelector('span').innerText = "📜 استلم شهادة حافظ القرآن";
        nextBtn.onclick = () => {
          modal.classList.remove('active');
          this.showMemoryCertificate();
        };
      }
    }

    const backMapBtn = document.getElementById('btn-back-to-map');
    if (backMapBtn) {
      backMapBtn.onclick = () => {
        modal.classList.remove('active');
        this.switchScreen('screen-memory-levels');
      };
    }
  }

  completeStoryLevel(levelNum) {
    if (!this.player.completedStoryLevels) this.player.completedStoryLevels = [];
    if (!this.player.completedStoryLevels.includes(levelNum)) {
      this.player.completedStoryLevels.push(levelNum);
    }
    const lvl = STORY_BLOCKS_DATA[levelNum];
    const earned = lvl.hasanat;
    this.addHasanat(earned);
    this.saveState();

    sfx.playFanfare();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }

    const modal = document.getElementById('modal-success');
    const title = document.getElementById('success-title');
    const desc = document.getElementById('success-desc');
    const rewardVal = document.getElementById('success-stars');
    const stampName = document.getElementById('success-stamp-name');

    if (title) title.innerText = `ما شاء الله يا ${this.player.name}! 👑`;
    if (desc) desc.innerText = `أتممت ${lvl.title} وتعرفت على أنوار ومعجزات الأنبياء ببراعة!`;
    if (rewardVal) rewardVal.innerText = `+${earned} حسنة`;
    if (stampName) stampName.innerText = `✨ وسام راوي المعجزات`;

    if (modal) modal.classList.add('active');

    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) {
      if (levelNum < 3) {
        nextBtn.querySelector('span').innerText = "المستوى التالي ➔";
        nextBtn.onclick = () => {
          modal.classList.remove('active');
          storyEngine.startLevel(levelNum + 1);
        };
      } else {
        nextBtn.querySelector('span').innerText = "📜 استلم شهادة راوي المعجزات";
        nextBtn.onclick = () => {
          modal.classList.remove('active');
          this.showStoryCertificate();
        };
      }
    }

    const backMapBtn = document.getElementById('btn-back-to-map');
    if (backMapBtn) {
      backMapBtn.onclick = () => {
        modal.classList.remove('active');
        this.switchScreen('screen-story-levels');
      };
    }
  }

  completeConquestLevel(levelNum) {
    if (!this.player.completedConquestLevels) this.player.completedConquestLevels = [];
    if (!this.player.completedConquestLevels.includes(levelNum)) {
      this.player.completedConquestLevels.push(levelNum);
    }
    const lvl = CONQUEST_CAMPAIGNS_DATA[levelNum];
    const earned = lvl.hasanat;
    this.addHasanat(earned);
    this.saveState();

    sfx.playFanfare();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.6 } });
    }

    const modal = document.getElementById('modal-success');
    const title = document.getElementById('success-title');
    const desc = document.getElementById('success-desc');
    const rewardVal = document.getElementById('success-stars');
    const stampName = document.getElementById('success-stamp-name');

    if (title) title.innerText = `فتح مبارك يا ${this.player.name}! 🚩`;
    if (desc) desc.innerText = `أتممت ${lvl.title} ووجهت أبطال وسفراء الإسلام ببراعة تاريخية!`;
    if (rewardVal) rewardVal.innerText = `+${earned} حسنة`;
    if (stampName) stampName.innerText = `🗺️ وسام الفاتح الصغير`;

    if (modal) modal.classList.add('active');

    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) {
      if (levelNum < 3) {
        nextBtn.querySelector('span').innerText = "الحملة التالية ➔";
        nextBtn.onclick = () => {
          modal.classList.remove('active');
          conquestEngine.startLevel(levelNum + 1);
        };
      } else {
        nextBtn.querySelector('span').innerText = "📜 استلم شهادة فاتح بلاد الإسلام";
        nextBtn.onclick = () => {
          modal.classList.remove('active');
          this.showConquestCertificate();
        };
      }
    }

    const backMapBtn = document.getElementById('btn-back-to-map');
    if (backMapBtn) {
      backMapBtn.onclick = () => {
        modal.classList.remove('active');
        this.switchScreen('screen-conquest-levels');
      };
    }
  }

  updateUI() {
    const hasanatElem = document.getElementById('hasanat-val');
    if (hasanatElem) hasanatElem.innerText = this.player.hasanat;

    const miniBadge = document.getElementById('player-profile-badge');
    const miniName = document.getElementById('mini-name');
    const miniAvatar = document.getElementById('mini-avatar');

    if (miniBadge) miniBadge.style.display = 'flex';
    if (miniName) miniName.innerText = (this.player && this.player.name) ? this.player.name : 'زائر';
    if (miniAvatar) miniAvatar.innerText = (this.player && this.player.avatar === 'girl') ? '👧' : '👦';

    const badgeDot = document.getElementById('passport-badge-dot');
    if (badgeDot) {
      if (this.player.completedLevels.length > 0) badgeDot.classList.add('show');
      else badgeDot.classList.remove('show');
    }

    const returningBox = document.getElementById('welcome-returning-box');
    const newForm = document.getElementById('welcome-new-user-form');
    const retName = document.getElementById('welcome-return-name');
    const retHasanat = document.getElementById('welcome-return-hasanat');
    const retAvatar = document.getElementById('welcome-return-avatar');
    const inputName = document.getElementById('input-child-name');

    if (this.player.name && (this.player.completedLevels.length > 0 || this.player.hasanat > 0)) {
      if (returningBox) returningBox.style.display = 'block';
      if (newForm) newForm.style.display = 'none';
      if (retName) retName.innerText = this.player.name;
      if (retHasanat) retHasanat.innerText = this.player.hasanat;
      if (retAvatar) retAvatar.innerText = this.player.avatar === 'boy' ? '👦' : '👧';
      if (inputName) inputName.value = this.player.name;
    } else {
      if (returningBox) returningBox.style.display = 'none';
      if (newForm) newForm.style.display = 'block';
    }
  }

  switchScreen(screenId) {
    this.activeScreen = screenId;
    document.querySelectorAll('.screen-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }
    if (screenId === 'screen-memory-levels') {
      this.renderMemoryLevelsScreen();
    } else if (screenId === 'screen-story-levels') {
      this.renderStoryLevelsScreen();
    } else if (screenId === 'screen-conquest-levels') {
      this.renderConquestLevelsScreen();
    }
    this.updateUI();
  }

  renderConquestLevelsScreen() {
    const list = document.getElementById('conquest-levels-list');
    if (!list) return;
    list.innerHTML = '';

    const completed = this.player.completedConquestLevels || [];

    [1, 2, 3].forEach(lvlNum => {
      const lvlData = CONQUEST_CAMPAIGNS_DATA[lvlNum];
      const isDone = completed.includes(lvlNum);
      const isUnlocked = lvlNum === 1 || completed.includes(lvlNum - 1);
      const isCurrent = isUnlocked && !isDone;

      const card = document.createElement('div');
      card.className = `memory-lvl-card ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
      
      let starsIcon = '🚩';
      if (lvlNum === 2) starsIcon = '🚩🚩';
      if (lvlNum === 3) starsIcon = '👑🚩';

      let statusBadge = '';
      if (isDone) {
        statusBadge = `<div class="lvl-completed-badge" style="background:#ecfdf5; color:#047857; border-color:#6ee7b7;">✅ مكتمل (${lvlData.heroes.length} أبطال وسفراء)</div>`;
      } else if (!isUnlocked) {
        statusBadge = `<div style="font-size:0.75rem; color:#94a3b8; font-weight:700;">🔒 أكمل الحملة السابقة لفتحها</div>`;
      } else {
        statusBadge = `<div style="font-size:0.75rem; color:#059669; font-weight:800;">▶️ متاح للعب الآن</div>`;
      }

      card.innerHTML = `
        <div class="lvl-star-icon">${starsIcon}</div>
        <h3 style="color:#047857;">${lvlData.title}</h3>
        <p>${lvlData.desc} - ${lvlData.heroes.length} مهام تاريخية</p>
        <span class="lvl-reward" style="background:#ecfdf5; color:#065f46;">+${lvlData.hasanat} حسنة ⭐</span>
        ${statusBadge}
        <button class="btn-primary-big" style="padding:10px; margin-top:4px; background:linear-gradient(180deg, #059669, #047857); border-bottom-color:#064e3b;" ${!isUnlocked ? 'disabled' : ''}>
          <span>${isDone ? '🔄 إعادة الحملة' : 'ابدأ الحملة ➔'}</span>
        </button>
      `;

      if (isUnlocked) {
        card.onclick = () => {
          sfx.playPop();
          conquestEngine.startLevel(lvlNum);
        };
      }

      list.appendChild(card);
    });

    const certBtn = document.getElementById('btn-view-conquest-certificate');
    if (certBtn) {
      certBtn.style.display = (completed.length >= 3) ? 'flex' : 'none';
    }
  }

  showConquestCertificate() {
    if (this.checkGuestCertificate("شهادة فاتح بلاد الإسلام")) return;

    const modal = document.getElementById('modal-conquest-certificate');
    const nameElem = document.getElementById('conquest-cert-name');
    const hasanatElem = document.getElementById('conquest-cert-hasanat');
    const dateElem = document.getElementById('conquest-cert-date-val');

    if (nameElem) nameElem.innerText = `${this.player.avatar === 'boy' ? 'البطل الفاتح' : 'البطلة الفاتحة'} ${this.player.name}`;
    if (hasanatElem) hasanatElem.innerText = this.player.hasanat;
    if (dateElem) {
      const today = new Date();
      dateElem.innerText = today.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (modal) modal.classList.add('active');
  }

  renderStoryLevelsScreen() {
    const list = document.getElementById('story-levels-list');
    if (!list) return;
    list.innerHTML = '';

    const completed = this.player.completedStoryLevels || [];

    [1, 2, 3].forEach(lvlNum => {
      const lvlData = STORY_BLOCKS_DATA[lvlNum];
      const isDone = completed.includes(lvlNum);
      const isUnlocked = lvlNum === 1 || completed.includes(lvlNum - 1);
      const isCurrent = isUnlocked && !isDone;

      const card = document.createElement('div');
      card.className = `memory-lvl-card ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
      
      let starsIcon = '✨';
      if (lvlNum === 2) starsIcon = '✨✨';
      if (lvlNum === 3) starsIcon = '👑✨';

      let statusBadge = '';
      if (isDone) {
        statusBadge = `<div class="lvl-completed-badge">✅ مكتمل (${lvlData.stories.length} معجزات وقصص)</div>`;
      } else if (!isUnlocked) {
        statusBadge = `<div style="font-size:0.75rem; color:#94a3b8; font-weight:700;">🔒 أكمل المستوى السابق لفتحه</div>`;
      } else {
        statusBadge = `<div style="font-size:0.75rem; color:#d97706; font-weight:800;">▶️ متاح للعب الآن</div>`;
      }

      card.innerHTML = `
        <div class="lvl-star-icon">${starsIcon}</div>
        <h3 style="color:#b45309;">${lvlData.title}</h3>
        <p>${lvlData.desc} - ${lvlData.stories.length} قصص تفاعلية</p>
        <span class="lvl-reward" style="background:#fef3c7; color:#92400e;">+${lvlData.hasanat} حسنة ⭐</span>
        ${statusBadge}
        <button class="btn-primary-big" style="padding:10px; margin-top:4px; background:linear-gradient(180deg, #d97706, #b45309); border-bottom-color:#78350f;" ${!isUnlocked ? 'disabled' : ''}>
          <span>${isDone ? '🔄 إعادة التحدي' : 'ابدأ المستوى ➔'}</span>
        </button>
      `;

      if (isUnlocked) {
        card.onclick = () => {
          sfx.playPop();
          storyEngine.startLevel(lvlNum);
        };
      }

      list.appendChild(card);
    });

    const certBtn = document.getElementById('btn-view-story-certificate');
    if (certBtn) {
      certBtn.style.display = (completed.length >= 3) ? 'flex' : 'none';
    }
  }

  checkGuestCertificate(certTitle) {
    if (!this.player || !this.player.name || this.player.name === 'زائر' || this.player.isGuest) {
      sfx.playWrong();
      showCustomConfirm(
        "تنبيه الشهادة للبطل 📜",
        `أنت تلعب الآن كـ (زائر) 👤!\nللحصول على ${certTitle} وتوثيق اسمك ووسامك، يرجى تسجيل اسم بطلك أولاً.`,
        "👤",
        "تسجيل اسمي الآن ✏️",
        "إغلاق ❌",
        () => {
          this.switchScreen('screen-welcome');
          setTimeout(() => {
            const input = document.getElementById('input-child-name');
            if (input) input.focus();
          }, 250);
        }
      );
      return true;
    }
    return false;
  }

  showStoryCertificate() {
    if (this.checkGuestCertificate("شهادة راوي معجزات الأنبياء")) return;

    const modal = document.getElementById('modal-story-certificate');
    const nameElem = document.getElementById('story-cert-name');
    const hasanatElem = document.getElementById('story-cert-hasanat');
    const dateElem = document.getElementById('story-cert-date-val');

    if (nameElem) nameElem.innerText = `${this.player.avatar === 'boy' ? 'البطل الراوي' : 'البطلة الراوية'} ${this.player.name}`;
    if (hasanatElem) hasanatElem.innerText = this.player.hasanat;
    if (dateElem) {
      const today = new Date();
      dateElem.innerText = today.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (modal) modal.classList.add('active');
  }

  renderMemoryLevelsScreen() {
    const list = document.getElementById('memory-levels-list');
    if (!list) return;
    list.innerHTML = '';

    const completed = this.player.completedMemoryLevels || [];

    [1, 2, 3].forEach(lvlNum => {
      const lvlData = MEMORY_LEVELS_DATA[lvlNum];
      const isDone = completed.includes(lvlNum);
      const isUnlocked = lvlNum === 1 || completed.includes(lvlNum - 1);
      const isCurrent = isUnlocked && !isDone;

      const card = document.createElement('div');
      card.className = `memory-lvl-card ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
      
      let starsIcon = '⭐';
      if (lvlNum === 2) starsIcon = '⭐⭐';
      if (lvlNum === 3) starsIcon = '⭐⭐⭐';

      let statusBadge = '';
      if (isDone) {
        statusBadge = `<div class="lvl-completed-badge">✅ مكتمل (${lvlData.pairs.length} أزواج)</div>`;
      } else if (!isUnlocked) {
        statusBadge = `<div style="font-size:0.75rem; color:#94a3b8; font-weight:700;">🔒 أكمل المستوى السابق لفتحه</div>`;
      } else {
        statusBadge = `<div style="font-size:0.75rem; color:#8b5cf6; font-weight:800;">▶️ متاح للعب الآن</div>`;
      }

      card.innerHTML = `
        <div class="lvl-star-icon">${starsIcon}</div>
        <h3>${lvlData.title}</h3>
        <p>${lvlData.pairs.length * 2} بطاقة (${lvlData.pairs.length} أزواج قرآنية)</p>
        <span class="lvl-reward">+${lvlData.hasanat} حسنة ⭐</span>
        ${statusBadge}
        <button class="btn-primary-big" style="padding:10px; margin-top:4px;" ${!isUnlocked ? 'disabled' : ''}>
          <span>${isDone ? '🔄 إعادة اللعب' : 'ابدأ المستوى ➔'}</span>
        </button>
      `;

      if (isUnlocked) {
        card.onclick = () => {
          sfx.playPop();
          memoryEngine.startLevel(lvlNum);
        };
      }

      list.appendChild(card);
    });

    const certBtn = document.getElementById('btn-view-memory-certificate');
    if (certBtn) {
      certBtn.style.display = (completed.length >= 3) ? 'flex' : 'none';
    }
  }

  showMemoryCertificate() {
    if (this.checkGuestCertificate("شهادة حافظ كلمات القرآن")) return;

    const modal = document.getElementById('modal-memory-certificate');
    const nameElem = document.getElementById('mem-cert-name');
    const hasanatElem = document.getElementById('mem-cert-hasanat');
    const dateElem = document.getElementById('mem-cert-date-val');

    if (nameElem) nameElem.innerText = `${this.player.avatar === 'boy' ? 'البطل الحافظ' : 'البطلة الحافظة'} ${this.player.name}`;
    if (hasanatElem) hasanatElem.innerText = this.player.hasanat;
    if (dateElem) {
      const today = new Date();
      dateElem.innerText = today.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (modal) modal.classList.add('active');
  }

  renderMap() {
    const mapList = document.getElementById('map-levels-list');
    if (!mapList) return;
    mapList.innerHTML = '';

    GAME_LEVELS.forEach((level) => {
      const isCompleted = this.player.completedLevels.includes(level.id);
      const isUnlocked = level.id === 1 || this.player.completedLevels.includes(level.id - 1);
      const isCurrent = isUnlocked && !isCompleted;

      const item = document.createElement('div');
      item.className = `map-level-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;

      let statusIcon = '🔒';
      if (isCompleted) statusIcon = '✅';
      else if (isCurrent) statusIcon = '▶️';

      item.innerHTML = `
        <div class="level-num-badge">${level.id}</div>
        <div class="level-info-content">
          <span class="fiqh-pill-tag ${level.fiqhCategory}">${level.fiqhTag}</span>
          <div class="level-title-text">${level.title}</div>
          <div class="level-desc-text">${level.desc}</div>
        </div>
        <div class="level-status-icon">${statusIcon}</div>
      `;

      if (isUnlocked) {
        item.onclick = () => {
          sfx.playPop();
          this.startStage(level.id);
        };
      }

      mapList.appendChild(item);
    });

    const certBtn = document.getElementById('btn-view-certificate');
    if (certBtn) {
      certBtn.style.display = (this.player.completedLevels.length >= 9) ? 'flex' : 'none';
    }
  }

  startStage(levelId) {
    this.player.currentLevelId = levelId;
    this.switchScreen('screen-stage');
    const container = document.getElementById('stage-dynamic-content');
    if (!container) return;

    container.innerHTML = '';
    
    switch (levelId) {
      case 1: Stage1_Packing(container, this); break;
      case 2: Stage2_Miqat(container, this); break;
      case 3: Stage3_Tawaf(container, this); break;
      case 4: Stage4_Sai(container, this); break;
      case 5: Stage5_Mina(container, this); break;
      case 6: Stage6_Arafat(container, this); break;
      case 7: Stage7_Muzdalifah(container, this); break;
      case 8: Stage8_Jamarat(container, this); break;
      case 9: Stage9_Farewell(container, this); break;
      default:
        container.innerHTML = `<p>المحطة قادمة قريباً...</p>`;
    }
  }

  showSuccessModal(levelId) {
    sfx.playFanfare();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }

    const level = GAME_LEVELS.find(l => l.id === levelId);
    const modal = document.getElementById('modal-success');
    const title = document.getElementById('success-title');
    const desc = document.getElementById('success-desc');
    const stars = document.getElementById('success-stars');
    const stampName = document.getElementById('success-stamp-name');

    if (title) title.innerText = `أحسنت يا ${this.player.name}! 🌟`;
    if (desc) desc.innerText = `أتممت محطة "${level.title}" بنجاح وحصلت على الختم في جواز سفرك!`;
    if (stars) stars.innerText = `+${level.hasanat} حسنة`;
    if (stampName) stampName.innerText = `${level.stampIcon} ${level.stampName}`;

    if (modal) modal.classList.add('active');

    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) {
      nextBtn.onclick = () => {
        modal.classList.remove('active');
        if (levelId < 9) {
          this.startStage(levelId + 1);
        } else {
          this.showCertificate();
        }
      };
    }

    const backMapBtn = document.getElementById('btn-back-to-map');
    if (backMapBtn) {
      backMapBtn.onclick = () => {
        modal.classList.remove('active');
        this.renderMap();
        this.switchScreen('screen-map');
      };
    }
  }

  renderPassport() {
    const avatarView = document.getElementById('passport-avatar-view');
    const nameView = document.getElementById('passport-name-view');
    const hasanatView = document.getElementById('passport-hasanat-view');
    const progressView = document.getElementById('passport-progress-view');
    const quranCountView = document.getElementById('passport-quran-count-view');
    const storyCountView = document.getElementById('passport-story-count-view');
    const conquestCountView = document.getElementById('passport-conquest-count-view');

    const badgeHajj = document.getElementById('badge-hajj-count');
    const badgeQuran = document.getElementById('badge-quran-count');
    const badgeProphets = document.getElementById('badge-prophets-count');
    const badgeConquests = document.getElementById('badge-conquest-count');

    const hajjCompleted = this.player.completedLevels ? this.player.completedLevels.length : 0;
    const quranDiscovered = this.player.discoveredWords ? this.player.discoveredWords.length : 0;
    const prophetsDiscovered = this.player.discoveredProphets ? this.player.discoveredProphets.length : 0;
    const conquestsDiscovered = this.player.discoveredConquests ? this.player.discoveredConquests.length : 0;

    if (avatarView) avatarView.innerText = this.player.avatar === 'boy' ? '👦' : '👧';
    if (nameView) nameView.innerText = this.player.name || 'البطل المسلم';
    if (hasanatView) hasanatView.innerText = this.player.hasanat;
    if (progressView) progressView.innerText = `${hajjCompleted} / 9`;
    if (quranCountView) quranCountView.innerText = `${quranDiscovered} / 18`;
    if (storyCountView) storyCountView.innerText = `${prophetsDiscovered} / 12`;
    if (conquestCountView) conquestCountView.innerText = `${conquestsDiscovered} / 12`;

    if (badgeHajj) badgeHajj.innerText = `${hajjCompleted} / 9`;
    if (badgeQuran) badgeQuran.innerText = `${quranDiscovered} / 18`;
    if (badgeProphets) badgeProphets.innerText = `${prophetsDiscovered} / 12`;
    if (badgeConquests) badgeConquests.innerText = `${conquestsDiscovered} / 12`;

    // 1. Render Hajj Stamps
    const stampsGrid = document.getElementById('passport-stamps-container');
    if (stampsGrid) {
      stampsGrid.innerHTML = '';
      GAME_LEVELS.forEach(lvl => {
        const isDone = this.player.completedLevels.includes(lvl.id);
        const box = document.createElement('div');
        box.className = `stamp-box ${isDone ? 'unlocked' : ''}`;
        box.innerHTML = `
          <div class="stamp-icon">${lvl.stampIcon}</div>
          <div class="stamp-name">${lvl.stampName}</div>
        `;
        stampsGrid.appendChild(box);
      });
    }

    // 2. Render Quran Dictionary / Album
    this.renderQuranAlbum();

    // 3. Render Prophets Miracles Archive
    const prophetsContainer = document.getElementById('prophets-cards-container');
    if (prophetsContainer) {
      prophetsContainer.innerHTML = '';
      const discProphets = this.player.discoveredProphets || [];
      let allStories = [];
      Object.values(STORY_BLOCKS_DATA).forEach(lvl => {
        allStories = allStories.concat(lvl.stories);
      });

      allStories.forEach(st => {
        const isFound = discProphets.includes(st.id);
        const card = document.createElement('div');
        card.className = `prophet-archive-card ${isFound ? 'unlocked' : ''}`;
        if (isFound) {
          card.innerHTML = `
            <div class="p-icon">✨</div>
            <div class="p-name">${st.prophet}</div>
            <div class="p-miracles-icons">
              ${st.miracles.map(m => `<span>${m.icon}</span>`).join('')}
            </div>
          `;
        } else {
          card.style.opacity = '0.45';
          card.innerHTML = `
            <div class="p-icon">🔒</div>
            <div class="p-name">معجزة مقفلة</div>
            <div style="font-size:0.65rem; color:#94a3b8;">العب لعبة المعجزات</div>
          `;
        }
        prophetsContainer.appendChild(card);
      });
    }

    // 4. Render Conquests & Sahaba Heroes Archive
    const conquestsContainer = document.getElementById('conquest-cards-container');
    if (conquestsContainer) {
      conquestsContainer.innerHTML = '';
      const discConquests = this.player.discoveredConquests || [];
      let allHeroes = [];
      Object.values(CONQUEST_CAMPAIGNS_DATA).forEach(lvl => {
        allHeroes = allHeroes.concat(lvl.heroes);
      });

      allHeroes.forEach(h => {
        const isFound = discConquests.includes(h.id);
        const card = document.createElement('div');
        card.className = `prophet-archive-card ${isFound ? 'unlocked' : ''}`;
        if (isFound) {
          card.style.borderColor = '#10b981';
          card.innerHTML = `
            <div class="p-icon" style="background:#ecfdf5;">${h.icon}</div>
            <div class="p-name" style="color:#047857;">${h.name}</div>
            <div style="font-size:0.75rem; color:#065f46; font-weight:700;">${h.title}</div>
          `;
        } else {
          card.style.opacity = '0.45';
          card.innerHTML = `
            <div class="p-icon">🔒</div>
            <div class="p-name">بطل مقفل</div>
            <div style="font-size:0.65rem; color:#94a3b8;">العب خريطة الفتوحات</div>
          `;
        }
        conquestsContainer.appendChild(card);
      });
    }

    // 5. Render Profiles list in unified modal
    this.renderProfilesModal();
  }

  renderProfilesModal() {
    const container = document.getElementById('profiles-list-view');
    if (!container) return;
    container.innerHTML = '';

    if (this.profiles.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#64748b; padding:10px;">لا يوجد أبطال مسجلين حالياً</p>`;
      return;
    }

    this.profiles.forEach(p => {
      const isActive = p.id === this.activeProfileId;
      const card = document.createElement('div');
      card.className = `profile-item-card ${isActive ? 'active-profile' : ''}`;
      card.innerHTML = `
        <div class="profile-avatar-icon">${p.avatar === 'boy' ? '👦' : '👧'}</div>
        <div class="profile-info">
          <div class="profile-name">${p.name} ${isActive ? '<span style="color:#047857;">(الحالي ⭐)</span>' : ''}</div>
          <div class="profile-meta">${p.hasanat} حسنة • ${p.completedLevels.length}/9 حج • ${(p.discoveredWords || []).length}/18 قرآن • ${(p.discoveredProphets || []).length}/12 معجزات</div>
        </div>
        <button class="profile-delete-btn" title="حذف هذا البطل">🗑️</button>
      `;

      card.onclick = (e) => {
        if (e.target.closest('.profile-delete-btn')) return;
        sfx.playPop();
        this.switchProfile(p.id);
        const modalProfiles = document.getElementById('modal-profiles');
        const modalPassport = document.getElementById('modal-passport');
        if (modalProfiles) modalProfiles.classList.remove('active');
        if (modalPassport) modalPassport.classList.remove('active');
      };

      const delBtn = card.querySelector('.profile-delete-btn');
      if (delBtn) {
        delBtn.onclick = (e) => {
          e.stopPropagation();
          showCustomConfirm(
            "حذف البطل 🗑️",
            `هل تريد بالتأكيد حذف البطل "${p.name}" وجميع حسناته؟`,
            "🗑️",
            "نعم، احذف البطل",
            "إلغاء ❌",
            () => {
              sfx.playWrong();
              this.deleteProfile(p.id);
            }
          );
        };
      }

      container.appendChild(card);
    });
  }

  renderQuranAlbum() {
    const container = document.getElementById('album-cards-container');
    if (!container) return;
    container.innerHTML = '';

    const discovered = this.player.discoveredWords || [];
    let allPairs = [];
    Object.values(MEMORY_LEVELS_DATA).forEach(lvl => {
      allPairs = allPairs.concat(lvl.pairs);
    });

    allPairs.forEach(p => {
      const isFound = discovered.includes(p.id);
      const item = document.createElement('div');
      item.className = 'album-card-item';
      if (isFound) {
        item.style.borderColor = '#10b981';
        item.style.background = '#ecfdf5';
        item.innerHTML = `
          <div style="font-size:1.4rem;">${p.emoji}</div>
          <div class="album-word">${p.word}</div>
          <div class="album-meaning">${p.meaning}</div>
        `;
      } else {
        item.style.opacity = '0.5';
        item.innerHTML = `
          <div style="font-size:1.4rem;">🔒</div>
          <div class="album-word">؟؟؟</div>
          <div class="album-meaning">العب لعبة الذاكرة لاكتشافها</div>
        `;
      }
      container.appendChild(item);
    });
  }

  showCertificate() {
    if (this.checkGuestCertificate("شهادة الحاج الصغير")) return;

    const modal = document.getElementById('modal-certificate');
    const nameElem = document.getElementById('cert-name');
    const hasanatElem = document.getElementById('cert-hasanat');
    const dateElem = document.getElementById('cert-date-val');

    if (nameElem) nameElem.innerText = `${this.player.avatar === 'boy' ? 'البطل الحاج' : 'البطلة الحاجة'} ${this.player.name}`;
    if (hasanatElem) hasanatElem.innerText = this.player.hasanat;
    if (dateElem) {
      const today = new Date();
      dateElem.innerText = today.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (modal) modal.classList.add('active');
  }
}

const game = new GameManager();

// ==========================================================
// MEMORY GAME ENGINE (آية ومعنى)
// ==========================================================
class MemoryGameEngine {
  constructor() {
    this.currentLevel = 1;
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairsCount = 0;
    this.totalPairs = 0;
    this.moves = 0;
    this.timerInterval = null;
    this.timeLeft = 60;
    this.totalTime = 60;
    this.isLocked = false;
  }

  startLevel(lvlNum) {
    this.currentLevel = lvlNum;
    const lvlData = MEMORY_LEVELS_DATA[lvlNum];
    if (!lvlData) return;

    this.matchedPairsCount = 0;
    this.totalPairs = lvlData.pairs.length;
    this.moves = 0;
    this.timeLeft = lvlData.timeLimit;
    this.totalTime = lvlData.timeLimit;
    this.flippedCards = [];
    this.isLocked = false;

    game.switchScreen('screen-memory-game');
    this.updateStatsUI();

    // Prepare deck: duplicate each pair into (Word card) and (Meaning card)
    let deck = [];
    lvlData.pairs.forEach(pair => {
      deck.push({
        pairId: pair.id,
        type: 'word',
        text: pair.word,
        meaningText: pair.meaning,
        emoji: pair.emoji
      });
      deck.push({
        pairId: pair.id,
        type: 'meaning',
        text: pair.meaning,
        wordText: pair.word,
        emoji: pair.emoji
      });
    });

    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);
    this.cards = deck;

    this.renderBoard(lvlData.gridClass);
    this.startSandTimer();
  }

  renderBoard(gridClass) {
    const board = document.getElementById('memory-cards-board');
    if (!board) return;

    board.className = `memory-cards-grid ${gridClass}`;
    board.innerHTML = '';

    const banner = document.getElementById('mem-match-banner');
    if (banner) banner.style.display = 'none';

    this.cards.forEach((card, index) => {
      const cardWrap = document.createElement('div');
      cardWrap.className = 'mem-card-wrapper';
      cardWrap.dataset.index = index;

      cardWrap.innerHTML = `
        <div class="mem-card-inner">
          <div class="mem-card-front">
            <span class="card-pattern-icon">📖</span>
            <span class="card-back-hint">آية ومعنى</span>
          </div>
          <div class="mem-card-back">
            <span class="card-item-type ${card.type === 'word' ? 'type-word' : 'type-meaning'}">
              ${card.type === 'word' ? 'الكلمة القرآنية' : 'المعنى'}
            </span>
            <div class="card-item-text">${card.text}</div>
            <div class="card-item-emoji">${card.emoji}</div>
          </div>
        </div>
      `;

      cardWrap.onclick = () => this.handleCardClick(index, cardWrap);
      board.appendChild(cardWrap);
    });
  }

  handleCardClick(index, cardWrap) {
    if (this.isLocked) return;
    if (cardWrap.classList.contains('flipped') || cardWrap.classList.contains('matched')) return;

    sfx.playFlip();
    cardWrap.classList.add('flipped');
    this.flippedCards.push({ index, card: this.cards[index], elem: cardWrap });

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateStatsUI();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [first, second] = this.flippedCards;

    if (first.card.pairId === second.card.pairId && first.card.type !== second.card.type) {
      // MATCH!
      sfx.playCorrect();
      first.elem.classList.add('matched');
      second.elem.classList.add('matched');

      showVisualFeedback(first.elem, "+15 ⭐ تطابق رائع!");
      showVisualFeedback(second.elem, "+15 ⭐");

      const wordStr = first.card.type === 'word' ? first.card.text : second.card.text;
      const meaningStr = first.card.type === 'word' ? first.card.meaningText : second.card.meaningText;
      const pairId = first.card.pairId;

      // Save discovered word to player
      if (!game.player.discoveredWords.includes(pairId)) {
        game.player.discoveredWords.push(pairId);
        game.saveState();
      }

      // Show match banner & speak
      const banner = document.getElementById('mem-match-banner');
      const textElem = document.getElementById('mem-match-text');
      if (banner && textElem) {
        textElem.innerText = `✨ ${wordStr}: ${meaningStr}`;
        banner.style.display = 'block';
      }

      this.matchedPairsCount++;
      this.flippedCards = [];
      this.isLocked = false;
      this.updateStatsUI();

      if (this.matchedPairsCount === this.totalPairs) {
        this.stopSandTimer();
        setTimeout(() => {
          let stars = 3;
          if (this.moves > this.totalPairs + 4) stars = 2;
          if (this.moves > this.totalPairs + 8) stars = 1;
          game.completeMemoryLevel(this.currentLevel, stars, this.moves);
        }, 800);
      }
    } else {
      // WRONG MATCH
      sfx.playWrong();
      setTimeout(() => {
        first.elem.classList.remove('flipped');
        second.elem.classList.remove('flipped');
        this.flippedCards = [];
        this.isLocked = false;
      }, 900);
    }
  }

  startSandTimer() {
    this.stopSandTimer();
    const timeElem = document.getElementById('mem-time-left');
    const topSand = document.getElementById('sand-top-sand');
    const bottomSand = document.getElementById('sand-bottom-sand');

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (timeElem) timeElem.innerText = `${this.timeLeft}s`;

      const progress = (this.totalTime - this.timeLeft) / this.totalTime;
      if (topSand) topSand.style.height = `${Math.max(0, 50 - (progress * 50))}%`;
      if (bottomSand) bottomSand.style.height = `${Math.min(50, progress * 50)}%`;

      if (this.timeLeft <= 0) {
        this.stopSandTimer();
        sfx.playWrong();
        showCustomAlert(
          "انتهى الوقت المحدد! ⏳",
          "لا بأس يا بطل، بالصبر والتركيز ستفوز بالنجوم بإذن الله!",
          "⏱️",
          "إعادة المحاولة 🔄"
        );
        this.startLevel(this.currentLevel);
      }
    }, 1000);
  }

  stopSandTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateStatsUI() {
    const movesElem = document.getElementById('mem-moves-count');
    const pairsElem = document.getElementById('mem-pairs-count');
    if (movesElem) movesElem.innerText = this.moves;
    if (pairsElem) pairsElem.innerText = `${this.matchedPairsCount} / ${this.totalPairs}`;
  }
}

const memoryEngine = new MemoryGameEngine();

// ==========================================================
// STORY BLOCKS GAME ENGINE (المكعبات القرآنية)
// ==========================================================
class StoryBlocksEngine {
  constructor() {
    this.currentLevel = 1;
    this.currentStoryIndex = 0;
    this.stories = [];
    this.isRolling = false;
    this.currentStory = null;
    this.isAnswered = false;
  }

  startLevel(lvlNum) {
    this.currentLevel = lvlNum;
    this.currentStoryIndex = 0;
    const lvlData = STORY_BLOCKS_DATA[lvlNum];
    if (!lvlData) return;

    this.stories = [...lvlData.stories];
    game.switchScreen('screen-story-game');

    const titleIcon = document.getElementById('story-level-title-icon');
    const titleText = document.getElementById('story-level-title-text');
    if (titleIcon) titleIcon.innerText = lvlNum === 1 ? '✨' : (lvlNum === 2 ? '✨✨' : '👑✨');
    if (titleText) titleText.innerText = lvlData.title;

    this.loadStoryQuestion(this.currentStoryIndex);
  }

  loadStoryQuestion(index) {
    if (index >= this.stories.length) {
      game.completeStoryLevel(this.currentLevel);
      return;
    }

    this.currentStoryIndex = index;
    this.currentStory = this.stories[index];
    this.isAnswered = false;

    const curNum = document.getElementById('story-current-num');
    const totNum = document.getElementById('story-total-num');
    if (curNum) curNum.innerText = index + 1;
    if (totNum) totNum.innerText = this.stories.length;

    const dotsContainer = document.getElementById('story-dots-container');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      this.stories.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `story-dot ${i === index ? 'active' : ''} ${i < index ? 'done' : ''}`;
        dotsContainer.appendChild(dot);
      });
    }

    const qZone = document.getElementById('story-question-zone');
    const moralBanner = document.getElementById('story-moral-banner');
    const hintBox = document.getElementById('story-hint-box');
    const rollBtn = document.getElementById('btn-roll-story-dice');

    if (qZone) qZone.style.display = 'none';
    if (moralBanner) moralBanner.style.display = 'none';
    if (hintBox) hintBox.style.display = 'none';
    if (rollBtn) {
      rollBtn.style.display = 'flex';
      rollBtn.disabled = false;
      rollBtn.classList.add('pulse-anim');
    }

    const diceGrid = document.getElementById('active-dice-grid');
    if (diceGrid) {
      diceGrid.innerHTML = '';
      this.currentStory.miracles.forEach(() => {
        const block = document.createElement('div');
        block.className = 'miracle-card';
        block.innerHTML = `
          <div class="miracle-icon">✨</div>
          <div class="miracle-name">نور القصة</div>
        `;
        diceGrid.appendChild(block);
      });
    }
  }

  rollDice() {
    if (this.isRolling || !this.currentStory) return;
    this.isRolling = true;

    const rollBtn = document.getElementById('btn-roll-story-dice');
    if (rollBtn) {
      rollBtn.disabled = true;
      rollBtn.classList.remove('pulse-anim');
    }

    sfx.playTone(300, 'triangle', 0.1, 0.1);
    setTimeout(() => sfx.playTone(450, 'triangle', 0.1, 0.1), 100);
    setTimeout(() => sfx.playTone(600, 'triangle', 0.15, 0.15), 200);

    const diceGrid = document.getElementById('active-dice-grid');
    if (diceGrid) {
      diceGrid.innerHTML = '';
      this.currentStory.miracles.forEach((d) => {
        const block = document.createElement('div');
        block.className = 'miracle-card rolling';
        block.innerHTML = `
          <div class="miracle-icon">${d.icon}</div>
          <div class="miracle-name">${d.name}</div>
        `;
        diceGrid.appendChild(block);
      });
    }

    setTimeout(() => {
      this.isRolling = false;
      if (rollBtn) rollBtn.style.display = 'none';
      this.showQuestionZone();
    }, 750);
  }

  showQuestionZone() {
    const qZone = document.getElementById('story-question-zone');
    const choicesContainer = document.getElementById('story-choices-container');
    const hintBox = document.getElementById('story-hint-box');
    const hintBtn = document.getElementById('btn-story-hint');

    if (qZone) qZone.style.display = 'block';
    if (hintBox) hintBox.style.display = 'none';

    if (hintBtn) {
      hintBtn.onclick = () => {
        sfx.playPop();
        if (hintBox) {
          hintBox.innerText = `💡 تلميح: ${this.currentStory.hint}`;
          hintBox.style.display = 'block';
        }
      };
    }

    if (choicesContainer) {
      choicesContainer.innerHTML = '';
      const shuffledOptions = [...this.currentStory.options].sort(() => Math.random() - 0.5);

      shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'story-choice-btn';
        btn.innerText = opt;

        btn.onclick = () => this.handleAnswer(btn, opt);
        choicesContainer.appendChild(btn);
      });
    }
  }

  handleAnswer(clickedBtn, selectedOption) {
    if (this.isAnswered || !this.currentStory) return;

    if (selectedOption === this.currentStory.prophet) {
      this.isAnswered = true;
      sfx.playCorrect();
      clickedBtn.classList.add('correct-choice');
      showVisualFeedback(clickedBtn, "+20 ⭐ إجابة موفقة!");

      if (!game.player.discoveredProphets) game.player.discoveredProphets = [];
      if (!game.player.discoveredProphets.includes(this.currentStory.id)) {
        game.player.discoveredProphets.push(this.currentStory.id);
        game.addHasanat(20);
      }

      const moralBanner = document.getElementById('story-moral-banner');
      const moralTitle = document.getElementById('story-moral-title');
      const moralBody = document.getElementById('story-moral-body');
      const nextBtn = document.getElementById('btn-next-story-question');

      if (moralBanner && moralTitle && moralBody) {
        moralTitle.innerText = `✨ ما شاء الله! ${this.currentStory.prophet}`;
        moralBody.innerText = this.currentStory.moral;
        moralBanner.style.display = 'block';
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          sfx.playPop();
          this.loadStoryQuestion(this.currentStoryIndex + 1);
        };
      }
    } else {
      sfx.playWrong();
      clickedBtn.classList.add('wrong-choice');
      showCustomAlert("حاول مرة أخرى يا بطل 💡", "تأمل في أنوار ومعجزات القصة جيداً واستعن بزر التلميح!", "💡", "حسناً سأحاول 🌟");
      setTimeout(() => clickedBtn.classList.remove('wrong-choice'), 600);
    }
  }
}

const storyEngine = new StoryBlocksEngine();

// ==========================================================
// CONQUEST MAP GAME ENGINE (خريطة الفتوحات وسفراء الإسلام)
// ==========================================================
class ConquestMapEngine {
  constructor() {
    this.currentLevel = 1;
    this.campaign = null;
    this.cities = [];
    this.heroes = [];
    this.deployedHeroes = {}; // cityId -> heroId
    this.selectedHeroId = null;
    this.draggedHeroId = null;
    this.isCompleted = false;
  }

  startLevel(lvlNum) {
    this.currentLevel = lvlNum;
    this.campaign = CONQUEST_CAMPAIGNS_DATA[lvlNum];
    if (!this.campaign) return;

    this.cities = [...this.campaign.cities];
    this.heroes = [...this.campaign.heroes];
    this.deployedHeroes = {};
    this.selectedHeroId = null;
    this.draggedHeroId = null;
    this.isCompleted = false;

    game.switchScreen('screen-conquest-game');

    const titleIcon = document.getElementById('conquest-level-title-icon');
    const titleText = document.getElementById('conquest-level-title-text');
    if (titleIcon) titleIcon.innerText = lvlNum === 1 ? '🗺️' : (lvlNum === 2 ? '⚔️' : '👑🚩');
    if (titleText) titleText.innerText = this.campaign.title;

    const factBanner = document.getElementById('conquest-fact-banner');
    if (factBanner) factBanner.style.display = 'none';

    this.renderMap();
    this.renderHeroesTray();
    this.updateMissionClue();
  }

  updateMissionClue() {
    const desc = document.getElementById('conquest-mission-desc');
    const countBadge = document.getElementById('conquest-heroes-count');
    const deployedCount = Object.keys(this.deployedHeroes).length;
    const total = this.heroes.length;

    if (countBadge) countBadge.innerText = `${total - deployedCount} / ${total}`;

    if (this.selectedHeroId) {
      const hero = this.heroes.find(h => h.id === this.selectedHeroId);
      if (hero && desc) {
        desc.innerText = `🎯 مهمة ${hero.name}: "${hero.clue}" ➔ انقر على الوجهة المناسبة على الخريطة!`;
      }
    } else {
      const nextUndeployed = this.heroes.find(h => !Object.values(this.deployedHeroes).includes(h.id));
      if (nextUndeployed && desc) {
        desc.innerText = `اسحب أو انقر على (${nextUndeployed.name}) لتتعرف على مهمته وتوجهه لمدينته على الخريطة!`;
      } else if (desc) {
        desc.innerText = "ما شاء الله! اكتملت حملة الفتوحات بنجاح مبارك! 🚩";
      }
    }
  }

  renderMap() {
    const board = document.getElementById('conquest-map-board');
    if (!board) return;
    board.innerHTML = '';

    this.cities.forEach(city => {
      const cityElem = document.createElement('div');
      cityElem.className = 'map-city-target';
      cityElem.id = `city-target-${city.id}`;
      cityElem.style.left = `${city.x}%`;
      cityElem.style.top = `${city.y}%`;
      cityElem.dataset.cityId = city.id;

      const isConquered = !!this.deployedHeroes[city.id];
      if (isConquered) cityElem.classList.add('conquered');

      const deployedHero = isConquered ? this.heroes.find(h => h.id === this.deployedHeroes[city.id]) : null;

      cityElem.innerHTML = `
        <div class="city-target-ring">
          <span>${city.icon}</span>
          ${deployedHero ? `<span class="city-hero-deployed-emblem">${deployedHero.icon}</span>` : ''}
        </div>
        <div class="city-label-badge">${city.name} ${isConquered ? '🚩' : ''}</div>
      `;

      // Drag over events for desktop drag and drop
      cityElem.ondragover = (e) => {
        e.preventDefault();
        cityElem.classList.add('drag-over');
      };

      cityElem.ondragleave = () => {
        cityElem.classList.remove('drag-over');
      };

      cityElem.ondrop = (e) => {
        e.preventDefault();
        cityElem.classList.remove('drag-over');
        const heroId = e.dataTransfer.getData('text/plain') || this.draggedHeroId;
        if (heroId) {
          this.attemptDeploy(heroId, city.id, cityElem);
        }
      };

      // Click to deploy (for mobile/tablet touch users)
      cityElem.onclick = () => {
        if (this.selectedHeroId) {
          this.attemptDeploy(this.selectedHeroId, city.id, cityElem);
        } else if (!isConquered) {
          sfx.playPop();
          showCustomAlert(
            `مدينة ${city.name} ${city.icon}`,
            "اختر بطل الصحابة أو سفير الإسلام المناسب من الصندوق بالأسفل أولاً!",
            "🗺️",
            "فهمت يا بطل 🌟"
          );
        }
      };

      board.appendChild(cityElem);
    });
  }

  renderHeroesTray() {
    const tray = document.getElementById('conquest-heroes-tray');
    if (!tray) return;
    tray.innerHTML = '';

    this.heroes.forEach(hero => {
      const isDeployed = Object.values(this.deployedHeroes).includes(hero.id);
      const isSelected = this.selectedHeroId === hero.id;

      const card = document.createElement('div');
      card.className = `hero-token-card ${isDeployed ? 'deployed-token' : ''} ${isSelected ? 'selected-token' : ''}`;
      card.id = `hero-token-${hero.id}`;
      card.draggable = !isDeployed;

      card.innerHTML = `
        <div class="hero-token-icon">${hero.icon}</div>
        <div class="hero-token-info">
          <div class="hero-token-name">${hero.name}</div>
          <div class="hero-token-title">${isDeployed ? '✅ تم التوجيه' : hero.title}</div>
        </div>
      `;

      // HTML5 Drag Handlers
      card.ondragstart = (e) => {
        this.draggedHeroId = hero.id;
        this.selectedHeroId = hero.id;
        e.dataTransfer.setData('text/plain', hero.id);
        card.classList.add('selected-token');
        this.updateMissionClue();
      };

      card.ondragend = () => {
        this.draggedHeroId = null;
      };

      // Touch / Click Handler
      card.onclick = () => {
        if (isDeployed) return;
        sfx.playPop();
        if (this.selectedHeroId === hero.id) {
          this.selectedHeroId = null;
        } else {
          this.selectedHeroId = hero.id;
        }
        this.renderHeroesTray();
        this.updateMissionClue();
      };

      tray.appendChild(card);
    });
  }

  attemptDeploy(heroId, cityId, cityElem) {
    const hero = this.heroes.find(h => h.id === heroId);
    const city = this.cities.find(c => c.id === cityId);
    if (!hero || !city) return;

    if (this.deployedHeroes[cityId]) {
      sfx.playWrong();
      showCustomAlert(
        "المنطقة مفتوحة بالفعل 🚩",
        `تم توجيه الصحابي الجليل إلى ${city.name} بنجاح سابقاً!`,
        "🚩"
      );
      return;
    }

    if (hero.targetCityId === cityId) {
      // CORRECT DEPLOYMENT!
      sfx.playCorrect();
      this.deployedHeroes[cityId] = heroId;
      this.selectedHeroId = null;

      if (!game.player.discoveredConquests) game.player.discoveredConquests = [];
      if (!game.player.discoveredConquests.includes(hero.id)) {
        game.player.discoveredConquests.push(hero.id);
        game.addHasanat(25);
      }

      showVisualFeedback(cityElem, `+25 ⭐ فتح مبارك لـ ${city.name}!`);

      this.renderMap();
      this.renderHeroesTray();
      this.updateMissionClue();

      const factBanner = document.getElementById('conquest-fact-banner');
      const factTitle = document.getElementById('conquest-fact-title');
      const factBody = document.getElementById('conquest-fact-body');
      const nextBtn = document.getElementById('btn-next-conquest-hero');

      if (factBanner && factTitle && factBody) {
        factTitle.innerText = `🚩 فتح مبارك في ${city.name}: ${hero.name}`;
        factBody.innerText = hero.fact;
        factBanner.style.display = 'block';
      }

      const totalDeployed = Object.keys(this.deployedHeroes).length;
      if (totalDeployed === this.heroes.length) {
        if (nextBtn) {
          nextBtn.querySelector('span').innerText = "🏆 إتمام الحملة واستلام الأوسمة ➔";
          nextBtn.onclick = () => {
            sfx.playPop();
            game.completeConquestLevel(this.currentLevel);
          };
        }
      } else {
        if (nextBtn) {
          nextBtn.querySelector('span').innerText = "المهمة التالية ➔";
          nextBtn.onclick = () => {
            sfx.playPop();
            if (factBanner) factBanner.style.display = 'none';
          };
        }
      }
    } else {
      // WRONG DEPLOYMENT!
      sfx.playWrong();
      cityElem.classList.add('wrong-choice');
      showCustomAlert(
        "وجهة غير مطابقة 💡",
        `فكر جيداً يا بطل: إلى أين توجه ${hero.name} (${hero.title})؟\n\nتلميح: ${hero.clue}`,
        "🗺️",
        "سأحاول مجدداً 🌟"
      );
      setTimeout(() => cityElem.classList.remove('wrong-choice'), 600);
    }
  }
}

const conquestEngine = new ConquestMapEngine();

// ==========================================================
// STAGES LOGIC: HAJJ GAME (1-9)
// ==========================================================
function Stage1_Packing(container, g) {
  const items = [
    { id: 1, name: "ملابس الإحرام البيضاء", icon: "🥼", correct: true, msg: "ممتاز! لبس إزار ورداء أبيضين نظيفين سُنّة مباركة." },
    { id: 2, name: "المصحف الشريف", icon: "📖", correct: true, msg: "رائع! لتلاوة القرآن والذكر في الحرم." },
    { id: 3, name: "قارورة ماء", icon: "🍶", correct: true, msg: "أحسنت! لشرب الماء والتروي أثناء الرحلة." },
    { id: 4, name: "مظلة شمسية", icon: "☂️", correct: true, msg: "جميل! للحماية من حرارة الشمس في المشاعر." },
    { id: 5, name: "سجادة الصلاة", icon: "🕌", correct: true, msg: "بارك الله فيك! لأداء الصلوات في أوقاتها." },
    { id: 6, name: "ألعاب إلكترونية", icon: "🎮", correct: false, msg: "رحلة الحج للعبادة والذكر، نترك الألعاب بالبيت!" },
    { id: 7, name: "عطور فواحة", icon: "🌸", correct: false, msg: "المُحْرِم يتجنب وضع العطور بعد نية الإحرام (محظورات الإحرام)!" },
    { id: 8, name: "حلويات وشيبس", icon: "🍬", correct: false, msg: "نأخذ الأطعمة الصحية والمفيدة فقط للتقوي على العبادة!" }
  ];

  let packedItems = [];

  container.innerHTML = `
    <div class="stage-header-bar">
      <div class="stage-title"><span>🧳</span> المرحلة 1: نية الإحرام وتجهيز السفر (🌟 ركن وسُنّة)</div>
      <button class="btn-secondary" id="btn-stage-map-back" style="width:auto; padding:6px 12px; font-size:0.9rem;">الخريطة 🗺️</button>
    </div>

    <div class="stage-instruction-box">
      <span>💡</span> <strong>الإحرام هو نية الدخول في النسك (ركن الحج الأول)</strong>؛ ومن السنن الاغتسال ولبس ثياب الإحرام البيضاء!
    </div>

    <div class="items-grid" id="pack-grid"></div>

    <div class="suitcase-dropzone">
      <div class="suitcase-title">🧳 حقيبة الحاج الصغير (<span id="pack-count">0</span> / 5)</div>
      <div class="suitcase-slots" id="pack-slots"></div>
    </div>
  `;

  document.getElementById('btn-stage-map-back').onclick = () => {
    g.renderMap();
    g.switchScreen('screen-map');
  };

  const grid = document.getElementById('pack-grid');
  const slots = document.getElementById('pack-slots');
  const countElem = document.getElementById('pack-count');

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'pack-item-card';
    card.innerHTML = `
      <div class="pack-icon">${item.icon}</div>
      <div class="pack-name">${item.name}</div>
    `;

    card.onclick = () => {
      if (packedItems.includes(item.id)) return;

      if (!item.correct) {
        sfx.playWrong();
        card.classList.add('wrong-shake');
        showCustomAlert("تنبيه لطيف يا بطل 🧳", item.msg, "💡", "حسناً فهمت 🌟");
        setTimeout(() => card.classList.remove('wrong-shake'), 400);
        return;
      }

      sfx.playCorrect();
      showVisualFeedback(card, "+10 ⭐ مستلزم صحيح!");
      card.classList.add('packed');
      packedItems.push(item.id);

      const slot = document.createElement('div');
      slot.className = 'packed-slot';
      slot.innerHTML = `<span>${item.icon}</span> <span>${item.name}</span>`;
      slots.appendChild(slot);

      countElem.innerText = packedItems.length;

      if (packedItems.length === 5) {
        setTimeout(() => {
          g.completeLevel(1);
        }, 600);
      }
    };

    grid.appendChild(card);
  });
}

function Stage2_Miqat(container, g) {
  let talbiyahClicks = 0;
  const targetClicks = 4;

  const talbiyahPhrases = [
    "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ 🕊️",
    "لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ ✨",
    "إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ 🤲",
    "لاَ شَرِيكَ لَكَ 🕋"
  ];

  container.innerHTML = `
    <div class="stage-header-bar">
      <div class="stage-title"><span>🕊️</span> المرحلة 2: الميقات والتلبية (🏷️ واجب وسُنّة)</div>
      <button class="btn-secondary" id="btn-stage-map-back" style="width:auto; padding:6px 12px; font-size:0.9rem;">الخريطة 🗺️</button>
    </div>

    <div class="stage-instruction-box">
      <span>💡</span> <strong>الإحرام من الميقات (واجب شرعي)</strong>، و<strong>التلبية (سُنّة مؤكدة)</strong>: ردد التلبية بصوت خاشع!
    </div>

    <div class="miqat-container">
      <div class="character-ihram-display">
        ${g.player.avatar === 'boy' ? '👦' : '👧'}
      </div>

      <div class="talbiyah-card-box" id="talbiyah-phrase-view">
        « لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ »
      </div>

      <div class="talbiyah-counter-bar" id="t-dots">
        <div class="t-step-circle">1</div>
        <div class="t-step-circle">2</div>
        <div class="t-step-circle">3</div>
        <div class="t-step-circle">4</div>
      </div>

      <button id="btn-chant-talbiyah" class="btn-primary-big pulse-anim">
        <span>📢 ردد التلبية واكسب حسنات</span>
      </button>
    </div>
  `;

  document.getElementById('btn-stage-map-back').onclick = () => {
    g.renderMap();
    g.switchScreen('screen-map');
  };

  const btnChant = document.getElementById('btn-chant-talbiyah');
  const phraseView = document.getElementById('talbiyah-phrase-view');
  const dots = document.querySelectorAll('.t-step-circle');

  btnChant.onclick = () => {
    sfx.playCorrect();
    sfx.playTone(400 + (talbiyahClicks * 100), 'triangle', 0.3, 0.2);
    showVisualFeedback(btnChant, "+15 ⭐ لبيك اللهم لبيك!");

    if (dots[talbiyahClicks]) {
      dots[talbiyahClicks].classList.add('done');
    }

    talbiyahClicks++;
    if (talbiyahClicks < targetClicks) {
      phraseView.innerText = `« ${talbiyahPhrases[talbiyahClicks]} »`;
    }

    if (talbiyahClicks >= targetClicks) {
      btnChant.disabled = true;
      phraseView.innerText = "✨ تقبل الله منك! تلبية مباركة ✨";
      setTimeout(() => {
        g.completeLevel(2);
      }, 700);
    }
  };
}

function Stage3_Tawaf(container, g) {
  let circuit = 0;
  let angle = 0;
  let isWalking = false;

  const duas = [
    "بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ! (شوط 1)",
    "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً (شوط 2)",
    "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلاَ إِلَهَ إِلاَّ اللَّهُ (شوط 3)",
    "اللَّهُمَّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا (شوط 4)",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَنَعِيمَهَا (شوط 5)",
    "لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ الْعَلِيِّ الْعَظِيمِ (شوط 6)",
    "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ (شوط 7)"
  ];

  container.innerHTML = `
    <div class="stage-header-bar">
      <div class="stage-title"><span>🕋</span> المرحلة 3: الطواف حول الكعبة (🌟 ركن الحج)</div>
      <button class="btn-secondary" id="btn-stage-map-back" style="width:auto; padding:6px 12px; font-size:0.9rem;">الخريطة 🗺️</button>
    </div>

    <div class="stage-instruction-box">
      <span>💡</span> <strong>طواف الإفاضة (ركن الحج الأساسي)</strong>؛ ومن السنن طواف القدوم والرمل واستلام الحجر الأسود!
    </div>

    <div class="tawaf-dashboard">
      <div><strong>الشوط:</strong> <span class="circuit-count" id="tawaf-cur-circuit">0 / 7</span></div>
      <div id="tawaf-dua-text" style="font-size:0.85rem; font-weight:700; color:#0369a1;">نبدأ من الحجر الأسود بالتكبير</div>
    </div>

    <div class="tawaf-arena" id="tawaf-box">
      <div class="kaaba-center">
        <div class="kaaba-kiswa-gold"></div>
        <span>الكعبة</span>
        <div class="black-stone-marker" title="الحجر الأسود"></div>
      </div>
      <div class="tawaf-orbit-circle"></div>
      <div class="pilgrim-walker" id="pilgrim-dot">
        ${g.player.avatar === 'boy' ? '👦' : '👧'}
      </div>
    </div>

    <button id="btn-walk-tawaf" class="btn-primary-big">
      <span>👣 طُف شوطاً حول الكعبة</span>
    </button>
  `;

  document.getElementById('btn-stage-map-back').onclick = () => {
    g.renderMap();
    g.switchScreen('screen-map');
  };

  const walker = document.getElementById('pilgrim-dot');
  const btnWalk = document.getElementById('btn-walk-tawaf');
  const circuitElem = document.getElementById('tawaf-cur-circuit');
  const duaElem = document.getElementById('tawaf-dua-text');

  function updatePilgrimPosition(deg) {
    const radius = 95;
    const rad = (deg * Math.PI) / 180;
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);
    walker.style.transform = `translate(${x}px, ${y}px)`;
  }

  updatePilgrimPosition(0);

  btnWalk.onclick = () => {
    if (isWalking || circuit >= 7) return;
    isWalking = true;
    btnWalk.disabled = true;

    sfx.playTone(523.25, 'triangle', 0.2, 0.15);

    let step = 0;
    const targetSteps = 36;
    const interval = setInterval(() => {
      angle += 10;
      updatePilgrimPosition(angle);
      step++;

      if (step >= targetSteps) {
        clearInterval(interval);
        circuit++;
        isWalking = false;
        btnWalk.disabled = false;

        sfx.playCorrect();
        showVisualFeedback(circuitElem, "+15 ⭐ شوط مبارك!");
        circuitElem.innerText = `${circuit} / 7`;
        duaElem.innerText = duas[circuit - 1] || "تم الطواف المبارك!";

        if (circuit >= 7) {
          btnWalk.disabled = true;
          setTimeout(() => {
            g.completeLevel(3);
          }, 800);
        }
      }
    }, 25);
  };
}

function Stage4_Sai(container, g) {
  let laps = 0;
  let atSafa = true;

  container.innerHTML = `
    <div class="stage-header-bar">
      <div class="stage-title"><span>💧</span> المرحلة 4: السعي وماء زمزم (🌟 ركن وسُنّة)</div>
      <button class="btn-secondary" id="btn-stage-map-back" style="width:auto; padding:6px 12px; font-size:0.9rem;">الخريطة 🗺️</button>
    </div>

    <div class="stage-instruction-box">
      <span>💡</span> <strong>السعي بين الصفا والمروة 7 أشواط (ركن الحج)</strong>؛ ومن السنن الهرولة بين العلمين والشرب من ماء زمزم!
    </div>

    <div class="tawaf-dashboard">
      <div><strong>الشوط:</strong> <span class="circuit-count" id="sai-cur-lap">0 / 7</span></div>
      <div id="sai-info-text" style="font-size:0.85rem; font-weight:700; color:#047857;">البداية من جبل الصفا</div>
    </div>

    <div class="sai-track-container">
      <div class="hill-safa">
        <span>جبل</span>
        <span>الصفا</span>
      </div>
      
      <div class="green-run-zone">
        <span>العلمين الأخضرين (هرولة سُنّة)</span>
      </div>

      <div class="hill-marwa">
        <span>جبل</span>
        <span>المروة</span>
      </div>

      <div class="sai-runner" id="sai-pilgrim" style="left: 15%;">
        ${g.player.avatar === 'boy' ? '🏃‍♂️' : '🏃‍♀️'}
      </div>
    </div>

    <button id="btn-sai-step" class="btn-primary-big">
      <span>اسعَ نحو ${atSafa ? 'المروة' : 'الصفا'} ➔</span>
    </button>
  `;

  document.getElementById('btn-stage-map-back').onclick = () => {
    g.renderMap();
    g.switchScreen('screen-map');
  };

  const btnStep = document.getElementById('btn-sai-step');
  const runner = document.getElementById('sai-pilgrim');
  const lapElem = document.getElementById('sai-cur-lap');
  const infoElem = document.getElementById('sai-info-text');

  btnStep.onclick = () => {
    if (laps >= 7) return;

    btnStep.disabled = true;
    sfx.playTone(600, 'sine', 0.15, 0.2);

    atSafa = !atSafa;
    runner.style.left = atSafa ? '15%' : '75%';

    setTimeout(() => {
      laps++;
      lapElem.innerText = `${laps} / 7`;
      sfx.playCorrect();
      showVisualFeedback(lapElem, "+10 ⭐ سعي مبرور!");

      if (laps < 7) {
        btnStep.innerHTML = `<span>اسعَ نحو ${atSafa ? 'المروة' : 'الصفا'} ➔</span>`;
        btnStep.disabled = false;
        infoElem.innerText = `وصلت إلى ${atSafa ? 'الصفا' : 'المروة'}`;
      } else {
        infoElem.innerText = "✨ أتممت السعي وشربت من ماء زمزم المبارك! هنيئاً لك ✨";
        setTimeout(() => {
          g.completeLevel(4);
        }, 700);
      }
    }, 450);
  };
}

function Stage5_Mina(container, g) {
  const tasks = [
    { id: 1, title: "سقيا الماء البارد", icon: "🧊", desc: "سقيا الحجاج وتوزيع الماء" },
    { id: 2, title: "نظافة المخيم", icon: "🧹", desc: "وضع النفايات في الصندوق المخصص" },
    { id: 3, title: "إرشاد التائه", icon: "🧭", desc: "مساعدة حاج مسن للوصول لخيمته" },
    { id: 4, title: "تلاوة القرآن والذكر", icon: "📖", desc: "قراءة القرآن والتسبيح بمنى" }
  ];

  let completedTasks = [];

  container.innerHTML = `
    <div class="stage-header-bar">
      <div class="stage-title"><span>⛺</span> المرحلة 5: مخيم منى ويوم التروية (🌸 سُنّة مستحبة)</div>
      <button class="btn-secondary" id="btn-stage-map-back" style="width:auto; padding:6px 12px; font-size:0.9rem;">الخريطة 🗺️</button>
    </div>

    <div class="stage-instruction-box">
      <span>💡</span> <strong>المبيت بمنى في يوم التروية (8 ذي الحجة) سُنّة مستحبة</strong>، والمبيت بها ليالي التشريق (واجب)!
    </div>

    <div class="mina-camp-grid" id="mina-grid"></div>

    <div style="text-align:center; font-weight:800; color:#047857; margin-top:auto;">
      المهام المنجزة: <span id="mina-count">0</span> / 4
    </div>
  `;

  document.getElementById('btn-stage-map-back').onclick = () => {
    g.renderMap();
    g.switchScreen('screen-map');
  };

  const grid = document.getElementById('mina-grid');
  const countElem = document.getElementById('mina-count');

  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'mina-task-card';
    card.innerHTML = `
      <div class="mina-task-icon">${task.icon}</div>
      <div class="mina-task-title">${task.title}</div>
      <div style="font-size:0.75rem; color:#64748b;">${task.desc}</div>
    `;

    card.onclick = () => {
      if (completedTasks.includes(task.id)) return;
      sfx.playCorrect();
      showVisualFeedback(card, "+20 ⭐ إحسان وبركة!");
      completedTasks.push(task.id);
      card.classList.add('completed');
      card.innerHTML += `<div style="color:#10b981; font-weight:900;">✅ تم الإنجاز (+20 ⭐)</div>`;
      countElem.innerText = completedTasks.length;

      if (completedTasks.length === 4) {
        setTimeout(() => {
          g.completeLevel(5);
        }, 700);
      }
    };

    grid.appendChild(card);
  });
}

function Stage6_Arafat(container, g) {
  const duas = [
    "«لا إله إلا الله وحده لا شريك له»",
    "«اللهم اغفر لي ولوالدي»",
    "«اللهم ارزقني الجنة ورضاك»",
    "«اللهم بارك في أهلي ومعلمي»",
    "«اللهم اشفِ كل مريض»"
  ];

  let collectedDuas = [];

  container.innerHTML = `
    <div class="stage-header-bar">
      <div class="stage-title"><span>🤲</span> المرحلة 6: جبل عرفات (🌟 ركن الحج الأعظم)</div>
      <button class="btn-secondary" id="btn-stage-map-back" style="width:auto; padding:6px 12px; font-size:0.9rem;">الخريطة 🗺️</button>
    </div>

    <div class="stage-instruction-box">
      <span>💡</span> قال ﷺ: <strong>«الحج عرفة» (ركن الحج الأعظم)</strong>؛ والبقاء للغروب (واجب)، والدعاء والتضرع (سُنّة)!
    </div>

    <div class="arafat-canvas-box" id="arafat-sky"></div>

    <div class="suitcase-dropzone">
      <div class="suitcase-title">🧺 سلة الأدعية المستجابة (<span id="duas-count">0</span> / 5)</div>
      <div class="suitcase-slots" id="duas-collected-list"></div>
    </div>
  `;

  document.getElementById('btn-stage-map-back').onclick = () => {
    g.renderMap();
    g.switchScreen('screen-map');
  };

  const sky = document.getElementById('arafat-sky');
  const countElem = document.getElementById('duas-count');
  const collectedList = document.getElementById('duas-collected-list');

  duas.forEach((dua, idx) => {
    const star = document.createElement('div');
    star.className = 'falling-dua-star';
    star.innerText = `⭐ ${dua}`;
    
    const top = 15 + (idx * 16);
    const left = (idx % 2 === 0) ? 8 + (idx * 5) : 35 + (idx * 8);
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;

    star.onclick = () => {
      if (collectedDuas.includes(idx)) return;
      sfx.playCorrect();
      showVisualFeedback(star, "+20 ⭐ دعاء مستجاب!");
      collectedDuas.push(idx);
      star.style.display = 'none';

      const slot = document.createElement('div');
      slot.className = 'packed-slot';
      slot.innerText = dua;
      collectedList.appendChild(slot);

      countElem.innerText = collectedDuas.length;

      if (collectedDuas.length === 5) {
        setTimeout(() => {
          g.completeLevel(6);
        }, 700);
      }
    };

    sky.appendChild(star);
  });
}

function Stage7_Muzdalifah(container, g) {
  let pebblesCollected = 0;
  const targetPebbles = 7;

  container.innerHTML = `
    <div class="stage-header-bar">
      <div class="stage-title"><span>🌌</span> المرحلة 7: ليلة مزدلفة (🏷️ واجب الحج)</div>
      <button class="btn-secondary" id="btn-stage-map-back" style="width:auto; padding:6px 12px; font-size:0.9rem;">الخريطة 🗺️</button>
    </div>

    <div class="stage-instruction-box">
      <span>💡</span> <strong>المبيت بمزدلفة ليلة النحر (واجب من واجبات الحج)</strong>؛ نبيت تحت النجوم ونجمع 7 حصيات لرمي الجمار!
    </div>

    <div class="muzdalifah-sky" id="pebble-area">
      <div style="position:absolute; top:12px; right:16px; font-size:2.4rem;">🌙</div>
      <div style="position:absolute; top:20px; left:25px; font-size:1.2rem; color:#fff;">✨</div>
      <div style="position:absolute; top:40px; right:35%; font-size:1rem; color:#fff;">✨</div>
    </div>

    <div style="text-align:center; font-weight:800; color:#1e1b4b; margin-top:auto;">
      الحصيات في الكيس: <span id="pebble-count">0</span> / 7 🪨
    </div>
  `;

  document.getElementById('btn-stage-map-back').onclick = () => {
    g.renderMap();
    g.switchScreen('screen-map');
  };

  const area = document.getElementById('pebble-area');
  const countElem = document.getElementById('pebble-count');

  const coords = [
    { top: 55, left: 15 },
    { top: 70, left: 30 },
    { top: 60, left: 50 },
    { top: 75, left: 70 },
    { top: 82, left: 20 },
    { top: 80, left: 85 },
    { top: 68, left: 42 }
  ];

  coords.forEach((c) => {
    const pebble = document.createElement('div');
    pebble.className = 'pebble-item';
    pebble.style.top = `${c.top}%`;
    pebble.style.left = `${c.left}%`;
    pebble.innerText = '🪨';

    pebble.onclick = () => {
      sfx.playPop();
      showVisualFeedback(pebble, "+10 ⭐ حصاة مباركة!");
      pebble.style.display = 'none';
      pebblesCollected++;
      countElem.innerText = pebblesCollected;

      if (pebblesCollected >= targetPebbles) {
        sfx.playCorrect();
        setTimeout(() => {
          g.completeLevel(7);
        }, 600);
      }
    };

    area.appendChild(pebble);
  });
}

function Stage8_Jamarat(container, g) {
  let throws = 0;
  const maxThrows = 7;

  container.innerHTML = `
    <div class="stage-header-bar">
      <div class="stage-title"><span>🎈</span> المرحلة 8: رمي الجمار والتحلل (🏷️ واجبات الحج)</div>
      <button class="btn-secondary" id="btn-stage-map-back" style="width:auto; padding:6px 12px; font-size:0.9rem;">الخريطة 🗺️</button>
    </div>

    <div class="stage-instruction-box">
      <span>💡</span> <strong>رمي الجمار (واجب)</strong> و<strong>الحلق أو التقصير للتحلل (واجب)</strong>؛ ارمِ مع التكبير: "بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ"!
    </div>

    <div class="jamarat-stage">
      <div class="jamarat-target" id="jamarat-pillar">
        <span>الشاخص</span>
        <span style="font-size:1.8rem;">🎯</span>
      </div>

      <div style="font-size:1.1rem; font-weight:800; color:#b45309;" id="throw-status">
        ارمِ الحصاة رقم (<span id="throw-num">1</span>)
      </div>

      <button id="btn-throw-pebble" class="jamarat-throw-btn">
        <span>🪨 بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ (ارمِ)</span>
      </button>
    </div>
  `;

  document.getElementById('btn-stage-map-back').onclick = () => {
    g.renderMap();
    g.switchScreen('screen-map');
  };

  const btnThrow = document.getElementById('btn-throw-pebble');
  const pillar = document.getElementById('jamarat-pillar');
  const statusElem = document.getElementById('throw-status');
  const numElem = document.getElementById('throw-num');

  btnThrow.onclick = () => {
    if (throws >= maxThrows) return;

    btnThrow.disabled = true;
    sfx.playTone(350, 'square', 0.15, 0.2);
    showVisualFeedback(pillar, "🎯 الله أكبر!");

    pillar.classList.add('hit-anim');
    setTimeout(() => pillar.classList.remove('hit-anim'), 300);

    throws++;
    if (throws < maxThrows) {
      numElem.innerText = throws + 1;
      setTimeout(() => {
        btnThrow.disabled = false;
      }, 350);
    } else {
      sfx.playTakbeerMelody();
      statusElem.innerText = "🎉 عيدكم مبارك! تقبل الله طاعتكم وحجكم 🎉";
      btnThrow.style.display = 'none';
      setTimeout(() => {
        g.completeLevel(8);
      }, 1000);
    }
  };
}

function Stage9_Farewell(container, g) {
  container.innerHTML = `
    <div class="stage-header-bar">
      <div class="stage-title"><span>👑</span> المرحلة 9: طواف الوداع والختام (🏷️ واجب الحج)</div>
      <button class="btn-secondary" id="btn-stage-map-back" style="width:auto; padding:6px 12px; font-size:0.9rem;">الخريطة 🗺️</button>
    </div>

    <div class="stage-instruction-box">
      <span>💡</span> <strong>طواف الوداع (واجب من واجبات الحج)</strong>؛ ليكون آخر عهد الحاج بالبيت الحرام قبل مغادرة مكة المكرمة!
    </div>

    <div style="text-align:center; padding: 20px 10px; display:flex; flex-direction:column; align-items:center; gap:16px;">
      <div style="font-size: 5rem;" class="kaaba-icon-glow">🕋</div>
      
      <h2 style="color:#047857; font-size:1.4rem; font-weight:900;">
        هنيئاً لك يا ${g.player.name}! 🌟
      </h2>
      
      <p style="color:#475569; font-weight:700; line-height:1.7;">
        لقد أتممت أركان الحج وواجباته وسننه كاملة، وتعلمت هدي نبينا محمد ﷺ.<br>
        أنت الآن تستحق <strong>وسام الحاج الصغير</strong> وشهادة التقدير الرسمية!
      </p>

      <button id="btn-claim-cert" class="btn-primary-big pulse-anim">
        <span>📜 استلم وسامك وشهادتك الآن</span>
      </button>
    </div>
  `;

  document.getElementById('btn-stage-map-back').onclick = () => {
    g.renderMap();
    g.switchScreen('screen-map');
  };

  const btnClaim = document.getElementById('btn-claim-cert');
  btnClaim.onclick = () => {
    g.completeLevel(9);
  };
}

// ==========================================================
// EVENT LISTENERS & APP INITIALIZATION
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Sound toggle button
  const soundBtn = document.getElementById('btn-sound');
  if (soundBtn) {
    soundBtn.onclick = () => {
      sfx.enabled = !sfx.enabled;
      soundBtn.querySelector('.icon').innerText = sfx.enabled ? '🔊' : '🔇';
    };
  }

  // Unified Hero Profile Modal
  const profileBadge = document.getElementById('player-profile-badge');
  const passportModal = document.getElementById('modal-passport');
  const closePassport = document.getElementById('btn-close-passport');
  const addNewProfileBtn = document.getElementById('btn-add-new-profile');
  const resetAllBtn = document.getElementById('btn-reset-all-data');

  const openPassportHandler = () => {
    sfx.playPop();
    game.renderPassport();
    if (passportModal) passportModal.classList.add('active');
  };

  if (profileBadge) profileBadge.onclick = openPassportHandler;

  if (closePassport && passportModal) {
    closePassport.onclick = () => {
      passportModal.classList.remove('active');
    };
  }

  // Profiles Modal Toggle (إدارة وتبديل الأبطال)
  const profilesToggle = document.getElementById('btn-profiles-toggle');
  const profilesModal = document.getElementById('modal-profiles');
  const closeProfilesBtn = document.getElementById('btn-close-profiles');

  if (profilesToggle && profilesModal) {
    profilesToggle.onclick = () => {
      sfx.playPop();
      game.renderProfilesModal();
      profilesModal.classList.add('active');
    };
  }

  if (closeProfilesBtn && profilesModal) {
    closeProfilesBtn.onclick = () => {
      profilesModal.classList.remove('active');
    };
  }

  if (addNewProfileBtn) {
    addNewProfileBtn.onclick = () => {
      sfx.playPop();
      if (profilesModal) profilesModal.classList.remove('active');
      if (passportModal) passportModal.classList.remove('active');
      
      const returningBox = document.getElementById('welcome-returning-box');
      const newForm = document.getElementById('welcome-new-user-form');
      if (returningBox) returningBox.style.display = 'none';
      if (newForm) newForm.style.display = 'block';

      const nameInput = document.getElementById('input-child-name');
      if (nameInput) {
        nameInput.value = '';
        nameInput.placeholder = "اكتب اسم البطل الجديد...";
      }
      const startBtnText = document.getElementById('start-btn-text');
      if (startBtnText) startBtnText.innerText = "بدء مغامرة البطل الجديد 🚀";

      game.switchScreen('screen-welcome');
    };
  }

  if (resetAllBtn) {
    resetAllBtn.onclick = () => {
      sfx.playPop();
      if (profilesModal) profilesModal.classList.remove('active');
      if (passportModal) passportModal.classList.remove('active');
      showCustomConfirm(
        "تصفير المنصة ⚠️",
        "هل أنت متأكد من مسح كافة الحسابات والحسنات المسجلة والبدء من الصفر؟",
        "⚠️",
        "نعم، امسح الكل",
        "إلغاء ❌",
        () => {
          sfx.playWrong();
          game.resetAllData();
          showCustomAlert("تم التصفير بنجاح ✅", "تم مسح جميع الحسابات وتصفير الذاكرة بنجاح!", "🎉", "رائع 🌟");
        }
      );
    };
  }

  // Quran Album Modal Toggle
  const albumToggle = document.getElementById('btn-quran-album-toggle');
  const albumModal = document.getElementById('modal-quran-album');
  const closeAlbum = document.getElementById('btn-close-album');

  if (albumToggle && albumModal) {
    albumToggle.onclick = () => {
      sfx.playPop();
      game.renderQuranAlbum();
      albumModal.classList.add('active');
    };
  }

  if (closeAlbum && albumModal) {
    closeAlbum.onclick = () => albumModal.classList.remove('active');
  }

  // Hub Home Navigation button
  const hubNav = document.getElementById('btn-hub-nav');
  if (hubNav) {
    hubNav.onclick = () => {
      sfx.playPop();
      memoryEngine.stopSandTimer();

      const welcomeScreen = document.getElementById('screen-welcome');
      const isWelcomeActive = welcomeScreen && welcomeScreen.classList.contains('active');
      const hasRegisteredName = game.player && game.player.name && game.player.name !== 'زائر';
      const nameInput = document.getElementById('input-child-name');
      const enteredName = nameInput ? nameInput.value.trim() : '';

      // If on welcome screen or playing without a registered name
      if (isWelcomeActive || !hasRegisteredName) {
        if (!enteredName || enteredName === 'زائر') {
          showCustomConfirm(
            "تنبيه تسجيل البطل 📝",
            "لم تقم بتسجيل اسمك بعد! هل ترغب في المتابعة كـ (زائر) أم كتابة اسمك لحفظ الأوسمة والإنجازات باسمك؟",
            "👤",
            "المتابعة كزائر 👤",
            "تسجيل اسمي ✏️",
            () => {
              sfx.init();
              sfx.playFanfare();
              game.createProfile("زائر", game.player.avatar);
              game.switchScreen('screen-hub');
            },
            () => {
              if (isWelcomeActive && nameInput) {
                nameInput.focus();
              } else {
                game.switchScreen('screen-welcome');
                setTimeout(() => {
                  const input = document.getElementById('input-child-name');
                  if (input) input.focus();
                }, 200);
              }
            }
          );
          return;
        } else {
          sfx.init();
          sfx.playFanfare();
          game.createProfile(enteredName, game.player.avatar);
          game.switchScreen('screen-hub');
          return;
        }
      }

      game.switchScreen('screen-hub');
    };
  }

  // Character selection in welcome screen
  const avatarOptions = document.querySelectorAll('.avatar-option');
  avatarOptions.forEach(opt => {
    opt.onclick = () => {
      avatarOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const val = opt.getAttribute('data-avatar');
      game.player.avatar = val;
      const miniAvatar = document.getElementById('mini-avatar');
      if (miniAvatar) miniAvatar.innerText = val === 'girl' ? '👧' : '👦';
    };
  });

  // Start Journey Button & Live typing sync
  const startBtn = document.getElementById('btn-start-journey');
  const nameInput = document.getElementById('input-child-name');

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      const typed = nameInput.value.trim();
      const miniName = document.getElementById('mini-name');
      const miniBadge = document.getElementById('player-profile-badge');
      if (miniBadge) miniBadge.style.display = 'flex';
      if (miniName) miniName.innerText = typed || (game.player ? game.player.name : 'زائر') || 'زائر';
    });
  }

  if (startBtn && nameInput) {
    startBtn.onclick = () => {
      const enteredName = nameInput.value.trim();

      if (!enteredName) {
        sfx.playPop();
        showCustomConfirm(
          "تنبيه تسجيل الاسم 📝",
          "لم تقم بإدخال اسمك يا بطل! هل ترغب في المتابعة كـ (زائر) أم كتابة اسمك لحفظ الأوسمة والشهادات باسمك؟",
          "👤",
          "المتابعة كزائر 👤",
          "تسجيل اسمي ✏️",
          () => {
            sfx.init();
            sfx.playFanfare();
            game.createProfile("زائر", game.player.avatar);
            game.switchScreen('screen-hub');
          },
          () => {
            nameInput.focus();
          }
        );
        return;
      }

      sfx.init();
      sfx.playFanfare();

      if (game.player && game.player.name && (game.player.completedLevels.length > 0 || game.player.hasanat > 0) && game.player.name === enteredName) {
        game.saveState();
      } else {
        game.createProfile(enteredName, game.player.avatar);
      }

      game.switchScreen('screen-hub');
    };
  }

  // Continue Journey Button for returning user
  const continueBtn = document.getElementById('btn-continue-journey');
  if (continueBtn) {
    continueBtn.onclick = () => {
      sfx.init();
      sfx.playFanfare();
      game.switchScreen('screen-hub');
    };
  }

  // Switch hero button
  const switchHeroBtn = document.getElementById('btn-switch-hero');
  if (switchHeroBtn) {
    switchHeroBtn.onclick = () => {
      sfx.playPop();
      const returningBox = document.getElementById('welcome-returning-box');
      const newForm = document.getElementById('welcome-new-user-form');
      if (returningBox) returningBox.style.display = 'none';
      if (newForm) newForm.style.display = 'block';

      const startBtnText = document.getElementById('start-btn-text');
      if (startBtnText) startBtnText.innerText = "حفظ ومتابعة المغامرة 🚀";
    };
  }

  // Hub Card Actions
  const cardHajj = document.getElementById('card-game-hajj');
  if (cardHajj) {
    cardHajj.onclick = () => {
      sfx.playPop();
      game.renderMap();
      game.switchScreen('screen-map');
    };
  }

  const cardMemory = document.getElementById('card-game-memory');
  if (cardMemory) {
    cardMemory.onclick = () => {
      sfx.playPop();
      game.switchScreen('screen-memory-levels');
    };
  }

  const cardStory = document.getElementById('card-game-story');
  if (cardStory) {
    cardStory.onclick = () => {
      sfx.playPop();
      game.switchScreen('screen-story-levels');
    };
  }

  const cardConquest = document.getElementById('card-game-conquest');
  if (cardConquest) {
    cardConquest.onclick = () => {
      sfx.playPop();
      game.switchScreen('screen-conquest-levels');
    };
  }

  // Back to Hub Buttons
  const mapToHub = document.getElementById('btn-map-to-hub');
  if (mapToHub) {
    mapToHub.onclick = () => {
      sfx.playPop();
      game.switchScreen('screen-hub');
    };
  }

  const memLevelsToHub = document.getElementById('btn-memory-levels-to-hub');
  if (memLevelsToHub) {
    memLevelsToHub.onclick = () => {
      sfx.playPop();
      game.switchScreen('screen-hub');
    };
  }

  const storyLevelsToHub = document.getElementById('btn-story-levels-to-hub');
  if (storyLevelsToHub) {
    storyLevelsToHub.onclick = () => {
      sfx.playPop();
      game.switchScreen('screen-hub');
    };
  }

  const conquestLevelsToHub = document.getElementById('btn-conquest-levels-to-hub');
  if (conquestLevelsToHub) {
    conquestLevelsToHub.onclick = () => {
      sfx.playPop();
      game.switchScreen('screen-hub');
    };
  }

  const btnConquestBackLevels = document.getElementById('btn-conquest-back-levels');
  if (btnConquestBackLevels) {
    btnConquestBackLevels.onclick = () => {
      sfx.playPop();
      game.switchScreen('screen-conquest-levels');
    };
  }

  // Conquest Certificate Modal buttons
  const closeConquestCert = document.getElementById('btn-close-conquest-cert');
  const closeConquestCertAction = document.getElementById('btn-close-conquest-cert-action');
  const conquestCertModal = document.getElementById('modal-conquest-certificate');
  const printConquestCertBtn = document.getElementById('btn-print-conquest-cert');
  const viewConquestCertBtn = document.getElementById('btn-view-conquest-certificate');

  const closeConquestCertHandler = () => {
    if (conquestCertModal) conquestCertModal.classList.remove('active');
    game.switchScreen('screen-conquest-levels');
  };

  if (closeConquestCert) closeConquestCert.onclick = closeConquestCertHandler;
  if (closeConquestCertAction) closeConquestCertAction.onclick = closeConquestCertHandler;

  if (viewConquestCertBtn) {
    viewConquestCertBtn.onclick = () => {
      sfx.playPop();
      game.showConquestCertificate();
    };
  }

  if (printConquestCertBtn) {
    printConquestCertBtn.onclick = () => window.print();
  }

  // Story Blocks Buttons
  const btnRollStory = document.getElementById('btn-roll-story-dice');
  if (btnRollStory) {
    btnRollStory.onclick = () => {
      storyEngine.rollDice();
    };
  }

  const btnStoryBackLevels = document.getElementById('btn-story-back-levels');
  if (btnStoryBackLevels) {
    btnStoryBackLevels.onclick = () => {
      sfx.playPop();
      game.switchScreen('screen-story-levels');
    };
  }

  // Story Certificate Modal buttons
  const closeStoryCert = document.getElementById('btn-close-story-cert');
  const closeStoryCertAction = document.getElementById('btn-close-story-cert-action');
  const storyCertModal = document.getElementById('modal-story-certificate');
  const printStoryCertBtn = document.getElementById('btn-print-story-cert');
  const viewStoryCertBtn = document.getElementById('btn-view-story-certificate');

  const closeStoryCertHandler = () => {
    if (storyCertModal) storyCertModal.classList.remove('active');
    game.switchScreen('screen-story-levels');
  };

  if (closeStoryCert) closeStoryCert.onclick = closeStoryCertHandler;
  if (closeStoryCertAction) closeStoryCertAction.onclick = closeStoryCertHandler;

  if (viewStoryCertBtn) {
    viewStoryCertBtn.onclick = () => {
      sfx.playPop();
      game.showStoryCertificate();
    };
  }

  if (printStoryCertBtn) {
    printStoryCertBtn.onclick = () => window.print();
  }

  // Memory Game Buttons
  const btnMemRestart = document.getElementById('btn-mem-restart');
  if (btnMemRestart) {
    btnMemRestart.onclick = () => {
      sfx.playPop();
      memoryEngine.startLevel(memoryEngine.currentLevel);
    };
  }

  const btnMemBackLevels = document.getElementById('btn-mem-back-levels');
  if (btnMemBackLevels) {
    btnMemBackLevels.onclick = () => {
      sfx.playPop();
      memoryEngine.stopSandTimer();
      game.switchScreen('screen-memory-levels');
    };
  }

  // Memory Certificate Modal buttons
  const closeMemCert = document.getElementById('btn-close-mem-cert');
  const closeMemCertAction = document.getElementById('btn-close-mem-cert-action');
  const memCertModal = document.getElementById('modal-memory-certificate');
  const printMemCertBtn = document.getElementById('btn-print-mem-cert');
  const viewMemCertBtn = document.getElementById('btn-view-memory-certificate');

  const closeMemCertHandler = () => {
    if (memCertModal) memCertModal.classList.remove('active');
    game.switchScreen('screen-memory-levels');
  };

  if (closeMemCert) closeMemCert.onclick = closeMemCertHandler;
  if (closeMemCertAction) closeMemCertAction.onclick = closeMemCertHandler;

  if (viewMemCertBtn) {
    viewMemCertBtn.onclick = () => {
      sfx.playPop();
      game.showMemoryCertificate();
    };
  }

  if (printMemCertBtn) {
    printMemCertBtn.onclick = () => window.print();
  }

  // Certificate Modal buttons
  const closeCert = document.getElementById('btn-close-certificate');
  const closeCertAction = document.getElementById('btn-close-cert-action');
  const certModal = document.getElementById('modal-certificate');
  const printCertBtn = document.getElementById('btn-print-cert');
  const viewCertMapBtn = document.getElementById('btn-view-certificate');

  const closeCertHandler = () => {
    if (certModal) certModal.classList.remove('active');
    game.renderMap();
    game.switchScreen('screen-map');
  };

  if (closeCert) closeCert.onclick = closeCertHandler;
  if (closeCertAction) closeCertAction.onclick = closeCertHandler;

  // Close modals when clicking on background overlay
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  if (viewCertMapBtn) {
    viewCertMapBtn.onclick = () => {
      sfx.playPop();
      game.showCertificate();
    };
  }

  if (printCertBtn) {
    printCertBtn.onclick = () => window.print();
  }

  // Auto load existing session on startup and jump directly to Hub for the first/active profile
  if (game.profiles.length > 0 || (game.player && game.player.name && (game.player.hasanat > 0 || game.player.completedLevels.length > 0 || game.player.id !== 'p_default'))) {
    if (game.profiles.length > 0 && (!game.player || !game.player.name)) {
      game.player = game.profiles[0];
      game.activeProfileId = game.player.id;
    }
    game.updateUI();
    game.switchScreen('screen-hub');
  }
});
