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
// DATA: MEMORY MATCH GAME (GAME 2: آية ومعنى - 30 مرحلة بترتيب المصحف)
// ==========================================================
const MEMORY_LEVELS_DATA = {
  1: {
    id: 1,
    surahNum: 1,
    title: "سورة الفاتحة (١)",
    timeLimit: 45,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m1_1", word: "الصِّرَاطَ الْمُسْتَقِيم", meaning: "طَرِيقُ الْحَقِّ وَالْجَنَّة", emoji: "🛣️" },
      { id: "m1_2", word: "الرَّحْمَٰن", meaning: "كَثِيرُ الرَّحْمَةِ بِخَلْقِهِ", emoji: "🤲" },
      { id: "m1_3", word: "يَوْمِ الدِّين", meaning: "يَوْمُ الحِسَابِ وَالجَزَاء", emoji: "⚖️" },
      { id: "m1_4", word: "الْمَغْضُوبِ عَلَيْهِم", meaning: "مَنْ عَرَفُوا الحَقَّ وَتَرَكُوه", emoji: "❌" }
    ]
  },
  2: {
    id: 2,
    surahNum: 83,
    title: "سورة المطففين (٨٣)",
    timeLimit: 60,
    hasanat: 60,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m83_1", word: "الْمُطَفِّفِين", meaning: "الَّذِينَ يَنْقُصُونَ فِي المِيزَان", emoji: "⚖️" },
      { id: "m83_2", word: "سِجِّين", meaning: "كِتَابٌ جَامِعٌ لِأَعْمَالِ الفُجَّار", emoji: "📕" },
      { id: "m83_3", word: "عِلِّيِّين", meaning: "مَكَانٌ عَالٍ فِيهِ دَرَجَاتُ الجَنَّة", emoji: "🏰" },
      { id: "m83_4", word: "الرَّحِيقِ الْمَخْتُوم", meaning: "شَرَابٌ طَيِّبٌ صَافٍ لِأَهْلِ الجَنَّة", emoji: "🥤" }
    ]
  },
  3: {
    id: 3,
    surahNum: 84,
    title: "سورة الانشقاق (٨٤)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m84_1", word: "انشَقَّت", meaning: "تَصَدَّعَتِ السَّمَاءُ يَوْمَ القِيَامَة", emoji: "⚡" },
      { id: "m84_2", word: "أَذِنَتْ لِرَبِّهَا", meaning: "اسْتَمَعَتْ وَأَطَاعَتْ أَمْرَ الله", emoji: "👂" },
      { id: "m84_3", word: "مَدَّت", meaning: "بُسِطَتِ الأَرْضُ وَاتَّسَعَت", emoji: "🗺️" },
      { id: "m84_4", word: "كَادِح", meaning: "سَاعٍ وَعَامِلٌ بِجِدٍّ وَتَعَب", emoji: "🏃" }
    ]
  },
  4: {
    id: 4,
    surahNum: 85,
    title: "سورة البروج (٨٥)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m85_1", word: "ذَاتِ الْبُرُوج", meaning: "السَّمَاءُ ذَاتُ مَنَازِلِ النُّجُوم", emoji: "🌌" },
      { id: "m85_2", word: "الْيَوْمِ الْمَوْعُود", meaning: "يَوْمُ القِيَامَةِ وَالحِسَاب", emoji: "📅" },
      { id: "m85_3", word: "الأُخْدُود", meaning: "الشَّقُّ العَظِيمُ فِي الأَرْض", emoji: "🕳️" },
      { id: "m85_4", word: "الْوَدُود", meaning: "المُحِبُّ لِعِبَادِهِ الصَّالِحِين", emoji: "❤️" }
    ]
  },
  5: {
    id: 5,
    surahNum: 86,
    title: "سورة الطارق (٨٦)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m86_1", word: "الطَّارِق", meaning: "النَّجْمُ المُضِيءُ اللَّامِعُ لَيْلًا", emoji: "⭐" },
      { id: "m86_2", word: "الثَّاقِب", meaning: "المُضِيءُ الَّذِي يَثْقُبُ الظَّلَام", emoji: "🔦" },
      { id: "m86_3", word: "رَجْع", meaning: "المَطَرُ يَرْجِعُ مَرَّةً بَعْدَ مَرَّة", emoji: "🌧️" },
      { id: "m86_4", word: "الصَّدْع", meaning: "انْشِقَاقُ الأَرْضِ بِالنَّبَات", emoji: "🌱" }
    ]
  },
  6: {
    id: 6,
    surahNum: 87,
    title: "سورة الأعلى (٨٧)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m87_1", word: "فَسَوَّى", meaning: "خَلَقَهُ فِي أَحْسَنِ هَيْئَةٍ وَإِتْقَان", emoji: "✨" },
      { id: "m87_2", word: "غُثَاءً أَحْوَى", meaning: "هَشِيمًا يَابِسًا أَسْوَد", emoji: "🍂" },
      { id: "m87_3", word: "الأَشْقَى", meaning: "الكَافِرُ المُعَانِدُ لِلْحَقّ", emoji: "🚫" },
      { id: "m87_4", word: "الصُّحُفِ الأُولَى", meaning: "كُتُبُ إِبْرَاهِيمَ وَمُوسَى", emoji: "📜" }
    ]
  },
  7: {
    id: 7,
    surahNum: 88,
    title: "سورة الغاشية (٨٨)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m88_1", word: "الْغَاشِيَة", meaning: "القِيَامَةُ تَغْشَى النَّاسَ بِأَهْوَالِهَا", emoji: "🌊" },
      { id: "m88_2", word: "خَاشِعَة", meaning: "ذَلِيلَةٌ خَاضِعَةٌ مِنَ الخَوْف", emoji: "😔" },
      { id: "m88_3", word: "عَيْنٍ آنِيَة", meaning: "عَيْنُ مَاءٍ شَدِيدَةُ الحَرَارَة", emoji: "♨️" },
      { id: "m88_4", word: "نَمَارِقُ مَصْفُوفَة", meaning: "وَسَائِدُ جَمِيلَةٌ لِلرَّاحَة", emoji: "🛋️" }
    ]
  },
  8: {
    id: 8,
    surahNum: 89,
    title: "سورة الفجر (٨٩)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m89_1", word: "وَلَيَالٍ عَشْر", meaning: "عَشْرُ ذِي الحِجَّةِ المُبَارَكَة", emoji: "🌙" },
      { id: "m89_2", word: "الشَّفْعِ وَالْوَتْر", meaning: "الزَّوْجُ وَالفَرْدُ مِنَ الأَعْدَاد", emoji: "🔢" },
      { id: "m89_3", word: "إِرَمَ ذَاتِ الْعِمَاد", meaning: "مَدِينَةُ قَوْمِ عَادٍ ذَاتِ الأَعْمِدَة", emoji: "🏛️" },
      { id: "m89_4", word: "جَابُوا الصَّخْر", meaning: "قَطَعُوا الصُّخُورَ وَنَحَتُوا البُيُوت", emoji: "🪨" }
    ]
  },
  9: {
    id: 9,
    surahNum: 90,
    title: "سورة البلد (٩٠)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m90_1", word: "كَبَد", meaning: "تَعَبٍ وَمَشَقَّةٍ فِي الدُّنْيَا", emoji: "🧗" },
      { id: "m90_2", word: "النَّجْدَيْن", meaning: "طَرِيقَيِ الخَيْرِ وَالشَّرّ", emoji: "🛣️" },
      { id: "m90_3", word: "الْعَقَبَة", meaning: "طَرِيقُ النَّجَاةِ بِالأَعْمَالِ الصَّالِحَة", emoji: "🏔️" },
      { id: "m90_4", word: "مَسْغَبَة", meaning: "مَجَاعَةٍ وَشِدَّةِ حَاجَة", emoji: "🥣" }
    ]
  },
  10: {
    id: 10,
    surahNum: 91,
    title: "سورة الشمس (٩١)",
    timeLimit: 50,
    hasanat: 70,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m91_1", word: "ضُحَاهَا", meaning: "إِشْرَاقُهَا وَنُورُهَا السَّاطِع", emoji: "🌞" },
      { id: "m91_2", word: "جَلَّاهَا", meaning: "أَظْهَرَهَا وَأَبَانَهَا لِلنَّاس", emoji: "✨" },
      { id: "m91_3", word: "طَحَاهَا", meaning: "بَسَطَهَا لِسُكْنَى الخَلْق", emoji: "🌍" },
      { id: "m91_4", word: "خَاب", meaning: "خَسِرَ وَهَلَكَ كُلَّ الخَسَارَة", emoji: "📉" }
    ]
  },
  11: {
    id: 11,
    surahNum: 92,
    title: "سورة الليل (٩٢)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m92_1", word: "يَغْشَى", meaning: "يُغَطِّي الكَوْنَ بِظَلَامِهِ", emoji: "🌑" },
      { id: "m92_2", word: "تَجَلَّى", meaning: "ظَهَرَ وَانْكَشَفَ ضِيَاؤُهُ", emoji: "☀️" },
      { id: "m92_3", word: "شَتَّى", meaning: "مُخْتَلِفَةٌ بَيْنَ الخَيْرِ وَالشَّرّ", emoji: "↔️" },
      { id: "m92_4", word: "تَلَظَّى", meaning: "تَتَوَقَّدُ وَتَلْتَهِبُ شِدَّةً", emoji: "🔥" }
    ]
  },
  12: {
    id: 12,
    surahNum: 93,
    title: "سورة الضحى (٩٣)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m93_1", word: "وَالضُّحَى", meaning: "وَقْتُ ارْتِفَاعِ الشَّمْسِ صَبَاحًا", emoji: "☀️" },
      { id: "m93_2", word: "سَجَى", meaning: "سَكَنَ وَأَظْلَمَ بِالهُدُوء", emoji: "🌌" },
      { id: "m93_3", word: "مَا وَدَّعَك", meaning: "مَا تَرَكَكَ رَبُّكَ وَمَا أَبْغَضَك", emoji: "🤍" },
      { id: "m93_4", word: "عَائِلاً", meaning: "فَقِيرًا فَأَغْنَاكَ اللهُ بِفَضْلِهِ", emoji: "🌾" }
    ]
  },
  13: {
    id: 13,
    surahNum: 94,
    title: "سورة الشرح (٩٤)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m94_1", word: "نَشْرَحْ لَكَ صَدْرَك", meaning: "نُنَوِّرْهُ وَنَفْسَحْهُ بِالإِيمَان", emoji: "💖" },
      { id: "m94_2", word: "وِزْرَك", meaning: "حِمْلَكَ وَثِقَلَك", emoji: "🎒" },
      { id: "m94_3", word: "أَنقَضَ ظَهْرَك", meaning: "أَثْقَلَ ظَهْرَك", emoji: "🏋️" },
      { id: "m94_4", word: "فَانصَب", meaning: "اجْتَهِدْ فِي الدُّعَاءِ وَالعِبَادَة", emoji: "🤲" }
    ]
  },
  14: {
    id: 14,
    surahNum: 95,
    title: "سورة التين (٩٥)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m95_1", word: "طُورِ سِينِين", meaning: "الجَبَلُ الَّذِي كَلَّمَ اللهُ عَلَيْهِ مُوسَى", emoji: "⛰️" },
      { id: "m95_2", word: "الْبَلَدِ الأَمِين", meaning: "مَكَّةُ المُكَرَّمَةُ المُبَارَكَة", emoji: "🕋" },
      { id: "m95_3", word: "أَحْسَنِ تَقْوِيم", meaning: "أَكْمَلِ وَأَجْمَلِ صُورَة", emoji: "🧍" },
      { id: "m95_4", word: "غَيْرُ مَمْنُون", meaning: "أَجْرٌ دَائِمٌ غَيْرُ مَقْطُوع", emoji: "💎" }
    ]
  },
  15: {
    id: 15,
    surahNum: 96,
    title: "سورة العلق (٩٦)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m96_1", word: "عَلَق", meaning: "قِطْعَةُ دَمٍ يَتَخَلَّقُ مِنْهَا الإِنْسَان", emoji: "🧬" },
      { id: "m96_2", word: "الأَكْرَم", meaning: "العَظِيمُ الَّذِي لَا يُسَاوِيهِ كَرِيم", emoji: "👑" },
      { id: "m96_3", word: "لَيَطْغَى", meaning: "يُجَاوِزُ الحَدَّ فِي العِصْيَان", emoji: "🚫" },
      { id: "m96_4", word: "الزَّبَانِيَة", meaning: "مَلَائِكَةُ العَذَابِ الأَقْوِيَاء", emoji: "⚡" }
    ]
  },
  16: {
    id: 16,
    surahNum: 97,
    title: "سورة القدر (٩٧)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m97_1", word: "لَيْلَةُ الْقَدْر", meaning: "لَيْلَةُ الشَّرَفِ وَنُزُولِ القُرْآن", emoji: "🌟" },
      { id: "m97_2", word: "أَلْفِ شَهْر", meaning: "عِبَادَةُ أَكْثَرَ مِنْ 83 سَنَة", emoji: "🌙" },
      { id: "m97_3", word: "الرُّوح", meaning: "جِبْرِيلُ عَلَيْهِ السَّلَام", emoji: "🕊️" },
      { id: "m97_4", word: "سَلَامٌ هِي", meaning: "أَمَانٌ وَخَيْرٌ وَبَرَكَةٌ كُلُّهَا", emoji: "🕊️" }
    ]
  },
  17: {
    id: 17,
    surahNum: 98,
    title: "سورة البينة (٩٨)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m98_1", word: "الْبَيِّنَة", meaning: "الحُجَّةُ الوَاضِحَةُ وَالقُرْآن", emoji: "📖" },
      { id: "m98_2", word: "قَيِّمَة", meaning: "مُسْتَقِيمَةٌ لَا عِوَجَ فِيهَا", emoji: "📐" },
      { id: "m98_3", word: "حُنَفَاء", meaning: "مُسْتَقِيمِينَ عَلَى التَّوْحِيد", emoji: "🕋" },
      { id: "m98_4", word: "بَرِيَّة", meaning: "الخَلَائِقُ وَالبَشَر", emoji: "🌍" }
    ]
  },
  18: {
    id: 18,
    surahNum: 99,
    title: "سورة الزلزلة (٩٩)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m99_1", word: "زِلْزَالَهَا", meaning: "حَرَكَتُهَا الشَّدِيدَةُ يَوْمَ القِيَامَة", emoji: "🌋" },
      { id: "m99_2", word: "أَثْقَالَهَا", meaning: "مَا فِي بَطْنِ الأَرْضِ مِنْ كُنُوزٍ وَمَوْتَى", emoji: "🌍" },
      { id: "m99_3", word: "مِثْقَالَ ذَرَّة", meaning: "أَقَلَّ شَيْءٍ كَالنَّمْلَةِ الصَّغِيرَة", emoji: "🐜" },
      { id: "m99_4", word: "أَشْتَاتًا", meaning: "فِرَقًا وَجَمَاعَاتٍ مُتَفَرِّقِينَ", emoji: "👥" }
    ]
  },
  19: {
    id: 19,
    surahNum: 100,
    title: "سورة العاديات (١٠٠)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m100_1", word: "الْعَادِيَاتِ ضَبْحًا", meaning: "الخَيْلُ الَّتِي تَرْكُضُ سَرِيعًا", emoji: "🐎" },
      { id: "m100_2", word: "فَالْمُورِيَاتِ قَدْحًا", meaning: "تُوقِدُ النَّارَ بِحَوَافِرِهَا", emoji: "✨" },
      { id: "m100_3", word: "فَالْمُغِيرَاتِ صُبْحًا", meaning: "تُهَاجِمُ الأَعْدَاءَ صَبَاحًا", emoji: "⚔️" },
      { id: "m100_4", word: "نَقْعًا", meaning: "غُبَارًا شَدِيدًا مُتَطَايِرًا", emoji: "💨" }
    ]
  },
  20: {
    id: 20,
    surahNum: 101,
    title: "سورة القارعة (١٠١)",
    timeLimit: 50,
    hasanat: 70,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m101_1", word: "الْقَارِعَة", meaning: "القِيَامَةُ تَقْرَعُ القُلُوبَ بِأَهْوَالِهَا", emoji: "🔔" },
      { id: "m101_2", word: "كَالْفَرَاشِ الْمَبْثُوث", meaning: "كَالفَرَاشِ المُنْتَشِرِ المُتَفَرِّق", emoji: "🦋" },
      { id: "m101_3", word: "كَالْعِهْنِ الْمَنفُوش", meaning: "كَالصُّوفِ المَنفُوشِ المُتَطَايِر", emoji: "☁️" },
      { id: "m101_4", word: "هَاوِيَة", meaning: "نَارُ جَهَنَّمَ العَمِيقَة", emoji: "🌋" }
    ]
  },
  21: {
    id: 21,
    surahNum: 102,
    title: "سورة التكاثر (١٠٢)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m102_1", word: "أَلْهَاكُم", meaning: "شَغَلَكُمْ عَنْ طَاعَةِ الله", emoji: "📱" },
      { id: "m102_2", word: "التَّكَاثُر", meaning: "التَّفَاخُرُ بِكَثْرَةِ الأَمْوَال", emoji: "💰" },
      { id: "m102_3", word: "زُرْتُمُ الْمَقَابِر", meaning: "صِرْتُمْ إِلَى القُبُورِ بَعْدَ المَوْت", emoji: "⚰️" },
      { id: "m102_4", word: "عَيْنَ الْيَقِين", meaning: "الرُّؤْيَةُ المُؤَكَّدَةُ بِالعَيْن", emoji: "👁️" }
    ]
  },
  22: {
    id: 22,
    surahNum: 103,
    title: "سورة العصر (١٠٣)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m103_1", word: "الْعَصْر", meaning: "الدَّهْرُ وَالزَّمَانُ كُلُّه", emoji: "⏰" },
      { id: "m103_2", word: "لَفِي خُسْر", meaning: "فِي خَسَارَةٍ وَنُقْصَان", emoji: "📉" },
      { id: "m103_3", word: "تَوَاصَوْا بِالْحَقّ", meaning: "أَوْصَى بَعْضُهُمْ بَعْضًا بِالخَيْر", emoji: "🤝" },
      { id: "m103_4", word: "تَوَاصَوْا بِالصَّبْر", meaning: "الحَثُّ عَلَى الصَّبْرِ وَالطَّاعَة", emoji: "💪" }
    ]
  },
  23: {
    id: 23,
    surahNum: 104,
    title: "سورة الهمزة (١٠٤)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m104_1", word: "هُمَزَة", meaning: "الَّذِي يَعِيبُ النَّاسَ بِالقَوْل", emoji: "🗣️" },
      { id: "m104_2", word: "لُمَزَة", meaning: "الَّذِي يَعِيبُ النَّاسَ بِالفِعْل", emoji: "👉" },
      { id: "m104_3", word: "الْحُطَمَة", meaning: "نَارٌ تُحَطِّمُ كُلَّ مَا يُلْقَى فِيهَا", emoji: "🔥" },
      { id: "m104_4", word: "عَمَدٍ مُّمَدَّدَة", meaning: "أَعْمِدَةٌ طَوِيلَةٌ مُغْلَقَة", emoji: "🏛️" }
    ]
  },
  24: {
    id: 24,
    surahNum: 105,
    title: "سورة الفيل (١٠٥)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m105_1", word: "أَبَابِيل", meaning: "طُيُورٌ مُتَتَابِعَةٌ جَمَاعَات", emoji: "🕊️" },
      { id: "m105_2", word: "سِجِّيل", meaning: "طِينٌ مُتَحَجِّرٌ شَدِيدُ الحَرَارَة", emoji: "🪨" },
      { id: "m105_3", word: "كَعَصْفٍ مَّأْكُول", meaning: "كَأَوْرَاقِ الشَّجَرِ المُمَزَّقَة", emoji: "🍂" },
      { id: "m105_4", word: "كَيْدَهُمْ فِي تَضْلِيل", meaning: "إِبْطَالُ مَكْرِهِمْ وَخَسَارَتُهُم", emoji: "🛡️" }
    ]
  },
  25: {
    id: 25,
    surahNum: 106,
    title: "سورة قريش (١٠٦)",
    timeLimit: 45,
    hasanat: 50,
    gridClass: "grid-3x2",
    pairs: [
      { id: "m106_1", word: "إِيلَافِهِم", meaning: "اعْتِيَادُهُمْ رِحْلَةَ التِّجَارَة", emoji: "🐫" },
      { id: "m106_2", word: "رِحْلَةَ الشِّتَاءِ وَالصَّيْف", meaning: "إِلَى اليَمَنِ وَالشَّام", emoji: "🗺️" },
      { id: "m106_3", word: "أَطْعَمَهُم مِّن جُوع", meaning: "رَزَقَهُمُ الأَمْنَ وَالغِذَاء", emoji: "🍞" }
    ]
  },
  26: {
    id: 26,
    surahNum: 107,
    title: "سورة الماعون (١٠٧)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m107_1", word: "يَدُعُّ الْيَتِيم", meaning: "يَدْفَعُ اليَتِيمَ بِقَسْوَة", emoji: "💔" },
      { id: "m107_2", word: "الْمَاعُون", meaning: "المَعُونَةُ كَالْمَاءِ وَالآنِيَة", emoji: "🏺" },
      { id: "m107_3", word: "يُرَاءُونَ", meaning: "يَعْمَلُونَ لِيَرَاهُمُ النَّاس", emoji: "👀" },
      { id: "m107_4", word: "سَاهُون", meaning: "غَافِلُونَ عَنْ صَلَاتِهِم", emoji: "⏳" }
    ]
  },
  27: {
    id: 27,
    surahNum: 108,
    title: "سورة الكوثر (١٠٨)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m108_1", word: "الْكَوْثَر", meaning: "نَهْرٌ عَظِيمٌ فِي الجَنَّة", emoji: "🌊" },
      { id: "m108_2", word: "فَانْحَرْ", meaning: "اذْبَحِ الأُضْحِيَةَ شُكْرًا لله", emoji: "🐑" },
      { id: "m108_3", word: "شَانِئَك", meaning: "مُبْغِضُكَ وَعَدُوُّك", emoji: "🚫" },
      { id: "m108_4", word: "الأَبْتَر", meaning: "المَقْطُوعُ مِنْ كُلِّ خَيْر", emoji: "🌿" }
    ]
  },
  28: {
    id: 28,
    surahNum: 112,
    title: "سورة الإخلاص (١١٢)",
    timeLimit: 45,
    hasanat: 50,
    gridClass: "grid-3x2",
    pairs: [
      { id: "m112_1", word: "الصَّمَد", meaning: "المَقْصُودُ فِي الحَوَائِج", emoji: "👑" },
      { id: "m112_2", word: "كُفُوًا أَحَد", meaning: "لَيْسَ لَهُ مَثِيلٌ أَوْ شَبِيه", emoji: "✨" },
      { id: "m112_3", word: "لَمْ يَلِد", meaning: "لَيْسَ لَهُ وَلَدٌ سُبْحَانَه", emoji: "🤍" }
    ]
  },
  29: {
    id: 29,
    surahNum: 113,
    title: "سورة الفلق (١١٣)",
    timeLimit: 50,
    hasanat: 50,
    gridClass: "grid-4x2",
    pairs: [
      { id: "m113_1", word: "الْفَلَق", meaning: "الصُّبْحُ وَضِيَاؤُهُ الجَمِيل", emoji: "🌅" },
      { id: "m113_2", word: "غَاسِقٍ إِذَا وَقَب", meaning: "اللَّيْلُ إِذَا أَظْلَمَ وَدَخَل", emoji: "🌑" },
      { id: "m113_3", word: "النَّفَّاثَات", meaning: "أَهْلُ الشَّرِّ وَالأَذَى", emoji: "🛡️" },
      { id: "m113_4", word: "حَاسِدٍ إِذَا حَسَد", meaning: "مَنْ يَتَمَنَّى زَوَالَ النِّعْمَة", emoji: "👁️" }
    ]
  },
  30: {
    id: 30,
    surahNum: 114,
    title: "سورة الناس (١١٤ - ختام المصحف 🏆)",
    timeLimit: 50,
    hasanat: 100,
    gridClass: "grid-3x2",
    pairs: [
      { id: "m114_1", word: "الْوَسْوَاس", meaning: "الشَّيْطَانُ الَّذِي يُلْقِي الشَّرّ", emoji: "😈" },
      { id: "m114_2", word: "الْخَنَّاس", meaning: "المُخْتَفِي عِنْدَ ذِكْرِ الله", emoji: "🛡️" },
      { id: "m114_3", word: "صُدُورِ النَّاس", meaning: "قُلُوبُ النَّاس", emoji: "❤️" }
    ]
  }
};

