const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatLog = document.getElementById('chatLog');

const profile = {
  name: '马春钰',
  identity: '27届毕业研究生，南京大学英语笔译硕士',
  doingNow: '正在搭建个人主页、整理作品集、探索 AI 应用、学习西语。',
  strengths: '内容产出、AI 应用实践、国际传播相关内容运营。',
  contact: '邮箱：chunyu.jenny@qq.com'
};

const faq = [
  { keywords: ['做什么', '现在', '最近', '忙什么'], answer: `我最近在做四件事：${profile.doingNow}` },
  { keywords: ['作品', '案例', '项目', '作品集'], answer: '作品位已按相纸形式留白，后续可按你提供的素材批量填充。' },
  { keywords: ['联系', '邮箱', '微信', '电话'], answer: `可以通过 ${profile.contact} 联系我。` },
  { keywords: ['你是谁', '介绍', '自我介绍'], answer: `我是${profile.name}的数字分身。身份：${profile.identity}；方向：${profile.strengths}` }
];

function appendMessage(type, text) {
  const msg = document.createElement('div');
  msg.className = `bubble ${type}`;
  msg.textContent = text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function getBotReply(input) {
  const normalized = input.trim().toLowerCase();
  const hit = faq.find(item => item.keywords.some(k => normalized.includes(k)));
  if (hit) return hit.answer;
  return '我可以先回答：你现在在做什么、有哪些作品、怎么联系你。';
}

if (chatForm && chatInput && chatLog) {
  chatForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = chatInput.value.trim();
    if (!value) return;
    appendMessage('user', value);
    chatInput.value = '';
    setTimeout(() => appendMessage('bot', getBotReply(value)), 200);
  });
}

const modal = document.getElementById('imageModal');
const modalClose = document.getElementById('modalClose');
const modalCaption = document.getElementById('modalCaption');
const papers = document.querySelectorAll('.work-paper');

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

papers.forEach((paper, idx) => {
  paper.addEventListener('click', () => {
    if (!modal || !modalCaption) return;
    modalCaption.textContent = paper.dataset.title || `作品 ${idx + 1}`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
}
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

const wheelWrap = document.getElementById('wheelWrap');
const wheelKnob = document.getElementById('wheelKnob');
const workScreen = document.querySelector('.work-screen');

const themes = [
  { angle: 0, work: '#fff7c8', card: '#e6e6e6' },
  { angle: 60, work: '#fff2ba', card: '#e5e5e5' },
  { angle: 120, work: '#f5f4b3', card: '#e3e3e3' },
  { angle: 180, work: '#dcf4d5', card: '#e2e2e2' },
  { angle: 240, work: '#dff0ff', card: '#e4e4e4' },
  { angle: 300, work: '#f4e1ff', card: '#e5e5e5' }
];

function normalizeAngle(raw) {
  return (raw + 360) % 360;
}

function nearestTheme(angle) {
  return themes.reduce((closest, current) => {
    const d1 = Math.min(Math.abs(current.angle - angle), 360 - Math.abs(current.angle - angle));
    const d2 = Math.min(Math.abs(closest.angle - angle), 360 - Math.abs(closest.angle - angle));
    return d1 < d2 ? current : closest;
  }, themes[0]);
}

function setKnob(angle) {
  if (!wheelWrap || !wheelKnob) return;
  const rect = wheelWrap.getBoundingClientRect();
  const r = rect.width / 2;
  const ring = r - 11;
  const rad = ((angle - 90) * Math.PI) / 180;
  wheelKnob.style.left = `${r + ring * Math.cos(rad)}px`;
  wheelKnob.style.top = `${r + ring * Math.sin(rad)}px`;
}

function applyTheme(theme) {
  if (!workScreen) return;
  workScreen.style.setProperty('--work-local-bg', theme.work);
  workScreen.style.setProperty('--work-local-photo', theme.card);
}

function angleFromEvent(event) {
  const rect = wheelWrap.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const x = event.clientX - cx;
  const y = event.clientY - cy;
  return normalizeAngle((Math.atan2(y, x) * 180) / Math.PI + 90);
}

let dragging = false;

function moveKnob(event) {
  if (!dragging || !wheelWrap) return;
  const angle = angleFromEvent(event);
  setKnob(angle);
  applyTheme(nearestTheme(angle));
}

if (wheelWrap && wheelKnob) {
  const initial = 350;
  setKnob(initial);
  applyTheme(nearestTheme(initial));

  const start = event => {
    dragging = true;
    moveKnob(event);
  };

  wheelKnob.addEventListener('pointerdown', event => {
    event.preventDefault();
    wheelKnob.setPointerCapture(event.pointerId);
    start(event);
  });

  wheelWrap.addEventListener('pointerdown', event => {
    if (event.target === wheelKnob) return;
    start(event);
  });

  window.addEventListener('pointermove', moveKnob);
  window.addEventListener('pointerup', () => {
    dragging = false;
  });
}
