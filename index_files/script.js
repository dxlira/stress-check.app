/* ===================================================
   ストレスチェックアプリ - JavaScript
   =================================================== */

'use strict';

// ===================================================
// 質問データ（15問）
// ===================================================
const QUESTIONS = [
  {
    id: 1,
    text: '最近、些細なことでイライラしたり、怒りを感じることがありますか？',
  },
  {
    id: 2,
    text: '夜、なかなか寝付けなかったり、途中で目が覚めたりすることがありますか？',
  },
  {
    id: 3,
    text: '疲れが取れにくく、体が重いと感じることがありますか？',
  },
  {
    id: 4,
    text: '何をするにもやる気が起きず、気力が湧かないと感じることがありますか？',
  },
  {
    id: 5,
    text: '自分の将来や現在の状況に対して、強い不安を感じることがありますか？',
  },
  {
    id: 6,
    text: '仕事・学業・家事などに集中できず、ぼーっとしてしまうことがありますか？',
  },
  {
    id: 7,
    text: '食欲が落ちたり、逆にストレスで食べ過ぎたりすることがありますか？',
  },
  {
    id: 8,
    text: '他人の言動や視線が気になり、必要以上に落ち込んだり傷ついたりすることがありますか？',
  },
  {
    id: 9,
    text: '頭痛・肩こり・胃痛・腰痛など、身体的な不調を感じることがありますか？',
  },
  {
    id: 10,
    text: '自分の意見を言えずに我慢して、後でモヤモヤすることがありますか？',
  },
  {
    id: 11,
    text: '以前は楽しめていた趣味や好きなことへの興味が薄れてきたと感じますか？',
  },
  {
    id: 12,
    text: '些細なことで涙が出そうになったり、理由もなく悲しくなることがありますか？',
  },
  {
    id: 13,
    text: '周囲の期待に応えなければならないという強いプレッシャーを感じることがありますか？',
  },
  {
    id: 14,
    text: 'ゆっくり休んでいると、「休んでいていいのか」という罪悪感を感じることがありますか？',
  },
  {
    id: 15,
    text: '以前より物事の決断に時間がかかったり、何をすべきか分からなくなることがありますか？',
  },
];

// 選択肢の設定
const OPTIONS = [
  { value: 0, label: '全くない',  icon: '😊' },
  { value: 1, label: 'たまにある', icon: '🙂' },
  { value: 2, label: 'よくある',  icon: '😟' },
  { value: 3, label: '常にある',  icon: '😰' },
];

// 結果レベルの設定（スコア 0〜45）
const LEVELS = [
  {
    min: 0, max: 12,
    label: '低ストレス',
    emoji: '😊',
    badgeClass: 'level-low',
    ringColor: '#34d399',
    message: '現在、あなたのストレスレベルは低い状態です。心身ともに比較的安定した状態を保てています。この調子を維持するために、日頃のセルフケアを続けていきましょう。',
    advice: [
      '良好な睡眠リズムを保ちましょう',
      '定期的な軽い運動（ウォーキングなど）を取り入れてみましょう',
      '好きな趣味や娯楽の時間を確保しましょう',
      '感謝の気持ちを意識的に持つと、ポジティブな状態をキープしやすくなります',
    ],
  },
  {
    min: 13, max: 27,
    label: '中程度のストレス',
    emoji: '😐',
    badgeClass: 'level-mid',
    ringColor: '#fbbf24',
    message: 'ストレスが中程度に蓄積しています。日常生活に少し疲れを感じているかもしれません。意識的に休息とリフレッシュの時間を設けることが大切です。',
    advice: [
      '毎日 7〜8 時間の睡眠を確保しましょう',
      '深呼吸や瞑想（5分でもOK）で交感神経を落ち着かせましょう',
      '信頼できる人に今の気持ちを話してみましょう',
      '完璧を求めすぎず、「まあいいか」と許容する練習をしましょう',
      '休日は意識的にデジタルデトックスの時間を設けてみましょう',
    ],
  },
  {
    min: 28, max: 45,
    label: '高ストレス',
    emoji: '😰',
    badgeClass: 'level-high',
    ringColor: '#f87171',
    message: 'ストレスがかなり高い状態です。心身に大きな負担がかかっているサインかもしれません。無理をせず、まず自分を労わることを最優先にしてください。必要に応じて専門家への相談も検討しましょう。',
    advice: [
      '今すぐできることから休息を取りましょう',
      '重要でないタスクは後回し、または人に頼むことを試みましょう',
      '信頼できる家族・友人・同僚に現在の状況を打ち明けましょう',
      '心療内科やカウンセリングへの相談を真剣に検討してみてください',
      '深呼吸（4秒吸って・4秒止めて・4秒吐く）を毎日行いましょう',
      '一日10分だけでも、自分だけのリラックスタイムを確保しましょう',
    ],
  },
];