// ==========================================================
// ==========================================================
// DATA: MIRACLES & PROPHETS' STORIES GAME (GAME 3: معجزات وقصص الأنبياء - 30 مرحلة تاريخية)
// ==========================================================
const STORY_BLOCKS_DATA = {
  1: {
    id: 1,
    mapTitle: "١. سيدنا آدم",
    title: "١. سيدنا آدم عليه السلام (أبو البشر)",
    prophet: "سيدنا آدم عليه السلام",
    miracles: [
      { icon: "🌳", name: "شجرة الجنة" },
      { icon: "👑", name: "سجود الملائكة" },
      { icon: "📖", name: "الأسماء كلها" }
    ],
    hint: "أول إنسان خلقه الله من طين وعلمه الأسماء كلها وأسكنه الجنة!",
    moral: "سيدنا آدم عليه السلام خلقه الله بيده وعلمه الأسماء كلها، ولما تاب تاب الله عليه وهداه.",
    options: ["سيدنا آدم عليه السلام", "سيدنا نوح عليه السلام", "سيدنا إدريس عليه السلام", "سيدنا إبراهيم عليه السلام"],
    hasanat: 60
  },
  2: {
    id: 2,
    mapTitle: "٢. سيدنا إدريس",
    title: "٢. سيدنا إدريس عليه السلام",
    prophet: "سيدنا إدريس عليه السلام",
    miracles: [
      { icon: "✍️", name: "أول من خط بالقلم" },
      { icon: "🧵", name: "خياطة الثياب" },
      { icon: "⭐", name: "ورفعناه مكاناً علياً" }
    ],
    hint: "نبي كان أول من خط بالقلم وخاط الثياب ورفعه الله مكاناً علياً!",
    moral: "سيدنا إدريس عليه السلام كان صديقاً نبياً رفعه الله مكاناً علياً وبارك في علمه وعمله.",
    options: ["سيدنا إدريس عليه السلام", "سيدنا آدم عليه السلام", "سيدنا نوح عليه السلام", "سيدنا هود عليه السلام"],
    hasanat: 60
  },
  3: {
    id: 3,
    mapTitle: "٣. سيدنا نوح",
    title: "٣. سيدنا نوح عليه السلام (شيخ المرسلين)",
    prophet: "سيدنا نوح عليه السلام",
    miracles: [
      { icon: "🚢", name: "السفينة العظيمة" },
      { icon: "🌊", name: "طوفان النجاة" },
      { icon: "🕊️", name: "حمامة السلام" }
    ],
    hint: "صنع السفينة بأمر الله لإنقاذ المؤمنين من الطوفان العظيم وحمل فيها من كل زوجين اثنين!",
    moral: "سيدنا نوح عليه السلام شيخ المرسلين صبر في دعوة قومه 950 عاماً ونجاه الله والمؤمنين في الفلك المشحون.",
    options: ["سيدنا نوح عليه السلام", "سيدنا هود عليه السلام", "سيدنا صالح عليه السلام", "سيدنا يونس عليه السلام"],
    hasanat: 60
  },
  4: {
    id: 4,
    mapTitle: "٤. سيدنا هود",
    title: "٤. سيدنا هود عليه السلام (نبي عاد)",
    prophet: "سيدنا هود عليه السلام",
    miracles: [
      { icon: "🏛️", name: "إرم ذات العماد" },
      { icon: "💨", name: "ريح صرصر عاتية" },
      { icon: "🛡️", name: "نجاة المؤمنين" }
    ],
    hint: "أرسله الله إلى قوم عاد أصحاب الأبنية الشاهقة (إرم ذات العماد) وحذرهم من التكبر!",
    moral: "سيدنا هود عليه السلام دعا قوم عاد باللين فاستكبروا فأهلكهم الله بريح صرصر عاتية ونجى هود والمؤمنين.",
    options: ["سيدنا هود عليه السلام", "سيدنا صالح عليه السلام", "سيدنا شعيب عليه السلام", "سيدنا لوط عليه السلام"],
    hasanat: 60
  },
  5: {
    id: 5,
    mapTitle: "٥. سيدنا صالح",
    title: "٥. سيدنا صالح عليه السلام (ناقة الله)",
    prophet: "سيدنا صالح عليه السلام",
    miracles: [
      { icon: "🐪", name: "الناقة المعجزة" },
      { icon: "🪨", name: "الصخرة الصماء" },
      { icon: "💧", name: "قسمة الماء" }
    ],
    hint: "أخرج الله له ناقة عظيمة من بطن الصخرة لتكون آية لقوم ثمود!",
    moral: "سيدنا صالح عليه السلام أيده الله بمعجزة خروج الناقة العظيمة من الصخرة لها شرب يوم ولهم شرب يوم معلوم.",
    options: ["سيدنا صالح عليه السلام", "سيدنا هود عليه السلام", "سيدنا إبراهيم عليه السلام", "سيدنا إسماعيل عليه السلام"],
    hasanat: 60
  },
  6: {
    id: 6,
    mapTitle: "٦. سيدنا إبراهيم",
    title: "٦. سيدنا إبراهيم عليه السلام (خليل الرحمن)",
    prophet: "سيدنا إبراهيم عليه السلام",
    miracles: [
      { icon: "🔥", name: "النار برداً وسلاماً" },
      { icon: "🪓", name: "تحطيم الأصنام" },
      { icon: "⭐", name: "خليل الرحمن" }
    ],
    hint: "حطم الأصنام وألقي في النيران الموقدة فقال الله للنار: كوني برداً وسلاماً!",
    moral: "سيدنا إبراهيم خليل الرحمن إمام الحنفاء جعل الله النار عليه برداً وسلاماً وجعله للناس إماماً.",
    options: ["سيدنا إبراهيم عليه السلام", "سيدنا لوط عليه السلام", "سيدنا إسماعيل عليه السلام", "سيدنا إسحاق عليه السلام"],
    hasanat: 60
  },
  7: {
    id: 7,
    mapTitle: "٧. سيدنا إسماعيل",
    title: "٧. سيدنا إسماعيل عليه السلام (الذبيح)",
    prophet: "سيدنا إسماعيل عليه السلام",
    miracles: [
      { icon: "💧", name: "نبع ماء زمزم" },
      { icon: "🐑", name: "فداء الذبيح" },
      { icon: "🕋", name: "بناء الكعبة" }
    ],
    hint: "تفجر تحت قدميه ماء زمزم وفداه الله بكبش عظيم وساعد والده في رفع قواعد الكعبة!",
    moral: "سيدنا إسماعيل عليه السلام كان صادق الوعد، امتثل لأمر الله ففداه الله بذبح عظيم وشارك في بناء الكعبة المشرفة.",
    options: ["سيدنا إسماعيل عليه السلام", "سيدنا إسحاق عليه السلام", "سيدنا يعقوب عليه السلام", "سيدنا يوسف عليه السلام"],
    hasanat: 60
  },
  8: {
    id: 8,
    mapTitle: "٨. سيدنا إسحاق",
    title: "٨. سيدنا إسحاق عليه السلام",
    prophet: "سيدنا إسحاق عليه السلام",
    miracles: [
      { icon: "👶", name: "بشارة الملائكة" },
      { icon: "🌟", name: "نبي مبارك" },
      { icon: "🤲", name: "دعوة الخليل" }
    ],
    hint: "بشرت الملائكة به أمه سارة وأباه إبراهيم في كبرهما وبارك الله في نسله الصالح!",
    moral: "سيدنا إسحاق عليه السلام نبي مبارك من الصالحين آتاه الله الحكمة والنبوة وفضل أهله بالخير.",
    options: ["سيدنا إسحاق عليه السلام", "سيدنا يعقوب عليه السلام", "سيدنا يوسف عليه السلام", "سيدنا شعيب عليه السلام"],
    hasanat: 60
  },
  9: {
    id: 9,
    mapTitle: "٩. سيدنا لوط",
    title: "٩. سيدنا لوط عليه السلام",
    prophet: "سيدنا لوط عليه السلام",
    miracles: [
      { icon: "👼", name: "ضيوف الملائكة" },
      { icon: "🛡️", name: "نجاة الأهل المؤمنين" },
      { icon: "🌅", name: "موعدهم الصبح" }
    ],
    hint: "دعا قومه إلى الطهر والفضيلة وجاءته الملائكة بشارة بنجاته هو والمؤمنين!",
    moral: "سيدنا لوط عليه السلام نبي كريم ثبت على الحق ودعا إلى الفضيلة ونجاه الله والمؤمنين بفضله.",
    options: ["سيدنا لوط عليه السلام", "سيدنا هود عليه السلام", "سيدنا صالح عليه السلام", "سيدنا شعيب عليه السلام"],
    hasanat: 60
  },
  10: {
    id: 10,
    mapTitle: "١٠. سيدنا يعقوب",
    title: "١٠. سيدنا يعقوب عليه السلام (إسرائيل ⭐)",
    prophet: "سيدنا يعقوب عليه السلام",
    miracles: [
      { icon: "👁️", name: "ارتداد البصر بالقميص" },
      { icon: "🤲", name: "فصبر جميل" },
      { icon: "👕", name: "ريح يوسف" }
    ],
    hint: "صبر على فراق ولده صبراً جميلاً حتى فاح ريح يوسف وارتد بصيراً بقميصه!",
    moral: "سيدنا يعقوب عليه السلام ضرب أعظم مثل في حسن الظن بالله وقال: «إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ».",
    options: ["سيدنا يعقوب عليه السلام", "سيدنا يوسف عليه السلام", "سيدنا يونس عليه السلام", "سيدنا أيوب عليه السلام"],
    hasanat: 60
  },
  11: {
    id: 11,
    mapTitle: "١١. سيدنا يوسف",
    title: "١١. سيدنا يوسف عليه السلام (الصديق)",
    prophet: "سيدنا يوسف عليه السلام",
    miracles: [
      { icon: "🕳️", name: "الجب العظيم" },
      { icon: "🌾", name: "تأويل سنبلات الرؤيا" },
      { icon: "👑", name: "عزيز مصر" }
    ],
    hint: "ألقي في الجب وعبر الرؤيا بالسنبلات السبع ومكنه الله في الأرض وأصبح عزيز مصر!",
    moral: "سيدنا يوسف الصديق عليه السلام حفظه الله بحسن خلقه وعفته وعلمه تأويل الأحاديث وجمع شمل أسرته.",
    options: ["سيدنا يوسف عليه السلام", "سيدنا يونس عليه السلام", "سيدنا موسى عليه السلام", "سيدنا يحيى عليه السلام"],
    hasanat: 60
  },
  12: {
    id: 12,
    mapTitle: "١٢. سيدنا أيوب",
    title: "١٢. سيدنا أيوب عليه السلام (رمز الصبر)",
    prophet: "سيدنا أيوب عليه السلام",
    miracles: [
      { icon: "💧", name: "مغتسل بارد وشراب" },
      { icon: "✨", name: "الصبر الجميل" },
      { icon: "🌿", name: "رد العافية والأهل" }
    ],
    hint: "صبر على البلاء سنين طوالاً حتى أمره الله أن يركض برجله فنبع له ماء بارد شافٍ!",
    moral: "سيدنا أيوب عليه السلام إمام الصابرين نادى: «أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ» فاستجاب الله له وشفاه.",
    options: ["سيدنا أيوب عليه السلام", "سيدنا يعقوب عليه السلام", "سيدنا يونس عليه السلام", "سيدنا إلياس عليه السلام"],
    hasanat: 60
  },
  13: {
    id: 13,
    mapTitle: "١٣. سيدنا شعيب",
    title: "١٣. سيدنا شعيب عليه السلام (خطيب الأنبياء)",
    prophet: "سيدنا شعيب عليه السلام",
    miracles: [
      { icon: "⚖️", name: "إيفاء الكيل والميزان" },
      { icon: "🗣️", name: "خطيب الأنبياء" },
      { icon: "🌴", name: "أصحاب الأيكة" }
    ],
    hint: "خطيب الأنبياء الفصيح الذي دعا أهل مدين وأصحاب الأيكة لإقامة العدل وعدم بخس الناس أشياءهم!",
    moral: "سيدنا شعيب عليه السلام عرف بحسن بيانه وفصاحته ودعوته إلى الأمانة والعدل في المعاملات.",
    options: ["سيدنا شعيب عليه السلام", "سيدنا صالح عليه السلام", "سيدنا هود عليه السلام", "سيدنا موسى عليه السلام"],
    hasanat: 60
  },
  14: {
    id: 14,
    mapTitle: "١٤. سيدنا موسى",
    title: "١٤. سيدنا موسى عليه السلام (كليم الله)",
    prophet: "سيدنا موسى عليه السلام",
    miracles: [
      { icon: "🐍", name: "العصا المعجزة" },
      { icon: "🌊", name: "انفلاق البحر العظيم" },
      { icon: "✋", name: "اليد البيضاء المنيرة" }
    ],
    hint: "كليم الله الذي تحولت عصاه إلى ثعبان وضرب بها البحر فانفلق اثني عشر طريقاً يابساً!",
    moral: "سيدنا موسى كليم الله أيده الله بتسع آيات بينات ونجى بني إسرائيل وأغرق فرعون وجنوده.",
    options: ["سيدنا موسى عليه السلام", "سيدنا عيسى عليه السلام", "سيدنا هارون عليه السلام", "سيدنا يوشع عليه السلام"],
    hasanat: 60
  },
  15: {
    id: 15,
    mapTitle: "١٥. سيدنا هارون",
    title: "١٥. سيدنا هارون عليه السلام",
    prophet: "سيدنا هارون عليه السلام",
    miracles: [
      { icon: "🗣️", name: "فصاحة اللسان" },
      { icon: "🤝", name: "مؤازرة أخيه موسى" },
      { icon: "📜", name: "الرسالة والنبوة" }
    ],
    hint: "أخو كليم الله موسى، طلبه وزيراً ليكون عوناً له بلسانه الفصيح وقلبه النقي!",
    moral: "سيدنا هارون عليه السلام نبي كريم كان عضداً ووزيراً لأخيه موسى وداعياً إلى الله بالحكمة والرحمة.",
    options: ["سيدنا هارون عليه السلام", "سيدنا موسى عليه السلام", "سيدنا يوشع عليه السلام", "سيدنا إلياس عليه السلام"],
    hasanat: 60
  },
  16: {
    id: 16,
    mapTitle: "١٦. يوشع بن نون",
    title: "١٦. سيدنا يوشع بن نون عليه السلام",
    prophet: "سيدنا يوشع بن نون عليه السلام",
    miracles: [
      { icon: "☀️", name: "حبس الشمس في السماء" },
      { icon: "⚔️", name: "فتح الأرض المقدسة" },
      { icon: "🛡️", name: "نصر المؤمنين" }
    ],
    hint: "فتى موسى الذي فتح الله على يديه الأرض المقدسة وأمسك الله له الشمس حتى تم النصر!",
    moral: "سيدنا يوشع بن نون عليه السلام قاد المؤمنين بصدق وإخلاص وحبست له الشمس بأمر الله ليتحقق الفتح المبارك.",
    options: ["سيدنا يوشع بن نون عليه السلام", "سيدنا داود عليه السلام", "طالوت الملك", "سيدنا هارون عليه السلام"],
    hasanat: 60
  },
  17: {
    id: 17,
    mapTitle: "١٧. طالوت وداود",
    title: "١٧. قصة طالوت وجالوت وداود",
    prophet: "طالوت وسيدنا داود",
    miracles: [
      { icon: "💧", name: "ابتلاء نهر الماء" },
      { icon: "📦", name: "تابوت السكينة" },
      { icon: "🏹", name: "هزيمة الطاغية جالوت" }
    ],
    hint: "جيش امتحنهم الله بنهر ماء، وقتل داود في شبابه جالوت الطاغية بحجر ومقلاع!",
    moral: "«كَمْ مِنْ فِئَةٍ قَلِيلَةٍ غَلَبَتْ فِئَةً كَثِيرَةً بِإِذْنِ اللَّهِ وَاللَّهُ مَعَ الصَّابِرِينَ».",
    options: ["طالوت وسيدنا داود", "سيدنا سليمان عليه السلام", "سيدنا يوشع بن نون", "سيدنا موسى عليه السلام"],
    hasanat: 60
  },
  18: {
    id: 18,
    mapTitle: "١٨. سيدنا داود",
    title: "١٨. سيدنا داود عليه السلام (الملك النبي)",
    prophet: "سيدنا داود عليه السلام",
    miracles: [
      { icon: "🔨", name: "إلانة الحديد باليد" },
      { icon: "⛰️", name: "تسبيح الجبال معه" },
      { icon: "🛡️", name: "صناعة الدروع السابغة" }
    ],
    hint: "ألان الله له الحديد فكان يشكله بيده دون نار، وكانت الجبال والطيور تسبح معه بصوته الشجي!",
    moral: "سيدنا داود عليه السلام آتاه الله الملك والحكمة والزبور وكان يأكل من عمل يده ويصوم يوماً ويفطر يوماً.",
    options: ["سيدنا داود عليه السلام", "سيدنا سليمان عليه السلام", "سيدنا موسى عليه السلام", "سيدنا ذو الكفل عليه السلام"],
    hasanat: 60
  },
  19: {
    id: 19,
    mapTitle: "١٩. سيدنا سليمان",
    title: "١٩. سيدنا سليمان عليه السلام (الحكيم)",
    prophet: "سيدنا سليمان عليه السلام",
    miracles: [
      { icon: "🦅", name: "فهم منطق الطير" },
      { icon: "🐜", name: "وادي النمل" },
      { icon: "🌪️", name: "تسخير الريح والجن" }
    ],
    hint: "علم منطق الطير وسمع كلام النملة في واديها وسخر الله له الريح تجري بأمره شهراً ورواحها شهر!",
    moral: "سيدنا سليمان الحكيم عليه السلام آتاه الله ملكاً لا ينبغي لأحد من بعده وشكر نعم الله بتواضع وعبادة.",
    options: ["سيدنا سليمان عليه السلام", "سيدنا داود عليه السلام", "سيدنا يوسف عليه السلام", "سيدنا يونس عليه السلام"],
    hasanat: 60
  },
  20: {
    id: 20,
    mapTitle: "٢٠. سيدنا إلياس",
    title: "٢٠. سيدنا إلياس عليه السلام (محطة تميز ⭐)",
    prophet: "سيدنا إلياس عليه السلام",
    miracles: [
      { icon: "🌿", name: "الدعوة إلى الله وحده" },
      { icon: "🚫", name: "النهي عن صنم بعل" },
      { icon: "✨", name: "الثبات على الإيمان" }
    ],
    hint: "نبي كريم دعا قومه في بعلبك لترك عبادة الصنم (بعل) وإخلاص العبادة لله الخالق أحسن الخالقين!",
    moral: "سيدنا إلياس عليه السلام نادى قومه: «أَتَدْعُونَ بَعْلًا وَتَذَرُونَ أَحْسَنَ الْخَالِقِينَ» وخلد الله ذكره في الصالحين.",
    options: ["سيدنا إلياس عليه السلام", "سيدنا اليسع عليه السلام", "سيدنا زكريا عليه السلام", "سيدنا يحيى عليه السلام"],
    hasanat: 60
  },
  21: {
    id: 21,
    mapTitle: "٢١. سيدنا اليسع",
    title: "٢١. سيدنا اليسع عليه السلام",
    prophet: "سيدنا اليسع عليه السلام",
    miracles: [
      { icon: "✨", name: "متابعة رسالة النور" },
      { icon: "📜", name: "الهداية والبركة" },
      { icon: "🌟", name: "تفضيل الله على العالمين" }
    ],
    hint: "نبي كريم صاحب إلياس في دعوته وفضله الله بالرسالة والذكر الطيب في القرآن الكريم!",
    moral: "سيدنا اليسع عليه السلام أثنى الله عليه في القرآن الكريم وجعله من الأخيار المصطفين المهتدين.",
    options: ["سيدنا اليسع عليه السلام", "سيدنا إلياس عليه السلام", "سيدنا ذو الكفل عليه السلام", "سيدنا يونس عليه السلام"],
    hasanat: 60
  },
  22: {
    id: 22,
    mapTitle: "٢٢. سيدنا يونس",
    title: "٢٢. سيدنا يونس عليه السلام (ذو النون)",
    prophet: "سيدنا يونس عليه السلام",
    miracles: [
      { icon: "🐋", name: "الحوت العظيم" },
      { icon: "🌊", name: "ظلمات البحر الثلاث" },
      { icon: "🌿", name: "شجرة اليقطين الظليلة" }
    ],
    hint: "التقمه الحوت في ظلمات البحر فنادى: «لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ» فأنبته الله عند شجرة يقطين!",
    moral: "سيدنا يونس ذو النون عليه السلام نجاه الله بتسبيحه وإخلاصه وصار دعاؤه فرجاً لكل مكروب إلى يوم القيامة.",
    options: ["سيدنا يونس عليه السلام", "سيدنا نوح عليه السلام", "سيدنا هود عليه السلام", "سيدنا لوط عليه السلام"],
    hasanat: 60
  },
  23: {
    id: 23,
    mapTitle: "٢٣. سيدنا زكريا",
    title: "٢٣. سيدنا زكريا عليه السلام",
    prophet: "سيدنا زكريا عليه السلام",
    miracles: [
      { icon: "🤲", name: "دعاء المحراب الخفي" },
      { icon: "👶", name: "بشارة يحيى في الكبر" },
      { icon: "🤫", name: "آية صيام الكلام 3 أيام" }
    ],
    hint: "نادى ربه نداءً خفياً وهو شيخ كبير فبشرته الملائكة وهو قائم يصلي في المحراب بيحيى!",
    moral: "سيدنا زكريا عليه السلام علمنا ألا نيأس من رحمة الله فقال: «وَلَمْ أَكُنْ بِدُعَائِكَ رَبِّ شَقِيًّا» فوهبه الله يحيى وأصلح له زوجه.",
    options: ["سيدنا زكريا عليه السلام", "سيدنا يحيى عليه السلام", "سيدنا عيسى عليه السلام", "سيدنا إبراهيم عليه السلام"],
    hasanat: 60
  },
  24: {
    id: 24,
    mapTitle: "٢٤. سيدنا يحيى",
    title: "٢٤. سيدنا يحيى عليه السلام",
    prophet: "سيدنا يحيى عليه السلام",
    miracles: [
      { icon: "📜", name: "آتيناه الحكم صبياً" },
      { icon: "❤️", name: "حنان من الله وزكاة" },
      { icon: "🕊️", name: "بر الوالدين والتقوى" }
    ],
    hint: "نبي آتاه الله الحكمة والفهم وهو صبي وكان باراً بوالديه تقياً لم يكن جباراً عصياً!",
    moral: "سيدنا يحيى عليه السلام ضرب أعظم مثل في العفة والبر ونقاء القلب: «وَسَلَامٌ عَلَيْهِ يَوْمَ وُلِدَ وَيَوْمَ يَمُوتُ وَيَوْمَ يُبْعَثُ حَيًّا».",
    options: ["سيدنا يحيى عليه السلام", "سيدنا زكريا عليه السلام", "سيدنا عيسى عليه السلام", "سيدنا يوسف عليه السلام"],
    hasanat: 60
  },
  25: {
    id: 25,
    mapTitle: "٢٥. سيدنا ذو الكفل",
    title: "٢٥. سيدنا ذو الكفل عليه السلام (الصابر الأمين)",
    prophet: "سيدنا ذو الكفل عليه السلام",
    miracles: [
      { icon: "📜", name: "الوفاء بالعهد والشرط" },
      { icon: "⚖️", name: "القضاء بين الناس بالعدل" },
      { icon: "🤲", name: "قيام الليل وصيام النهار" }
    ],
    hint: "نبي كريم تكفل بالقيام بأمر قومه بالعدل وصبر على طاعة الله ونعته الله في القرآن بالصابرين الأخيار!",
    moral: "سيدنا ذو الكفل عليه السلام ضرب أعظم مثل في الوفاء بالعهود والصبر في طاعة الله وذكره الله مع إسماعيل وإدريس في الصالحين الأخيار.",
    options: ["سيدنا ذو الكفل عليه السلام", "سيدنا يحيى عليه السلام", "سيدنا زكريا عليه السلام", "سيدنا إلياس عليه السلام"],
    hasanat: 60
  },
  26: {
    id: 26,
    mapTitle: "٢٦. سيدنا عيسى",
    title: "٢٦. سيدنا عيسى عليه السلام (المسيح)",
    prophet: "سيدنا عيسى عليه السلام",
    miracles: [
      { icon: "👶", name: "الكلام في المهد صبياً" },
      { icon: "🕊️", name: "خلق الطير من الطين بإذن الله" },
      { icon: "👁️", name: "إبراء الأكمه والأبرص" }
    ],
    hint: "كلم الناس في المهد ونفخ في هيئة الطير فصار طيراً حياً وأبرأ المرضى وأحيا الموتى بإذن الله!",
    moral: "سيدنا عيسى ابن مريم عليه السلام رسول الله وكلمته أيده الله بروح القدس وبمعجزات باهرة تدعو إلى توحيد الله وحده.",
    options: ["سيدنا عيسى عليه السلام", "سيدنا يحيى عليه السلام", "سيدنا موسى عليه السلام", "سيدنا إبراهيم عليه السلام"],
    hasanat: 60
  },
  27: {
    id: 27,
    mapTitle: "٢٧. أصحاب الكهف",
    title: "٢٧. قصة أصحاب الكهف",
    prophet: "فتية أصحاب الكهف",
    miracles: [
      { icon: "⛰️", name: "كهف النور والأمان" },
      { icon: "⏳", name: "النوم 309 سنوات" },
      { icon: "🐕", name: "الكلب باسط ذراعيه بالوصيد" }
    ],
    hint: "فتية آمنوا بربهم فزادهم هدى وناموا في كهفهم ثلاثمائة سنين وازدادوا تسعاً!",
    moral: "قصة أصحاب الكهف برهان على قدرة الله في حفظ المؤمنين الصادقين وإحيائهم بعد رقاد طويل.",
    options: ["فتية أصحاب الكهف", "أصحاب الجنة", "أصحاب الأخدود", "أصحاب السفينة"],
    hasanat: 60
  },
  28: {
    id: 28,
    mapTitle: "٢٨. ذو القرنين",
    title: "٢٨. قصة الملك العادل ذو القرنين",
    prophet: "الملك ذو القرنين",
    miracles: [
      { icon: "🛡️", name: "بناء الردم من زبر الحديد" },
      { icon: "🔥", name: "صهر القطر والنحاس" },
      { icon: "🌍", name: "بلوغ مشارق الأرض ومغاربها" }
    ],
    hint: "ملك مؤمن مكن الله له في الأرض وبنى سداً عظيماً بين الجبلين من زبر الحديد والنحاس المذاب لحماية الضعفاء!",
    moral: "ذو القرنين مثل للحاكم المؤمن العادل الذي يسخر القوة والعلم لخدمة الخلق ونشر الخير والعدل.",
    options: ["الملك ذو القرنين", "سيدنا سليمان عليه السلام", "طالوت الملك", "الخضر عليه السلام"],
    hasanat: 60
  },
  29: {
    id: 29,
    mapTitle: "٢٩. أصحاب الفيل",
    title: "٢٩. حادثة أصحاب الفيل وحماية الكعبة",
    prophet: "حادثة عام الفيل (حماية الكعبة)",
    miracles: [
      { icon: "🐘", name: "امتناع الفيل محمود" },
      { icon: "🦅", name: "طير أبابيل" },
      { icon: "🪨", name: "حجارة من سجيل" }
    ],
    hint: "جاء أبرهة بجيش الأفيال لهدم الكعبة، فبرك الفيل وأرسل الله طيراً أبابيل أهلكت المعتدين كعصف مأكول!",
    moral: "حمى الله بيته الحرام بقدرته المطلقة وأرسل طيراً أبابيل وجعل كيد الظالمين في تضليل وبشارة لمولد نبينا محمد ﷺ.",
    options: ["حادثة عام الفيل (حماية الكعبة)", "فتح مكة المبارك", "غزوة الأحزاب", "حفر الخندق"],
    hasanat: 60
  },
  30: {
    id: 30,
    mapTitle: "٣٠. نبينا محمد ﷺ 🏆",
    title: "٣٠. سيدنا محمد ﷺ (خاتم المرسلين 🏆)",
    prophet: "سيدنا محمد ﷺ",
    miracles: [
      { icon: "📖", name: "القرآن الكريم المعجزة الخالدة" },
      { icon: "🌙", name: "انشقاق القمر بنصفين" },
      { icon: "🐎", name: "رحلة الإسراء والمعراج المباركة" }
    ],
    hint: "حبيب القلوب وخاتم النبيين، أنزل عليه القرآن هدى للعالمين وأسرى به إلى بيت المقدس وعرج به إلى سدرة المنتهى!",
    moral: "نبينا محمد ﷺ خير خلق الله وإمام المرسلين، أرسله الله رحمة للعالمين بالقرآن الكريم وهديه المنير الشفيع لأمته يوم القيامة.",
    options: ["سيدنا محمد ﷺ", "سيدنا إبراهيم عليه السلام", "سيدنا موسى عليه السلام", "سيدنا عيسى عليه السلام"],
    hasanat: 100
  }
};

// ==========================================================
// GAME 4 DATA: CONQUEST MAP & SAHABA HEROES (خريطة الفتوحات وسفراء الإسلام)
// ==========================================================
const CONQUEST_CAMPAIGNS_DATA = {
  1: {
    id: 1,
    mapTitle: "١. سفراء الدعوة",
    title: "المرحلة 1: سفير الإسلام الأول بالمدينة",
    desc: "وجّه سفير رسول الله ﷺ الأول ليعلم أهل يثرب القرآن ويمهد للهجرة المباركة!",
    hasanat: 60,
    cities: [
      { id: "madinah", name: "المدينة المنورة", icon: "🌴", x: 48, y: 35 },
      { id: "makkah", name: "مكة المكرمة", icon: "🕋", x: 68, y: 72 },
      { id: "abyssinia", name: "أرض الحبشة", icon: "⛵", x: 20, y: 75 }
    ],
    heroes: [
      {
        id: "musab",
        name: "مصعب بن عمير",
        title: "سفير الإسلام الأول",
        icon: "📜",
        targetCityId: "madinah",
        clue: "الشاب النبيل الذي ترك النعيم وهاجر ليعلم أهل يثرب القرآن فأسلم على يديه كبار الأنصار.",
        fact: "مهّد البطل مصعب بن عمير رضي الله عنه لهجرة النبي ﷺ وأسلم بسببه سعد بن معاذ وأسيد بن حضير."
      }
    ]
  },
  2: {
    id: 2,
    mapTitle: "٢. غزوة بدر الكبرى",
    title: "المرحلة 2: غزوة بدر الكبرى (يوم الفرقان)",
    desc: "وجّه أسد الله حمزة بن عبد المطلب إلى ساحة بدر لنصرة راية التوحيد!",
    hasanat: 60,
    cities: [
      { id: "badr", name: "بئر بدر الكبرى", icon: "⚔️", x: 42, y: 45 },
      { id: "makkah", name: "مكة المكرمة", icon: "🕋", x: 70, y: 75 },
      { id: "madinah", name: "المدينة المنورة", icon: "🌴", x: 48, y: 20 }
    ],
    heroes: [
      {
        id: "hamza_badr",
        name: "حمزة بن عبد المطلب",
        title: "أسد الله ورسوله",
        icon: "🦁",
        targetCityId: "badr",
        clue: "عم رسول الله ﷺ، برز في يوم الفرقان بريشة النعامة وقاتل ببسالة أذهلت الأعداء.",
        fact: "كانت معركة بدر أول انتصار حاسم للمسلمين سماه الله في القرآن (يوم الفرقان يوم التقى الجمعان)."
      }
    ]
  },
  3: {
    id: 3,
    mapTitle: "٣. غزوة أحد",
    title: "المرحلة 3: غزوة أحد وثبات الأبطال",
    desc: "وجّه الفارس الشجاع ذا العصابة الحمراء إلى جبل أحد لحماية راية الإسلام!",
    hasanat: 60,
    cities: [
      { id: "uhud", name: "جبل أحد", icon: "⛰️", x: 50, y: 40 },
      { id: "madinah", name: "قلب المدينة", icon: "🌴", x: 50, y: 72 },
      { id: "quba", name: "مسجد قباء", icon: "🕌", x: 22, y: 70 }
    ],
    heroes: [
      {
        id: "abu_dujanah",
        name: "أبو دجانة الأنصاري",
        title: "صاحب العصابة الحمراء",
        icon: "🛡️",
        targetCityId: "uhud",
        clue: "البطل الذي أخذ سيف رسول الله ﷺ بحقه وعصب رأسه بعصابته الحمراء مقبلاً غير مدبر.",
        fact: "سطر الصحابة أروع ملاحم الفداء في غزوة أحد دفاعاً عن رسول الله ﷺ."
      }
    ]
  },
  4: {
    id: 4,
    mapTitle: "٤. غزوة الخندق",
    title: "المرحلة 4: غزوة الخندق (يوم الأحزاب)",
    desc: "وجّه الحكيم سلمان الفارسي إلى موقع الخندق لحماية المدينة من الجيوش!",
    hasanat: 60,
    cities: [
      { id: "khandaq", name: "شمال المدينة (الخندق)", icon: "⛏️", x: 50, y: 30 },
      { id: "madinah_center", name: "حصون المدينة", icon: "🏰", x: 50, y: 65 },
      { id: "najd", name: "طريق نجد", icon: "⛺", x: 80, y: 45 }
    ],
    heroes: [
      {
        id: "salman_khandaq",
        name: "سلمان الفارسي",
        title: "صاحب فكرة الخندق",
        icon: "💡",
        targetCityId: "khandaq",
        clue: "أشار بحفر خندق عظيم لم تكن العرب تعرفه مما رد كيد جيوش الأحزاب خائبين.",
        fact: "قال النبي ﷺ عنه: (سلمان منا آل البيت) تقديراً لحكمته وإيمانه العميق."
      }
    ]
  },
  5: {
    id: 5,
    mapTitle: "٥. صلح الحديبية",
    title: "المرحلة 5: صلح الحديبية وبيعة الرضوان",
    desc: "وجّه سفير رسول الله ذو النورين إلى مكة لتبليغ رسالة السلام والهدى!",
    hasanat: 60,
    cities: [
      { id: "hudaibiyah", name: "سهل الحديبية", icon: "🤝", x: 38, y: 50 },
      { id: "makkah_holy", name: "مكة المكرمة", icon: "🕋", x: 68, y: 48 },
      { id: "jeddah", name: "سواحل جدة", icon: "⛵", x: 22, y: 75 }
    ],
    heroes: [
      {
        id: "othman_hudaibiyah",
        name: "عثمان بن عفان",
        title: "ذو النورين وسفير البيعة",
        icon: "📜",
        targetCityId: "makkah_holy",
        clue: "الصحابي الجليل الذي أرسله النبي ﷺ مفاوضاً لمكة فبايع الصحابة تحت الشجرة لأجله (بيعة الرضوان).",
        fact: "كان صلح الحديبية فتحاً مبيناً دخل بعده الناس في دين الله أفواجاً."
      }
    ]
  },
  6: {
    id: 6,
    mapTitle: "٦. فتح خيبر",
    title: "المرحلة 6: خيبر وفتح الحصون المنيعة",
    desc: "وجّه حامل الراية المنصورة علي بن أبي طالب لفتح حصن القموص المنيع!",
    hasanat: 60,
    cities: [
      { id: "khaybar_fort", name: "حصن خيبر المنيع", icon: "🏰", x: 50, y: 35 },
      { id: "fadak", name: "واحة فدك", icon: "🌴", x: 78, y: 30 },
      { id: "madinah", name: "المدينة المنورة", icon: "🕌", x: 48, y: 75 }
    ],
    heroes: [
      {
        id: "ali_khaybar",
        name: "علي بن أبي طالب",
        title: "فاتح حصون خيبر",
        icon: "🛡️",
        targetCityId: "khaybar_fort",
        clue: "أعطاه النبي ﷺ الراية وقال: (يفتح الله على يديه)، فقلع باب الحصن بشجاعة فائقة.",
        fact: "فُتحت حصون خيبر وحُقن الدم وأمّن المسلمون حدود دولتهم المباركة."
      }
    ]
  },
  7: {
    id: 7,
    mapTitle: "٧. معركة مؤتة",
    title: "المرحلة 7: معركة مؤتة والشهيد الطيار",
    desc: "وجّه القائد جعفر بن أبي طالب إلى أرض مؤتة في بلاد الشام لرفع راية الإسلام!",
    hasanat: 60,
    cities: [
      { id: "mutah_land", name: "أرض مؤتة (الأردن)", icon: "⚔️", x: 50, y: 30 },
      { id: "tabuk_pass", name: "ممر تبوك", icon: "⛺", x: 48, y: 65 },
      { id: "maan", name: "معان", icon: "🌴", x: 76, y: 55 }
    ],
    heroes: [
      {
        id: "jafar_mutah",
        name: "جعفر بن أبي طالب",
        title: "الشهيد الطيار ذو الجناحين",
        icon: "🕊️",
        targetCityId: "mutah_land",
        clue: "حمل الراية بكلتا يديه محتسباً حتى استشهد فأبدله الله جناحين يطير بهما في الجنة.",
        fact: "كانت معركة مؤتة أول مواجهة كبرى للمسلمين خارج الجزيرة العربية ضد جيوش الروم."
      }
    ]
  },
  8: {
    id: 8,
    mapTitle: "٨. خطة خالد بمؤتة",
    title: "المرحلة 8: حنكة سيف الله في مؤتة",
    desc: "وجّه القائد العبقري خالد بن الوليد لإنقاذ جيش المسلمين بحيلة عسكرية بارعة!",
    hasanat: 60,
    cities: [
      { id: "mutah_front", name: "جبهة مؤتة العسكرية", icon: "🛡️", x: 50, y: 32 },
      { id: "syria_desert", name: "بادية الشام", icon: "🏜️", x: 80, y: 40 },
      { id: "madinah_route", name: "طريق العودة للمدينة", icon: "🌴", x: 30, y: 75 }
    ],
    heroes: [
      {
        id: "khalid_mutah",
        name: "خالد بن الوليد",
        title: "سيف الله المسلول",
        icon: "⚔️",
        targetCityId: "mutah_front",
        clue: "استلم الراية بعد استشهاد القادة الثلاثة وغيّر ميمنة الجيش بميسرته وأنقذ الجيش بحنكة نادرة.",
        fact: "سماه النبي ﷺ يومئذ (سيف الله المسلول) تكريماً لذكائه العسكري وشجاعته."
      }
    ]
  },
  9: {
    id: 9,
    mapTitle: "٩. فتح مكة الأعظم",
    title: "المرحلة 9: فتح مكة الأعظم (النصر المبين)",
    desc: "وجّه مؤذن الرسول بلال بن رباح ليرفع أول أذان للتوحيد من فوق ظهر الكعبة!",
    hasanat: 60,
    cities: [
      { id: "kaaba_makkah", name: "الكعبة المشرفة", icon: "🕋", x: 50, y: 45 },
      { id: "safa_marwa", name: "الصفا والمروة", icon: "⛰️", x: 25, y: 65 },
      { id: "mina_valley", name: "وادي منى", icon: "⛺", x: 75, y: 60 }
    ],
    heroes: [
      {
        id: "bilal_conquest",
        name: "بلال بن رباح",
        title: "مؤذن الرسول ﷺ",
        icon: "🕌",
        targetCityId: "kaaba_makkah",
        clue: "أمره النبي ﷺ بالصعود فوق الكعبة يوم الفتح فصدح بـ (الله أكبر) معلناً نهاية عهد الأصنام.",
        fact: "دخل النبي ﷺ مكة خافضاً رأسه تواضعاً لله وعفا عن أهلها قائلاً: (اذهبوا فأنتم الطلقاء)."
      }
    ]
  },
  10: {
    id: 10,
    mapTitle: "١٠. غزوة حنين",
    title: "المرحلة 10: وادي حنين وثبات النبي ﷺ",
    desc: "وجّه العباس بن عبد المطلب لينادي في المسلمين ويعيد تنظيم الصفوف للنصر!",
    hasanat: 60,
    cities: [
      { id: "hunayn_valley", name: "وادي حنين", icon: "🏹", x: 50, y: 40 },
      { id: "taif_city", name: "مدينة الطائف", icon: "🏛️", x: 75, y: 65 },
      { id: "makkah_path", name: "طريق مكة", icon: "🕋", x: 25, y: 65 }
    ],
    heroes: [
      {
        id: "abbas_hunayn",
        name: "العباس بن عبد المطلب",
        title: "صاحب الصوت الجهوري",
        icon: "🗣️",
        targetCityId: "hunayn_valley",
        clue: "نادى بأمر النبي ﷺ: (يا أصحاب الشجرة! يا أصحاب السمرة!) فلبى الصحابة مسرعين وانقلبت الهزيمة نصراً.",
        fact: "علمتنا غزوة حنين أن النصر من عند الله وحده وليس بكثرة العدد."
      }
    ]
  },
  11: {
    id: 11,
    mapTitle: "١١. غزوة تبوك",
    title: "المرحلة 11: غزوة تبوك وتجهيز جيش العسرة",
    desc: "وجّه الصديق الأكبر أبا بكر لتجهيز جيش العسرة والمسير إلى تخوم الروم!",
    hasanat: 60,
    cities: [
      { id: "tabuk_fort", name: "واحة تبوك الشمالية", icon: "🌴", x: 50, y: 30 },
      { id: "hijr_valley", name: "مدائن صالح", icon: "🪨", x: 45, y: 55 },
      { id: "madinah_prophet", name: "المدينة المنورة", icon: "🕌", x: 50, y: 80 }
    ],
    heroes: [
      {
        id: "abubakr_tabuk",
        name: "أبو بكر الصديق",
        title: "الصديق الأكبر",
        icon: "💰",
        targetCityId: "tabuk_fort",
        clue: "جاء بماله كله صدقة لتجهيز الجيش فقال له النبي ﷺ: (ما أبقيت لأهلك؟) قال: (أبقيت لهم الله ورسوله).",
        fact: "أظهرت غزوة تبوك قوة الدولة الإسلامية وهيبة جيشها أمام الإمبراطورية البيزنطية."
      }
    ]
  },
  12: {
    id: 12,
    mapTitle: "١٢. معركة اليمامة",
    title: "المرحلة 12: معركة اليمامة وبطل حديقة الموت",
    desc: "وجّه البطل الشجاع البراء بن مالك لاقتحام حديقة اليمامة وتأمين الجزيرة!",
    hasanat: 60,
    cities: [
      { id: "yamama_garden", name: "حديقة اليمامة (نجد)", icon: "🏰", x: 50, y: 40 },
      { id: "riyadh_oasis", name: "واحة اليمامة", icon: "🌴", x: 75, y: 60 },
      { id: "bahrain_gulf", name: "سواحل البحرين", icon: "⛵", x: 80, y: 25 }
    ],
    heroes: [
      {
        id: "baraa_yamama",
        name: "البراء بن مالك",
        title: "فارس الاقتحام والشهادة",
        icon: "🏹",
        targetCityId: "yamama_garden",
        clue: "طلب من إخوانه أن يقذفوه بالمنجنيق فوق سور الحديقة ففتح الباب للمسلمين ببطولة خارقة.",
        fact: "استقر الإسلام وتوحدت الجزيرة العربية بعد معركة اليمامة الفاصلة."
      }
    ]
  },
  13: {
    id: 13,
    mapTitle: "١٣. ذات السلاسل",
    title: "المرحلة 13: معركة ذات السلاسل في العراق",
    desc: "وجّه سيف الله خالد بن الوليد إلى كاظمة لفتح أولى بوابات العراق وفارس!",
    hasanat: 60,
    cities: [
      { id: "kazimah_iraq", name: "كاظمة (شمال الخليج)", icon: "⛓️", x: 50, y: 35 },
      { id: "ubulla_port", name: "ميناء الأبلة (البصرة)", icon: "⚓", x: 75, y: 55 },
      { id: "kufa_land", name: "سهل الكوفة", icon: "🌾", x: 25, y: 65 }
    ],
    heroes: [
      {
        id: "khalid_chains",
        name: "خالد بن الوليد",
        title: "فاتح أرض العراق",
        icon: "⚔️",
        targetCityId: "kazimah_iraq",
        clue: "قاد معركة السلاسل التاريخية وحطم أعتى جيوش الفرس بعبقريته وسرعة مناوراته.",
        fact: "مهدت معركة ذات السلاسل لتحرير بلاد الرافدين ونشر رسالة العدل والتوحيد."
      }
    ]
  },
  14: {
    id: 14,
    mapTitle: "١٤. معركة أجنادين",
    title: "المرحلة 14: معركة أجنادين في فلسطين",
    desc: "وجّه داهية الإسلام عمرو بن العاص إلى أرض أجنادين لتحرير جنوب بلاد الشام!",
    hasanat: 60,
    cities: [
      { id: "ajnadayn_palestine", name: "سهل أجنادين (فلسطين)", icon: "🌴", x: 45, y: 38 },
      { id: "gaza_coast", name: "سواحل غزة", icon: "⛵", x: 20, y: 65 },
      { id: "jerusalem_hills", name: "تلال القدس", icon: "🕌", x: 65, y: 25 }
    ],
    heroes: [
      {
        id: "amr_ajnadayn",
        name: "عمرو بن العاص",
        title: "فاتح جنوب الشام",
        icon: "🛡️",
        targetCityId: "ajnadayn_palestine",
        clue: "القائد الذكي الذي هزم الرومان في معركة أجنادين وفتح مدن فلسطين الواحدة تلو الأخرى.",
        fact: "كانت معركة أجنادين مفتاح تحرير مدن فلسطين والتوجه نحو بيت المقدس."
      }
    ]
  },
  15: {
    id: 15,
    mapTitle: "١٥. فتح دمشق الفيحاء",
    title: "المرحلة 15: فتح دمشق الفيحاء وأمان الأمة",
    desc: "وجّه أمين الأمة أبا عبيدة بن الجراح إلى أسوار دمشق لدخولها صلحاً وأماناً!",
    hasanat: 60,
    cities: [
      { id: "damascus_gates", name: "أبواب دمشق الفيحاء", icon: "🏛️", x: 50, y: 35 },
      { id: "ghouta_oasis", name: "غوطة دمشق", icon: "🌳", x: 75, y: 60 },
      { id: "homs_city", name: "مدينة حمص", icon: "🏰", x: 30, y: 70 }
    ],
    heroes: [
      {
        id: "abu_ubaidah_damascus",
        name: "أبو عبيدة بن الجراح",
        title: "أمين هذه الأمة",
        icon: "🔑",
        targetCityId: "damascus_gates",
        clue: "القائد العام لجيوش الشام، دخل دمشق من الباب الشرقي صلحاً وأعطى أهلها الأمان والعدل.",
        fact: "ضرب المسلمون أروع أمثلة التسامح الديني والوفاء بالعهود في فتح دمشق."
      }
    ]
  },
  16: {
    id: 16,
    mapTitle: "١٦. معركة اليرموك",
    title: "المرحلة 16: معركة اليرموك الخالدة",
    desc: "وجّه البطل عكرمة بن أبي جهل إلى سهل اليرموك لقيادة كتيبة الفداء والنصر!",
    hasanat: 60,
    cities: [
      { id: "yarmouk_valley", name: "وادي اليرموك الفاصل", icon: "⚔️", x: 50, y: 35 },
      { id: "tiberias_lake", name: "بحيرة طبريا", icon: "🌊", x: 25, y: 60 },
      { id: "jordan_river", name: "نهر الأردن", icon: "💧", x: 70, y: 65 }
    ],
    heroes: [
      {
        id: "ikrimah_yarmouk",
        name: "عكرمة بن أبي جهل",
        title: "قائد كتيبة الفداء",
        icon: "🛡️",
        targetCityId: "yarmouk_valley",
        clue: "نادى في اليرموك: (من يبايع على الموت؟) فثبت مع 400 بطل وصنعوا معجزة النصر في تاريخ الإسلام.",
        fact: "أنهت معركة اليرموك الوجود البيزنطي في بلاد الشام إلى الأبد."
      }
    ]
  },
  17: {
    id: 17,
    mapTitle: "١٧. فتح بيت المقدس",
    title: "المرحلة 17: فتح القدس والعهدة العمرية",
    desc: "وجّه أمير المؤمنين عمر بن الخطاب إلى بيت المقدس لاستلام مفاتيح المسجد الأقصى!",
    hasanat: 60,
    cities: [
      { id: "jerusalem_aqsa", name: "المسجد الأقصى والقدس", icon: "🕌", x: 50, y: 35 },
      { id: "bethlehem", name: "بيت لحم", icon: "🏛️", x: 25, y: 65 },
      { id: "hebron", name: "مدينة الخليل", icon: "🌴", x: 75, y: 65 }
    ],
    heroes: [
      {
        id: "umar_quds",
        name: "عمر بن الخطاب",
        title: "الفاروق أمير المؤمنين",
        icon: "📜",
        targetCityId: "jerusalem_aqsa",
        clue: "دخل القدس ماشياً يقود دابته بثيابه المرقعة وكتب لأهلها (العهدة العمرية) أعظم وثيقة تسامح وحرية.",
        fact: "تسلم الفاروق مفاتيح القدس صلحاً وصلى في المسجد الأقصى المبارك."
      }
    ]
  },
  18: {
    id: 18,
    mapTitle: "١٨. معركة القادسية",
    title: "المرحلة 18: معركة القادسية الكبرى",
    desc: "وجّه القائد سعد بن أبي وقاص إلى أرض القادسية لكسر شوكة الإمبراطورية الساسانية!",
    hasanat: 60,
    cities: [
      { id: "qadisiyyah_plain", name: "أرض معركة القادسية", icon: "🏹", x: 50, y: 40 },
      { id: "euphrates_river", name: "شاطئ الفرات", icon: "🌊", x: 25, y: 65 },
      { id: "najaf_plateau", name: "هضبة النجف", icon: "🏜️", x: 75, y: 60 }
    ],
    heroes: [
      {
        id: "saad_qadisiyyah",
        name: "سعد بن أبي وقاص",
        title: "خال النبي وفارس القادسية",
        icon: "🏹",
        targetCityId: "qadisiyyah_plain",
        clue: "أول من رمى بسهم في سبيل الله، قاد المعركة بحكمة ودقة رغم مرضه حتى هزم رستم وجيشه.",
        fact: "فتحت القادسية الطريق لتحرير العراق وإيران وإسقاط دولة كسرى الظالمة."
      }
    ]
  },
  19: {
    id: 19,
    mapTitle: "١٩. فتح المدائن",
    title: "المرحلة 19: فتح المدائن وإيوان كسرى",
    desc: "وجّه الفارس المغوار القعقاع بن عمرو لعبور نهر دجلة ودخول قصر كسرى الأبيض!",
    hasanat: 60,
    cities: [
      { id: "madaen_palace", name: "إيوان كسرى بالمدائن", icon: "👑", x: 50, y: 35 },
      { id: "tigris_cross", name: "معبر نهر دجلة", icon: "🌊", x: 25, y: 60 },
      { id: "babylon_ruins", name: "آثار بابل", icon: "🏛️", x: 70, y: 70 }
    ],
    heroes: [
      {
        id: "qaqaa_madaen",
        name: "القعقاع بن عمرو",
        title: "الفارس الذي صوته بألف رجل",
        icon: "⚔️",
        targetCityId: "madaen_palace",
        clue: "خاض بفرسه نهر دجلة الهادر مع فرسان المسلمين ودخل إيوان كسرى ورفع راية التوحيد.",
        fact: "قال أبو بكر الصديق عنه: (لا يُهزم جيشٌ فيه مثل هذا)."
      }
    ]
  },
  20: {
    id: 20,
    mapTitle: "٢٠. معركة نهاوند",
    title: "المرحلة 20: معركة نهاوند (فتح الفتوح)",
    desc: "وجّه القائد النعمان بن مقرن المزني إلى جبال نهاوند لإنهاء الإمبراطورية الفارسية!",
    hasanat: 60,
    cities: [
      { id: "nahawand_mount", name: "جبال نهاوند الحصينة", icon: "🚩", x: 50, y: 35 },
      { id: "isfahan_road", name: "طريق أصفهان", icon: "🏜️", x: 75, y: 60 },
      { id: "hamadan_pass", name: "ممر همذان", icon: "⛰️", x: 25, y: 65 }
    ],
    heroes: [
      {
        id: "numan_nahawand",
        name: "النعمان بن مقرن",
        title: "شهيد فتح الفتوح",
        icon: "🗡️",
        targetCityId: "nahawand_mount",
        clue: "دعا الله: (اللهم انصر دينك واجعل النعمان أول شهيد اليوم)، فانتصر المسلمون وسُميت (فتح الفتوح).",
        fact: "بعد نهاوند تهاوت معاقل الساسانيين ودخلت شعوب فارس في دين الله نوراً وعدلاً."
      }
    ]
  },
  21: {
    id: 21,
    mapTitle: "٢١. حصن بابليون",
    title: "المرحلة 21: حصن بابليون في مصر",
    desc: "وجّه حواري رسول الله الزبير بن العوام لتسلق سور حصن بابليون والتكبير!",
    hasanat: 60,
    cities: [
      { id: "babylon_egypt", name: "حصن بابليون (القاهرة)", icon: "🧱", x: 50, y: 40 },
      { id: "nile_banks", name: "ضفاف نهر النيل", icon: "🌊", x: 20, y: 65 },
      { id: "ain_shams", name: "عين شمس", icon: "🏛️", x: 75, y: 60 }
    ],
    heroes: [
      {
        id: "zubair_babylon",
        name: "الزبير بن العوام",
        title: "حواري رسول الله",
        icon: "⚔️",
        targetCityId: "babylon_egypt",
        clue: "وضع سلماً وصعد بنفسه إلى أعلى الحصن وكبر بأعلى صوته فظن الروم أن الجيش كله داخل الحصن.",
        fact: "سقط حصن بابليون أعتى قلاع البيزنطيين في مصر وتهاوت قواتهم."
      }
    ]
  },
  22: {
    id: 22,
    mapTitle: "٢٢. فتح الإسكندرية",
    title: "المرحلة 22: فتح الإسكندرية وبناء الفسطاط",
    desc: "وجّه فاتح مصر عمرو بن العاص لتأمين الإسكندرية وبناء أول جامع في إفريقيا!",
    hasanat: 60,
    cities: [
      { id: "alexandria_sea", name: "منارة وثغر الإسكندرية", icon: "⚓", x: 30, y: 30 },
      { id: "fustat_mosque", name: "مدينة الفسطاط والجامع", icon: "🕌", x: 65, y: 60 },
      { id: "delta_nile", name: "دلتا مصر الخضراء", icon: "🌾", x: 50, y: 75 }
    ],
    heroes: [
      {
        id: "amr_egypt_full",
        name: "عمرو بن العاص",
        title: "فاتح أرض الكنانة",
        icon: "🌾",
        targetCityId: "alexandria_sea",
        clue: "أمّن أقباط مصر وأعاد بطريركهم بنيامين مكرماً وبنى مدينة الفسطاط وجامعه الشهير.",
        fact: "أصبحت مصر مركزاً لإشعاع الحضارة الإسلامية وانطلاق الفتوحات غرباً."
      }
    ]
  },
  23: {
    id: 23,
    mapTitle: "٢٣. ذات الصواري",
    title: "المرحلة 23: معركة ذات الصواري البحرية",
    desc: "وجّه القائد عبد الله بن أبي السرح لقيادة أول أسطول بحري إسلامي في البحر المتوسط!",
    hasanat: 60,
    cities: [
      { id: "masts_sea", name: "ميدان ذات الصواري البحري", icon: "⛵", x: 50, y: 35 },
      { id: "cyprus_isle", name: "جزيرة قبرص", icon: "🏝️", x: 75, y: 30 },
      { id: "alex_harbor", name: "ميناء الإسكندرية", icon: "⚓", x: 25, y: 65 }
    ],
    heroes: [
      {
        id: "sarh_sea",
        name: "عبد الله بن أبي السرح",
        title: "أمير الأسطول البحري",
        icon: "⚓",
        targetCityId: "masts_sea",
        clue: "ربط سفن المسلمين بسفن الروم وقاتلوا قتال الأبطال وانتصروا في أول معركة بحرية إسلامية كبرى.",
        fact: "كسرت معركة ذات الصواري الهيمنة البحرية للروم في البحر الأبيض المتوسط."
      }
    ]
  },
  24: {
    id: 24,
    mapTitle: "٢٤. تأسيس القيروان",
    title: "المرحلة 24: بناء القيروان في تونس",
    desc: "وجّه الفاتح عقبة بن نافع إلى تونس لبناء مدينة القيروان وجامعها الخالد!",
    hasanat: 60,
    cities: [
      { id: "kairouan_city", name: "مدينة القيروان العظيمة", icon: "🕌", x: 50, y: 40 },
      { id: "carthage_ruins", name: "قرطاجنة الساحلية", icon: "🏛️", x: 70, y: 25 },
      { id: "barqa_land", name: "برقة (ليبيا)", icon: "🌴", x: 25, y: 70 }
    ],
    heroes: [
      {
        id: "uqbah_kairouan",
        name: "عقبة بن نافع",
        title: "فاتح بلاد المغرب",
        icon: "🐎",
        targetCityId: "kairouan_city",
        clue: "غرس رمحه وقال: (هذا قيروانكم)، فبنى مدينة وجامع القيروان منارة لنشر الإسلام في المغرب العربي.",
        fact: "خاض بفرسه مياه المحيط الأطلسي شاهداً لله أنه بلغ أقصى ما تبلغه خيل الفاتحين."
      }
    ]
  },
  25: {
    id: 25,
    mapTitle: "٢٥. بلاد ما وراء النهر",
    title: "المرحلة 25: فتح بلاد ما وراء النهر وبخارى",
    desc: "وجّه القائد قتيبة بن مسلم الباهلي لعبور نهر جيحون وفتح بخارى وسمرقند!",
    hasanat: 60,
    cities: [
      { id: "bukhara_samarkand", name: "بخارى وسمرقند العريقة", icon: "🌟", x: 50, y: 35 },
      { id: "oxus_river", name: "نهر جيحون", icon: "🌊", x: 25, y: 60 },
      { id: "kashgar_border", name: "حدود كاشغر والصين", icon: "🏔️", x: 78, y: 30 }
    ],
    heroes: [
      {
        id: "qutaybah_asia",
        name: "قتيبة بن مسلم",
        title: "فاتح آسيا الوسطى",
        icon: "🏹",
        targetCityId: "bukhara_samarkand",
        clue: "فتح مدن طريق الحرير العظيمة ودخلت شعوب آسيا الوسطى في الإسلام ونبغ منهم كبار علماء الأمة.",
        fact: "خرجت من هذه الديار قامات إسلامية كبرى كالإمام البخاري والخوارزمي والترمذي."
      }
    ]
  },
  26: {
    id: 26,
    mapTitle: "٢٦. فتح بلاد السند",
    title: "المرحلة 26: فتح بلاد السند والهند",
    desc: "وجّه القائد الشاب محمد بن القاسم الثقفي لفتح بلاد السند ونشر رسالة العدل!",
    hasanat: 60,
    cities: [
      { id: "indus_debal", name: "ميناء الديبل ووادي السند", icon: "🏹", x: 50, y: 40 },
      { id: "multan_city", name: "مدينة ملتان", icon: "🏛️", x: 75, y: 25 },
      { id: "makran_coast", name: "سواحل مكران", icon: "⚓", x: 25, y: 65 }
    ],
    heroes: [
      {
        id: "qasim_sindh",
        name: "محمد بن القاسم",
        title: "القائد الشاب الفاتح",
        icon: "🏹",
        targetCityId: "indus_debal",
        clue: "فتح بلاد السند وهو لم يتجاوز السابعة عشرة من عمره بعدل وحكمة أحبته بها شعوب الهند.",
        fact: "دخل الإسلام شبه القارة الهندية بفضل حسن أخلاق المسلمين وعدلهم."
      }
    ]
  },
  27: {
    id: 27,
    mapTitle: "٢٧. فتح المغرب الأقصى",
    title: "المرحلة 27: فتح طنجة والمغرب الأقصى",
    desc: "وجّه الوالي موسى بن نصير لتأمين شواطئ المغرب الأقصى وبناء قواعد الدعوة!",
    hasanat: 60,
    cities: [
      { id: "tangier_coast", name: "مضيق وطنجة المغربية", icon: "🛡️", x: 50, y: 35 },
      { id: "sus_plains", name: "سهول السوس الأقصى", icon: "🌴", x: 25, y: 65 },
      { id: "fez_valley", name: "وادي فاس", icon: "🏛️", x: 75, y: 60 }
    ],
    heroes: [
      {
        id: "musa_maghreb",
        name: "موسى بن نصير",
        title: "ناشر الإسلام بالمغرب",
        icon: "📜",
        targetCityId: "tangier_coast",
        clue: "وحّد قبائل المغرب وعلمهم القرآن وأعد جيش الفتح للانطلاق نحو شبه الجزيرة الأيبيرية.",
        fact: "تحول أهل المغرب إلى جنود للإسلام وقادة فتحوا الأندلس وحملوا راية الحضارة."
      }
    ]
  },
  28: {
    id: 28,
    mapTitle: "٢٨. فتح الأندلس",
    title: "المرحلة 28: فتح الأندلس وجبل طارق",
    desc: "وجّه القائد البطل طارق بن زياد لعبور البحر وفتح بلاد الأندلس (إسبانيا)! ",
    hasanat: 60,
    cities: [
      { id: "gibraltar_rock", name: "جبل طارق وقرطبة", icon: "🏔️", x: 50, y: 35 },
      { id: "toledo_capital", name: "طليطلة عاصمة القوط", icon: "🏰", x: 70, y: 25 },
      { id: "seville_plain", name: "سهل إشبيلية", icon: "🌾", x: 25, y: 65 }
    ],
    heroes: [
      {
        id: "tariq_andalus",
        name: "طارق بن زياد",
        title: "فاتح بلاد الأندلس",
        icon: "⚔️",
        targetCityId: "gibraltar_rock",
        clue: "عبر المضيق الشهير باسمه حتى اليوم وهزم جيوش القوط وأسس دولة النور والحضارة في أوروبا.",
        fact: "استمرت الحضارة الأندلسية قروناً طويلة أضاءت فيها أوروبا بعلوم الطب والفلك والرياضيات."
      }
    ]
  },
  29: {
    id: 29,
    mapTitle: "٢٩. بلاط الشهداء",
    title: "المرحلة 29: معركة بلاط الشهداء في فرنسا",
    desc: "وجّه القائد عبد الرحمن الغافقي إلى سهول بواتييه بفرنسا لثبات فرسان الإسلام!",
    hasanat: 60,
    cities: [
      { id: "poitiers_plain", name: "سهل بواتييه (فرنسا)", icon: "⚔️", x: 50, y: 35 },
      { id: "tours_city", name: "مدينة تور", icon: "🏛️", x: 75, y: 30 },
      { id: "pyrenees_mount", name: "جبال البرانس", icon: "⛰️", x: 30, y: 70 }
    ],
    heroes: [
      {
        id: "ghafiqi_france",
        name: "عبد الرحمن الغافقي",
        title: "شهيد بلاط الشهداء",
        icon: "🛡️",
        targetCityId: "poitiers_plain",
        clue: "قاد الفرسان حتى وسط فرنسا بالقرب من باريس واستشهد في معركة بلاط الشهداء الخالدة.",
        fact: "وصل المسلمون إلى قلب القارة الأوروبية ناشرين روح العدالة والشهامة."
      }
    ]
  },
  30: {
    id: 30,
    mapTitle: "٣٠. فتح القسطنطينية 🏆",
    title: "المرحلة 30: فتح القسطنطينية (بشارة المصطفى ﷺ 🏆)",
    desc: "وجّه السلطان الشاب محمد الفاتح لفتح القسطنطينية وتحقيق بشارة النبي ﷺ الخالدة!",
    hasanat: 100,
    cities: [
      { id: "constantinople_walls", name: "أسوار القسطنطينية وإسطنبول", icon: "🏰", x: 50, y: 35 },
      { id: "golden_horn", name: "مضيق القرن الذهبي", icon: "⚓", x: 75, y: 55 },
      { id: "bosphorus_strait", name: "مضيق البوسفور", icon: "🌊", x: 25, y: 65 }
    ],
    heroes: [
      {
        id: "fatih_sultan",
        name: "محمد الفاتح",
        title: "نعم الأمير أميرها",
        icon: "👑",
        targetCityId: "constantinople_walls",
        clue: "نقل السفن فوق اليابسة واخترق أسوار المدينة المنيعة في سن الـ 21 محققاً بشارة النبي ﷺ.",
        fact: "قال النبي ﷺ: (لتفتحن القسطنطينية، فلنعم الأمير أميرها، ولنعم الجيش ذلك الجيش)."
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
      if (levelNum < 30) {
        nextBtn.querySelector('span').innerText = "المحطة القرآنية التالية ➔";
        nextBtn.onclick = () => {
          modal.classList.remove('active');
          memoryEngine.startLevel(levelNum + 1);
        };
      } else {
        nextBtn.querySelector('span').innerText = "📜 استلم شهادة حافظ كلمات القرآن";
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
    if (desc) desc.innerText = `أتممت ${lvl.title} وتعرفت على أنوار وسيرة النبي الكريم ببراعة!`;
    if (rewardVal) rewardVal.innerText = `+${earned} حسنة`;
    if (stampName) stampName.innerText = `✨ وسام راوي المعجزات`;

    if (modal) modal.classList.add('active');

    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) {
      if (levelNum < 30) {
        nextBtn.querySelector('span').innerText = "المرحلة التالية ➔";
        nextBtn.onclick = () => {
          modal.classList.remove('active');
          storyEngine.startLevel(levelNum + 1);
        };
      } else {
        nextBtn.querySelector('span').innerText = "📜 استلم وسام وشهادة راوي المعجزات";
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
        this.renderStoryLevelsScreen();
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
      if (levelNum < 30) {
        nextBtn.querySelector('span').innerText = "المرحلة التالية ➔";
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
        this.renderConquestLevelsScreen();
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
    const board = document.getElementById('conquest-levels-list');
    if (!board) return;
    board.innerHTML = '';

    const completed = this.player.completedConquestLevels || [];
    const completedCount = completed.length;
    const totalLevels = 30;

    // 1. Update Conquest Progress HUD
    const progText = document.getElementById('conquest-map-progress-text');
    const progFill = document.getElementById('conquest-map-progress-fill');
    const starsHud = document.getElementById('conquest-map-stars-count');
    
    if (progText) progText.innerText = `${completedCount} / ${totalLevels}`;
    if (progFill) {
      const pct = Math.min(100, Math.round((completedCount / totalLevels) * 100));
      progFill.style.width = `${pct}%`;
    }
    if (starsHud) starsHud.innerText = completedCount * 3;

    // 2. Calculate smooth S-curve coordinates for 30 levels (Clean generous spacing)
    const totalHeight = 4800;
    const startY = 4650;
    const endY = 150;
    const stepY = (startY - endY) / (totalLevels - 1);

    const points = [];
    for (let i = 1; i <= totalLevels; i++) {
      const y = startY - (i - 1) * stepY;
      const x = 200 + 85 * Math.sin((i - 1) * 0.85);
      points.push({ lvlNum: i, x: Math.round(x), y: Math.round(y) });
    }

    // 3. Build Smooth Bezier Road Path SVG
    let roadPathD = `M ${points[0].x} ${points[0].y}`;
    for (let k = 0; k < points.length - 1; k++) {
      const p0 = points[k];
      const p1 = points[k + 1];
      const midY = (p0.y + p1.y) / 2;
      roadPathD += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }

    const svgRoadHTML = `
      <svg class="quran-map-road-svg" width="100%" height="${totalHeight}" viewBox="0 0 400 ${totalHeight}" preserveAspectRatio="none">
        <!-- River stream across level 15 -->
        <path class="river-stream-path" d="M -20 2400 Q 120 2360, 200 2410 T 420 2380" />
        
        <!-- Road Outer Border -->
        <path class="road-outer-border" style="stroke:#047857;" d="${roadPathD}" />
        <!-- Road Main Emerald Track -->
        <path class="road-main-track" style="stroke:#10b981;" d="${roadPathD}" />
        <!-- Road Center Dashed Line -->
        <path class="road-inner-dash" style="stroke:#ecfdf5;" d="${roadPathD}" />
      </svg>
    `;

    board.innerHTML = svgRoadHTML;

    // 4. Add Pure Background Ambient Scenery Icons
    const sceneryItems = [
      { x: 35, y: 4700, icon: '📜' },
      { x: 365, y: 4350, icon: '⚔️' },
      { x: 35, y: 3950, icon: '🛡️' },
      { x: 365, y: 3550, icon: '⛏️' },
      { x: 35, y: 3150, icon: '🏰' },
      { x: 365, y: 2750, icon: '🕊️' },
      { x: 200, y: 2400, icon: '🌉' },
      { x: 35, y: 2000, icon: '👑' },
      { x: 365, y: 1550, icon: '⛵' },
      { x: 35, y: 1100, icon: '🐎' },
      { x: 365, y: 650, icon: '🏔️' },
      { x: 200, y: 60, icon: '🏆' }
    ];

    sceneryItems.forEach(sc => {
      const deco = document.createElement('div');
      deco.className = 'map-scenery-deco';
      deco.style.left = `${(sc.x / 400) * 100}%`;
      deco.style.top = `${sc.y}px`;
      deco.innerHTML = `<span class="map-scenery-icon">${sc.icon}</span>`;
      board.appendChild(deco);
    });

    // 5. Render 30 Interactive Game Level Nodes
    points.forEach(p => {
      const lvlNum = p.lvlNum;
      const lvlData = CONQUEST_CAMPAIGNS_DATA[lvlNum];
      if (!lvlData) return;

      const isDone = completed.includes(lvlNum);
      const isUnlocked = lvlNum === 1 || completed.includes(lvlNum - 1);
      const isCurrent = isUnlocked && !isDone;

      const nodeElem = document.createElement('div');
      nodeElem.className = `quran-map-node-item ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
      nodeElem.style.left = `${(p.x / 400) * 100}%`;
      nodeElem.style.top = `${p.y}px`;

      // 3 Stars floating on top for completed levels
      let topStarsHTML = '';
      if (isDone) {
        topStarsHTML = `<div class="node-top-stars">⭐⭐⭐</div>`;
      } else if (isCurrent) {
        topStarsHTML = `<div class="node-active-marker" style="background:#059669; border-color:#34d399;">العب هنا 🚩</div>`;
      }

      // Inner Icon/Number
      let innerIcon = `${lvlNum}`;
      if (isDone) {
        innerIcon = '🚩';
      } else if (!isUnlocked) {
        innerIcon = '🔒';
      }

      nodeElem.innerHTML = `
        ${topStarsHTML}
        <div class="node-3d-btn" style="${isDone ? 'background:linear-gradient(180deg, #10b981, #047857);' : ''}">
          <span class="node-inner-num">${innerIcon}</span>
        </div>
        <div class="node-surah-pill" style="border-color:#10b981; color:#065f46;">
          ${lvlData.mapTitle || lvlData.title}
        </div>
      `;

      if (isUnlocked) {
        nodeElem.onclick = () => {
          sfx.playPop();
          conquestEngine.startLevel(lvlNum);
        };
      }

      board.appendChild(nodeElem);
    });

    // 6. Update Certificate Button Visibility
    const certBtn = document.getElementById('btn-view-conquest-certificate');
    if (certBtn) {
      certBtn.style.display = (completed.length >= totalLevels) ? 'block' : 'none';
    }

    // 7. Auto-scroll to Current Level in Viewport
    setTimeout(() => {
      const viewport = document.getElementById('conquest-world-map-viewport');
      const activeNode = document.querySelector('#conquest-levels-list .quran-map-node-item.current') || document.querySelector('#conquest-levels-list .quran-map-node-item');
      if (viewport && activeNode) {
        const topPos = activeNode.offsetTop - viewport.clientHeight / 2;
        viewport.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
      }
    }, 150);
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
    const board = document.getElementById('story-levels-list');
    if (!board) return;
    board.innerHTML = '';

    const completed = this.player.completedStoryLevels || [];
    const completedCount = completed.length;
    const totalLevels = 30;

    // 1. Update Story Progress HUD
    const progText = document.getElementById('story-map-progress-text');
    const progFill = document.getElementById('story-map-progress-fill');
    const starsHud = document.getElementById('story-map-stars-count');
    
    if (progText) progText.innerText = `${completedCount} / ${totalLevels}`;
    if (progFill) {
      const pct = Math.min(100, Math.round((completedCount / totalLevels) * 100));
      progFill.style.width = `${pct}%`;
    }
    if (starsHud) starsHud.innerText = completedCount * 3;

    // 2. Calculate smooth S-curve coordinates for 30 levels (Clean generous spacing)
    const totalHeight = 4800;
    const startY = 4650;
    const endY = 150;
    const stepY = (startY - endY) / (totalLevels - 1);

    const points = [];
    for (let i = 1; i <= totalLevels; i++) {
      const y = startY - (i - 1) * stepY;
      const x = 200 + 85 * Math.sin((i - 1) * 0.85);
      points.push({ lvlNum: i, x: Math.round(x), y: Math.round(y) });
    }

    // 3. Build Smooth Bezier Road Path SVG
    let roadPathD = `M ${points[0].x} ${points[0].y}`;
    for (let k = 0; k < points.length - 1; k++) {
      const p0 = points[k];
      const p1 = points[k + 1];
      const midY = (p0.y + p1.y) / 2;
      roadPathD += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }

    const svgRoadHTML = `
      <svg class="quran-map-road-svg" width="100%" height="${totalHeight}" viewBox="0 0 400 ${totalHeight}" preserveAspectRatio="none">
        <!-- River stream across level 15 -->
        <path class="river-stream-path" d="M -20 2400 Q 120 2360, 200 2410 T 420 2380" />
        
        <!-- Road Outer Border -->
        <path class="road-outer-border" d="${roadPathD}" />
        <!-- Road Main Golden Track -->
        <path class="road-main-track" d="${roadPathD}" />
        <!-- Road Center Dashed Line -->
        <path class="road-inner-dash" d="${roadPathD}" />
      </svg>
    `;

    board.innerHTML = svgRoadHTML;

    // 4. Add Pure Background Ambient Scenery Icons (Outer Margins Only - No Text)
    const sceneryItems = [
      { x: 35, y: 4700, icon: '🌳' },
      { x: 365, y: 4350, icon: '✍️' },
      { x: 35, y: 3950, icon: '🚢' },
      { x: 365, y: 3550, icon: '🐪' },
      { x: 35, y: 3150, icon: '🔥' },
      { x: 365, y: 2750, icon: '👑' },
      { x: 200, y: 2400, icon: '🌉' },
      { x: 35, y: 2000, icon: '🌊' },
      { x: 365, y: 1550, icon: '🦅' },
      { x: 35, y: 1100, icon: '🐋' },
      { x: 365, y: 650, icon: '🕊️' },
      { x: 200, y: 60, icon: '🕋' }
    ];

    sceneryItems.forEach(sc => {
      const deco = document.createElement('div');
      deco.className = 'map-scenery-deco';
      deco.style.left = `${(sc.x / 400) * 100}%`;
      deco.style.top = `${sc.y}px`;
      deco.innerHTML = `<span class="map-scenery-icon">${sc.icon}</span>`;
      board.appendChild(deco);
    });

    // 5. Render 30 Interactive Game Level Nodes
    points.forEach(p => {
      const lvlNum = p.lvlNum;
      const lvlData = STORY_BLOCKS_DATA[lvlNum];
      if (!lvlData) return;

      const isDone = completed.includes(lvlNum);
      const isUnlocked = lvlNum === 1 || completed.includes(lvlNum - 1);
      const isCurrent = isUnlocked && !isDone;

      const nodeElem = document.createElement('div');
      nodeElem.className = `quran-map-node-item ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
      nodeElem.style.left = `${(p.x / 400) * 100}%`;
      nodeElem.style.top = `${p.y}px`;

      // 3 Stars floating on top for completed levels
      let topStarsHTML = '';
      if (isDone) {
        topStarsHTML = `<div class="node-top-stars">⭐⭐⭐</div>`;
      } else if (isCurrent) {
        topStarsHTML = `<div class="node-active-marker">العب هنا ✨</div>`;
      }

      // Inner Icon/Number
      let innerIcon = `${lvlNum}`;
      if (isDone) {
        innerIcon = '⭐';
      } else if (!isUnlocked) {
        innerIcon = '🔒';
      }

      nodeElem.innerHTML = `
        ${topStarsHTML}
        <div class="node-3d-btn" style="${isDone ? 'background:linear-gradient(180deg, #fbbf24, #d97706);' : ''}">
          <span class="node-inner-num">${innerIcon}</span>
        </div>
        <div class="node-surah-pill">
          ${lvlData.mapTitle || lvlData.title}
        </div>
      `;

      if (isUnlocked) {
        nodeElem.onclick = () => {
          sfx.playPop();
          storyEngine.startLevel(lvlNum);
        };
      }

      board.appendChild(nodeElem);
    });

    // 6. Update Certificate Button Visibility
    const certBtn = document.getElementById('btn-view-story-certificate');
    if (certBtn) {
      certBtn.style.display = (completed.length >= totalLevels) ? 'block' : 'none';
    }

    // 7. Auto-scroll to Current Level in Viewport
    setTimeout(() => {
      const viewport = document.getElementById('story-world-map-viewport');
      const activeNode = document.querySelector('#story-levels-list .quran-map-node-item.current') || document.querySelector('#story-levels-list .quran-map-node-item');
      if (viewport && activeNode) {
        const topPos = activeNode.offsetTop - viewport.clientHeight / 2;
        viewport.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
      }
    }, 150);
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
    const board = document.getElementById('memory-levels-list');
    if (!board) return;
    board.innerHTML = '';

    const completed = this.player.completedMemoryLevels || [];
    const completedCount = completed.length;
    const totalLevels = 30;

    // 1. Update Progress HUD
    const progText = document.getElementById('quran-map-progress-text');
    const progFill = document.getElementById('quran-map-progress-fill');
    const starsHud = document.getElementById('quran-map-stars-count');
    
    if (progText) progText.innerText = `${completedCount} / ${totalLevels}`;
    if (progFill) {
      const pct = Math.min(100, Math.round((completedCount / totalLevels) * 100));
      progFill.style.width = `${pct}%`;
    }
    if (starsHud) starsHud.innerText = completedCount * 3;

    // 2. Calculate smooth S-curve coordinates for 30 levels (Clean generous spacing)
    const totalHeight = 4800;
    const startY = 4650;
    const endY = 150;
    const stepY = (startY - endY) / (totalLevels - 1);

    const points = [];
    for (let i = 1; i <= totalLevels; i++) {
      const y = startY - (i - 1) * stepY;
      const x = 200 + 85 * Math.sin((i - 1) * 0.85);
      points.push({ lvlNum: i, x: Math.round(x), y: Math.round(y) });
    }

    // 3. Build Smooth Bezier Road Path SVG
    let roadPathD = `M ${points[0].x} ${points[0].y}`;
    for (let k = 0; k < points.length - 1; k++) {
      const p0 = points[k];
      const p1 = points[k + 1];
      const midY = (p0.y + p1.y) / 2;
      roadPathD += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }

    const svgRoadHTML = `
      <svg class="quran-map-road-svg" width="100%" height="${totalHeight}" viewBox="0 0 400 ${totalHeight}" preserveAspectRatio="none">
        <!-- River stream across level 15 -->
        <path class="river-stream-path" d="M -20 2400 Q 120 2360, 200 2410 T 420 2380" />
        
        <!-- Road Outer Border -->
        <path class="road-outer-border" d="${roadPathD}" />
        <!-- Road Main Golden Track -->
        <path class="road-main-track" d="${roadPathD}" />
        <!-- Road Center Dashed Line -->
        <path class="road-inner-dash" d="${roadPathD}" />
      </svg>
    `;

    board.innerHTML = svgRoadHTML;

    // 4. Add Pure Background Ambient Scenery Icons (Outer Margins Only - No Text)
    const sceneryItems = [
      { x: 35, y: 4700, icon: '🌴' },
      { x: 365, y: 4200, icon: '⛺' },
      { x: 35, y: 3650, icon: '🌴' },
      { x: 365, y: 3100, icon: '🐪' },
      { x: 35, y: 2550, icon: '🌴' },
      { x: 200, y: 2400, icon: '🌉' },
      { x: 365, y: 1950, icon: '🪨' },
      { x: 35, y: 1400, icon: '🌴' },
      { x: 365, y: 900, icon: '🕌' },
      { x: 35, y: 450, icon: '⛰️' },
      { x: 365, y: 250, icon: '🌙' },
      { x: 200, y: 60, icon: '🕋' }
    ];

    sceneryItems.forEach(sc => {
      const deco = document.createElement('div');
      deco.className = 'map-scenery-deco';
      deco.style.left = `${(sc.x / 400) * 100}%`;
      deco.style.top = `${sc.y}px`;
      deco.innerHTML = `<span class="map-scenery-icon">${sc.icon}</span>`;
      board.appendChild(deco);
    });

    // 5. Render 30 Interactive Game Level Nodes
    points.forEach(p => {
      const lvlNum = p.lvlNum;
      const lvlData = MEMORY_LEVELS_DATA[lvlNum];
      if (!lvlData) return;

      const isDone = completed.includes(lvlNum);
      const isUnlocked = lvlNum === 1 || completed.includes(lvlNum - 1);
      const isCurrent = isUnlocked && !isDone;

      const nodeElem = document.createElement('div');
      nodeElem.className = `quran-map-node-item ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
      nodeElem.style.left = `${(p.x / 400) * 100}%`;
      nodeElem.style.top = `${p.y}px`;

      // 3 Stars floating on top for completed levels
      let topStarsHTML = '';
      if (isDone) {
        topStarsHTML = `<div class="node-top-stars">⭐⭐⭐</div>`;
      } else if (isCurrent) {
        topStarsHTML = `<div class="node-active-marker">العب هنا ▶️</div>`;
      }

      // Inner Icon/Number
      let innerIcon = `${lvlNum}`;
      if (isDone) {
        innerIcon = '⭐';
      } else if (!isUnlocked) {
        innerIcon = '🔒';
      }

      nodeElem.innerHTML = `
        ${topStarsHTML}
        <div class="node-3d-btn">
          <span class="node-inner-num">${innerIcon}</span>
        </div>
        <div class="node-surah-pill">
          ${lvlData.title}
        </div>
      `;

      if (isUnlocked) {
        nodeElem.onclick = () => {
          sfx.playPop();
          memoryEngine.startLevel(lvlNum);
        };
      }

      board.appendChild(nodeElem);
    });

    // 6. Update Certificate Button Visibility
    const certBtn = document.getElementById('btn-view-memory-certificate');
    if (certBtn) {
      certBtn.style.display = (completed.length >= totalLevels) ? 'block' : 'none';
    }

    // 7. Auto-scroll to Current Level in Viewport
    setTimeout(() => {
      const viewport = document.getElementById('quran-world-map-viewport');
      const activeNode = document.querySelector('.quran-map-node-item.current') || document.querySelector('.quran-map-node-item');
      if (viewport && activeNode) {
        const topPos = activeNode.offsetTop - viewport.clientHeight / 2;
        viewport.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
      }
    }, 150);
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
    const board = document.getElementById('map-levels-list');
    if (!board) return;
    board.innerHTML = '';

    const completed = this.player.completedLevels || [];
    const completedCount = completed.length;
    const totalLevels = GAME_LEVELS.length; // 9 Stages

    // 1. Update Hajj HUD Progress
    const progText = document.getElementById('hajj-map-progress-text');
    const progFill = document.getElementById('hajj-map-progress-fill');
    const starsHud = document.getElementById('hajj-map-stars-count');

    if (progText) progText.innerText = `${completedCount} / ${totalLevels}`;
    if (progFill) {
      const pct = Math.min(100, Math.round((completedCount / totalLevels) * 100));
      progFill.style.width = `${pct}%`;
    }
    if (starsHud) starsHud.innerText = completedCount * 3;

    // 2. Calculate S-curve coordinates for 9 Hajj Stages (240px wide spacing)
    const totalHeight = 2200;
    const startY = 2050;
    const endY = 150;
    const stepY = (startY - endY) / (totalLevels - 1);

    const points = [];
    for (let i = 1; i <= totalLevels; i++) {
      const y = startY - (i - 1) * stepY;
      const x = 200 + 85 * Math.sin((i - 1) * 1.25);
      points.push({ lvlNum: i, x: Math.round(x), y: Math.round(y) });
    }

    // 3. Build Smooth Bezier Road Path SVG
    let roadPathD = `M ${points[0].x} ${points[0].y}`;
    for (let k = 0; k < points.length - 1; k++) {
      const p0 = points[k];
      const p1 = points[k + 1];
      const midY = (p0.y + p1.y) / 2;
      roadPathD += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }

    const svgRoadHTML = `
      <svg class="quran-map-road-svg" width="100%" height="${totalHeight}" viewBox="0 0 400 ${totalHeight}" preserveAspectRatio="none">
        <!-- Road Outer Border -->
        <path class="road-outer-border" d="${roadPathD}" />
        <!-- Road Main Golden Track -->
        <path class="road-main-track" d="${roadPathD}" />
        <!-- Road Center Dashed Line -->
        <path class="road-inner-dash" d="${roadPathD}" />
      </svg>
    `;

    board.innerHTML = svgRoadHTML;

    // 4. Holy Land Ambient Scenery Icons (Outer Margins Only - No Text)
    const sceneryItems = [
      { x: 35, y: 2100, icon: '🕋' },
      { x: 365, y: 1800, icon: '🔄' },
      { x: 35, y: 1550, icon: '🏃' },
      { x: 365, y: 1300, icon: '⛺' },
      { x: 35, y: 1050, icon: '⛰️' },
      { x: 365, y: 800, icon: '🌌' },
      { x: 35, y: 550, icon: '🪨' },
      { x: 365, y: 320, icon: '🐑' },
      { x: 200, y: 60, icon: '🕋' }
    ];

    sceneryItems.forEach(sc => {
      const deco = document.createElement('div');
      deco.className = 'map-scenery-deco';
      deco.style.left = `${(sc.x / 400) * 100}%`;
      deco.style.top = `${sc.y}px`;
      deco.innerHTML = `<span class="map-scenery-icon">${sc.icon}</span>`;
      board.appendChild(deco);
    });

    // 5. Render 9 Interactive Hajj Nodes
    points.forEach(p => {
      const lvlNum = p.lvlNum;
      const levelData = GAME_LEVELS.find(l => l.id === lvlNum);
      if (!levelData) return;

      const isDone = completed.includes(lvlNum);
      const isUnlocked = lvlNum === 1 || completed.includes(lvlNum - 1);
      const isCurrent = isUnlocked && !isDone;

      const nodeElem = document.createElement('div');
      nodeElem.className = `quran-map-node-item ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
      nodeElem.style.left = `${(p.x / 400) * 100}%`;
      nodeElem.style.top = `${p.y}px`;

      // 3 Stars floating on top for completed levels
      let topStarsHTML = '';
      if (isDone) {
        topStarsHTML = `<div class="node-top-stars">⭐⭐⭐</div>`;
      } else if (isCurrent) {
        topStarsHTML = `<div class="node-active-marker">انطلق هنا 🕋</div>`;
      }

      // Inner Icon/Number
      let innerIcon = `${lvlNum}`;
      if (isDone) {
        innerIcon = '⭐';
      } else if (!isUnlocked) {
        innerIcon = '🔒';
      }

      nodeElem.innerHTML = `
        ${topStarsHTML}
        <div class="node-3d-btn">
          <span class="node-inner-num">${innerIcon}</span>
        </div>
        <div class="node-surah-pill">
          ${levelData.title}
        </div>
      `;

      if (isUnlocked) {
        nodeElem.onclick = () => {
          sfx.playPop();
          this.startStage(lvlNum);
        };
      }

      board.appendChild(nodeElem);
    });

    // 6. Certificate Button
    const certBtn = document.getElementById('btn-view-certificate');
    if (certBtn) {
      certBtn.style.display = (completed.length >= totalLevels) ? 'block' : 'none';
    }

    // 7. Auto-scroll to Current Level in Viewport
    setTimeout(() => {
      const viewport = document.getElementById('hajj-world-map-viewport');
      const activeNode = document.querySelector('#map-levels-list .quran-map-node-item.current') || document.querySelector('#map-levels-list .quran-map-node-item');
      if (viewport && activeNode) {
        const topPos = activeNode.offsetTop - viewport.clientHeight / 2;
        viewport.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
      }
    }, 150);
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

    let totalQuranWords = 0;
    Object.values(MEMORY_LEVELS_DATA).forEach(l => {
      if (l.pairs) totalQuranWords += l.pairs.length;
    });

    if (avatarView) avatarView.innerText = this.player.avatar === 'boy' ? '👦' : '👧';
    if (nameView) nameView.innerText = this.player.name || 'البطل المسلم';
    if (hasanatView) hasanatView.innerText = this.player.hasanat;
    if (progressView) progressView.innerText = `${hajjCompleted} / 9`;
    if (quranCountView) quranCountView.innerText = `${quranDiscovered} / ${totalQuranWords}`;
    if (storyCountView) storyCountView.innerText = `${prophetsDiscovered} / 30`;
    if (conquestCountView) conquestCountView.innerText = `${conquestsDiscovered} / 30`;

    if (badgeHajj) badgeHajj.innerText = `${hajjCompleted} / 9`;
    if (badgeQuran) badgeQuran.innerText = `${quranDiscovered} / ${totalQuranWords}`;
    if (badgeProphets) badgeProphets.innerText = `${prophetsDiscovered} / 30`;
    if (badgeConquests) badgeConquests.innerText = `${conquestsDiscovered} / 30`;

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

      Object.values(STORY_BLOCKS_DATA).forEach(st => {
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
    this.currentStory = null;
    this.displayedCards = [];
    this.selectedIndices = [];
    this.isAnswered = false;
  }

  startLevel(lvlNum) {
    this.currentLevel = lvlNum;
    const lvlData = STORY_BLOCKS_DATA[lvlNum];
    if (!lvlData) return;

    this.currentStory = lvlData;
    this.selectedIndices = [];
    this.isAnswered = false;
    game.switchScreen('screen-story-game');

    // 1. Update Header & Banner UI
    const titleIcon = document.getElementById('story-level-title-icon');
    const titleText = document.getElementById('story-level-title-text');
    if (titleIcon) titleIcon.innerText = lvlNum === 30 ? '👑✨' : '✨';
    if (titleText) titleText.innerText = `المرحلة ${lvlNum}: ${lvlData.prophet}`;

    const curNum = document.getElementById('story-current-num');
    const totNum = document.getElementById('story-total-num');
    if (curNum) curNum.innerText = lvlNum;
    if (totNum) totNum.innerText = 30;

    const prophetIcon = document.getElementById('story-prophet-icon');
    const prophetName = document.getElementById('story-prophet-name');
    const prophetSubtitle = document.getElementById('story-prophet-subtitle');

    if (prophetIcon) prophetIcon.innerText = (lvlData.miracles[0] && lvlData.miracles[0].icon) ? lvlData.miracles[0].icon : '✨';
    if (prophetName) prophetName.innerText = lvlData.title;
    if (prophetSubtitle) prophetSubtitle.innerText = `اختر المعجزات والأنوار الـ 3 الخاصة بـ (${lvlData.prophet})`;

    // 2. Setup Hint
    const hintBox = document.getElementById('story-hint-box');
    const hintBtn = document.getElementById('btn-story-hint');
    if (hintBox) {
      hintBox.style.display = 'none';
      hintBox.innerText = `💡 تلميح: ${lvlData.hint}`;
    }
    if (hintBtn) {
      hintBtn.onclick = () => {
        sfx.playPop();
        if (hintBox) {
          hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none';
        }
      };
    }

    // 3. Hide Moral Banner & Confirm Button
    const moralBanner = document.getElementById('story-moral-banner');
    const confirmBtn = document.getElementById('btn-confirm-miracles');
    if (moralBanner) moralBanner.style.display = 'none';
    if (confirmBtn) confirmBtn.style.display = 'none';

    // 4. Build 6 Cards: 3 Correct + 3 Random Distractors from other stories
    const correctMiracles = lvlData.miracles.map(m => ({ ...m, isCorrect: true }));

    // Gather distractors
    let allOtherMiracles = [];
    Object.keys(STORY_BLOCKS_DATA).forEach(k => {
      if (parseInt(k) !== lvlNum) {
        allOtherMiracles = allOtherMiracles.concat(STORY_BLOCKS_DATA[k].miracles);
      }
    });

    // Shuffle & take 3 unique distractors
    const shuffledDistractors = allOtherMiracles
      .filter(m => !correctMiracles.some(cm => cm.name === m.name))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(m => ({ ...m, isCorrect: false }));

    // Combine & shuffle all 6 cards
    this.displayedCards = [...correctMiracles, ...shuffledDistractors].sort(() => Math.random() - 0.5);

    this.renderPickCards();
    this.updateTrackerUI();
  }

  updateTrackerUI() {
    const trackerText = document.getElementById('story-selection-counter-text');
    const count = this.selectedIndices.length;
    const arabicNums = ['٠', '١', '٢', '٣'];
    if (trackerText) {
      trackerText.innerText = `🎯 اختر المعجزات الـ 3 الخاصة بـ (${this.currentStory.prophet}) • [ المحدد: ${arabicNums[count]} / ٣ ]`;
    }

    const confirmBtn = document.getElementById('btn-confirm-miracles');
    if (confirmBtn) {
      if (count === 3 && !this.isAnswered) {
        confirmBtn.style.display = 'block';
        confirmBtn.onclick = () => this.evaluateSelection();
      } else {
        confirmBtn.style.display = 'none';
      }
    }
  }

  renderPickCards() {
    const grid = document.getElementById('active-dice-grid');
    if (!grid) return;
    grid.innerHTML = '';

    this.displayedCards.forEach((card, index) => {
      const cardElem = document.createElement('div');
      cardElem.className = `miracle-pick-card ${this.selectedIndices.includes(index) ? 'selected' : ''}`;
      cardElem.innerHTML = `
        <div class="dice-icon">${card.icon}</div>
        <div class="dice-name">${card.name}</div>
      `;

      cardElem.onclick = () => this.toggleCardSelection(index, cardElem);
      grid.appendChild(cardElem);
    });
  }

  toggleCardSelection(index, cardElem) {
    if (this.isAnswered) return;

    sfx.playPop();
    const idxInSelected = this.selectedIndices.indexOf(index);

    if (idxInSelected > -1) {
      // Unselect
      this.selectedIndices.splice(idxInSelected, 1);
      cardElem.classList.remove('selected');
    } else {
      if (this.selectedIndices.length >= 3) {
        showCustomAlert("حددت 3 معجزات بالفعل! 💡", "اضغط على تأكيد الاختيار أو انقر على كرت لإلغاء تحديده وتبديله.", "💡", "حسناً 🌟");
        return;
      }
      this.selectedIndices.push(index);
      cardElem.classList.add('selected');
    }

    this.updateTrackerUI();

    // If 3 selected, automatically evaluate after a short gentle delay
    if (this.selectedIndices.length === 3) {
      setTimeout(() => this.evaluateSelection(), 350);
    }
  }

  evaluateSelection() {
    if (this.isAnswered || this.selectedIndices.length !== 3) return;

    const allCorrect = this.selectedIndices.every(idx => this.displayedCards[idx].isCorrect);
    const cardElems = document.querySelectorAll('.miracle-pick-card');

    if (allCorrect) {
      this.isAnswered = true;
      sfx.playCorrect();

      // Highlight correct cards
      this.selectedIndices.forEach(idx => {
        if (cardElems[idx]) cardElems[idx].classList.add('correct-glow');
      });

      showVisualFeedback(document.getElementById('wooden-tray-box'), "+60 ⭐ اختيار المعجزات صحيح 100%!");

      if (!game.player.discoveredProphets) game.player.discoveredProphets = [];
      if (!game.player.discoveredProphets.includes(this.currentStory.id)) {
        game.player.discoveredProphets.push(this.currentStory.id);
      }

      const confirmBtn = document.getElementById('btn-confirm-miracles');
      if (confirmBtn) confirmBtn.style.display = 'none';

      const moralBanner = document.getElementById('story-moral-banner');
      const moralTitle = document.getElementById('story-moral-title');
      const moralBody = document.getElementById('story-moral-body');
      const nextBtn = document.getElementById('btn-next-story-question');

      if (moralBanner && moralTitle && moralBody) {
        moralTitle.innerText = `✨ ما شاء الله! ${this.currentStory.title}`;
        moralBody.innerText = this.currentStory.moral;
        moralBanner.style.display = 'block';
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          sfx.playPop();
          game.completeStoryLevel(this.currentLevel);
        };
      }
    } else {
      sfx.playWrong();

      // Shake wrong cards
      this.selectedIndices.forEach(idx => {
        if (!this.displayedCards[idx].isCorrect && cardElems[idx]) {
          cardElems[idx].classList.add('wrong-shake');
          setTimeout(() => {
            cardElems[idx].classList.remove('wrong-shake', 'selected');
          }, 600);
        }
      });

      // Remove wrong indices from selection so child only re-selects the missing ones
      this.selectedIndices = this.selectedIndices.filter(idx => this.displayedCards[idx].isCorrect);

      showCustomAlert(
        "فكر وتأمل يا بطل 💡",
        `بعض الكروت المحددة لا تخص ${this.currentStory.prophet}!\nاستعن بزر التلميح 💡 وتأمل في المعجزات جيداً.`,
        "💡",
        "سأحاول مجدداً 🌟"
      );

      this.updateTrackerUI();
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

  // Enable Drag-to-Scroll on all map viewports for seamless mouse & touch navigation
  document.querySelectorAll('.quran-world-map-viewport').forEach(viewport => {
    let isDown = false;
    let startY = 0;
    let scrollTop = 0;

    viewport.addEventListener('mousedown', (e) => {
      // Don't drag if clicking directly on an active node button
      if (e.target.closest('.quran-map-node-item')) return;
      isDown = true;
      startY = e.pageY - viewport.offsetTop;
      scrollTop = viewport.scrollTop;
    });

    viewport.addEventListener('mouseleave', () => {
      isDown = false;
    });

    viewport.addEventListener('mouseup', () => {
      isDown = false;
    });

    viewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.pageY - viewport.offsetTop;
      const walk = (y - startY) * 1.5; // Smooth multiplier
      viewport.scrollTop = scrollTop - walk;
    });
  });

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