// ===================================================
// アプリの状態
// ===================================================
let currentQuestion = 0;
let answers = new Array(QUESTIONS.length).fill(null);

// ===================================================
// DOM 要素の取得
// ===================================================
const screenStart    = document.getElementById('screen-start');
const screenQuestion = document.getElementById('screen-question');
const screenResult   = document.getElementById('screen-result');

const btnStart    = document.getElementById('btn-start');
const btnPrev     = document.getElementById('btn-prev');
const btnNext     = document.getElementById('btn-next');
const btnRetry    = document.getElementById('btn-retry');
const btnShare    = document.getElementById('btn-share');

const questionCounter = document.getElementById('question-counter');
const progressBar     = document.getElementById('progress-bar');
const qNumberBadge    = document.getElementById('q-number-badge');
const questionText    = document.getElementById('question-text');
const optionsGrid     = document.getElementById('options-grid');

const resultEmoji   = document.getElementById('result-emoji');
const resultLevel   = document.getElementById('result-level');
const resultBadge   = document.getElementById('result-badge');
const resultMessage = document.getElementById('result-message');
const adviceList    = document.getElementById('advice-list');
const ringFill      = document.getElementById('ring-fill');
const scoreDisplay  = document.getElementById('result-score-display');

// ===================================================
// ユーティリティ
// ===================================================
function showScreen(screen) {
  [screenStart, screenQuestion, screenResult].forEach(s => {
    s.classList.remove('active');
  });
  screen.classList.add('active');
}

// ===================================================
// 質問画面の更新
// ===================================================
function renderQuestion(index) {
  const q = QUESTIONS[index];
  const total = QUESTIONS.length;
  const progress = ((index + 1) / total) * 100;

  // カウンターとプログレスバー
  questionCounter.textContent = `${index + 1} / ${total}`;
  progressBar.style.width = `${progress}%`;
  qNumberBadge.textContent = `Q${index + 1}`;

  // 質問テキストをフェードで切替
  questionText.style.opacity = '0';
  setTimeout(() => {
    questionText.textContent = q.text;
    questionText.style.opacity = '1';
    questionText.style.transition = 'opacity 0.25s';
  }, 150);

  // 選択肢ボタンの更新
  const optBtns = optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach(btn => {
    const value = parseInt(btn.dataset.value, 10);
    btn.classList.toggle('selected', answers[index] === value);
  });

  // ナビゲーションボタンの状態
  btnPrev.disabled = index === 0;

  // 最後の質問では「次へ」を「結果を見る」に変更
  if (index === total - 1) {
    btnNext.textContent = '結果を見る 🎯';
  } else {
    btnNext.textContent = '次へ →';
  }
  btnNext.disabled = answers[index] === null;
}

// ===================================================
// 結果画面の表示
// ===================================================
function showResult() {
  const totalScore = answers.reduce((sum, val) => sum + (val ?? 0), 0);
  const level = LEVELS.find(l => totalScore >= l.min && totalScore <= l.max);
  const maxScore = (QUESTIONS.length) * 3; // 45
  const percentage = totalScore / maxScore;
  const circumference = 2 * Math.PI * 50; // r=50 → 314.16

  // テキスト情報
  resultEmoji.textContent = level.emoji;
  resultLevel.textContent = `ストレスレベル：${level.label}`;
  resultMessage.textContent = level.message;

  // バッジ
  resultBadge.textContent = level.label;
  resultBadge.className = `result-badge ${level.badgeClass}`;

  // アドバイスリスト
  adviceList.innerHTML = '';
  level.advice.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    adviceList.appendChild(li);
  });

  // SVGリングのグラデーション（動的に設定）
  insertRingGradient(level.ringColor);

  showScreen(screenResult);

  // スコアアニメーション
  let currentScore = 0;
  const duration = 1000;
  const startTime = performance.now();

  function animateScore(ts) {
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    currentScore = Math.round(eased * totalScore);
    scoreDisplay.textContent = currentScore;

    // リングのストロークオフセット
    const dashOffset = circumference * (1 - eased * percentage);
    ringFill.style.strokeDashoffset = dashOffset;

    if (progress < 1) requestAnimationFrame(animateScore);
  }
  requestAnimationFrame(animateScore);
}

// SVG グラデーション定義をDOMに挿入
function insertRingGradient(color) {
  // 既存のdefs削除
  const existingSvg = document.getElementById('gradient-svg');
  if (existingSvg) existingSvg.remove();

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.id = 'gradient-svg';
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';

  const defs = document.createElementNS(svgNS, 'defs');
  const grad = document.createElementNS(svgNS, 'linearGradient');
  grad.id = 'ringGradient';
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%');
  grad.setAttribute('y2', '100%');

  const stop1 = document.createElementNS(svgNS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', color);
  const stop2 = document.createElementNS(svgNS, 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#a78bfa');

  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);
  document.body.appendChild(svg);

  // stroke属性を更新
  ringFill.setAttribute('stroke', `url(#ringGradient)`);
}

// ===================================================
// リセット
// ===================================================
function resetApp() {
  currentQuestion = 0;
  answers = new Array(QUESTIONS.length).fill(null);
}

// ===================================================
// イベントハンドラ
// ===================================================

// スタートボタン
btnStart.addEventListener('click', () => {
  resetApp();
  renderQuestion(0);
  showScreen(screenQuestion);
});

// 選択肢ボタン
optionsGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.option-btn');
  if (!btn) return;

  const value = parseInt(btn.dataset.value, 10);
  answers[currentQuestion] = value;

  // ハイライト更新
  optionsGrid.querySelectorAll('.option-btn').forEach(b => {
    b.classList.toggle('selected', parseInt(b.dataset.value, 10) === value);
  });

  // 「次へ」ボタン有効化
  btnNext.disabled = false;

  // 少し待ってから自動で次の質問へ（最終問は除く）
  if (currentQuestion < QUESTIONS.length - 1) {
    setTimeout(() => {
      currentQuestion++;
      renderQuestion(currentQuestion);
    }, 500);
  }
});

// 次へボタン
btnNext.addEventListener('click', () => {
  if (answers[currentQuestion] === null) return;

  if (currentQuestion < QUESTIONS.length - 1) {
    currentQuestion++;
    renderQuestion(currentQuestion);
  } else {
    showResult();
  }
});

// 前へボタン
btnPrev.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion(currentQuestion);
  }
});

// もう一度チェックする
btnRetry.addEventListener('click', () => {
  showScreen(screenStart);
});

// シェアボタン
btnShare.addEventListener('click', () => {
  const totalScore = answers.reduce((sum, val) => sum + (val ?? 0), 0);
  const level = LEVELS.find(l => totalScore >= l.min && totalScore <= l.max);
  const shareText = `【ストレスチェック結果】\nストレスレベル：${level.label}（${totalScore}/45点）\n${level.emoji} ${level.message.slice(0, 30)}...\n\nあなたもチェックしてみよう！`;

  if (navigator.share) {
    navigator.share({
      title: 'ストレスチェック結果',
      text: shareText,
    }).catch(() => {});
  } else {
    // フォールバック: クリップボードにコピー
    navigator.clipboard.writeText(shareText).then(() => {
      const original = btnShare.textContent;
      btnShare.textContent = '✅ コピーしました！';
      setTimeout(() => { btnShare.textContent = original; }, 2000);
    }).catch(() => {
      alert(shareText);
    });
  }
});
