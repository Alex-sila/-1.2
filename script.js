// ==========================================
// 1. ЯНДЕКС И РЕКЛАМА
// ==========================================
let ysdk = null;
if (typeof YaGames !== 'undefined') {
    YaGames.init().then(sdk => {
        ysdk = sdk;
        if (ysdk.features && ysdk.features.LoadingAPI) ysdk.features.LoadingAPI.ready();
    }).catch(e => console.log("SDK локально не работает"));
}

window.showAdReward = function(onSuccess) {
    if (ysdk && ysdk.adv) {
        ysdk.adv.showRewardedVideo({ callbacks: { onRewarded: () => { if (onSuccess) onSuccess(); } } });
    } else {
        console.log("Реклама пропущена (локальный тест)");
        if (onSuccess) onSuccess();
    }
};

window.showAdFullscreen = function() {
    if (ysdk && ysdk.adv) ysdk.adv.showFullscreenAdv();
};

// ==========================================
// 2. ПЕРЕВОДЫ И ТЕМЫ
// ==========================================
const translations = {
  ru: { title: "Мастер слияния", shop: "Магазин", gameOver: "Игра Окончена!", yourScore: "Твои очки:", restart: "Заново" },
  en: { title: "Merge Master", shop: "Shop", gameOver: "Game Over!", yourScore: "Your score:", restart: "Restart" }
};
let currentLang = localStorage.getItem('mergeLang') || 'ru';
if (!translations[currentLang]) currentLang = 'ru';

const themesConfig = [
    { id: 'fruits', name: 'Фрукты', price: 0, emojis: ['🍅 ', '🍏 ', '🍐 ', '🍋 ', '🍊 ', '🍎 ', '🍇 ', '🍓 ', '🍉 '], blocker: '🐛' },
    { id: 'sweets', name: 'Сладости', price: 150, emojis: ['🍬 ', '🍭 ', '🍩 ', '🍪 ', '🧁 ', '🍰 ', '🎂 ', '🍫 ', '🍨 '], blocker: '🦷' },
    { id: 'food', name: 'Еда', price: 400, emojis: ['🍞 ', '🧀 ', '🍔 ', '🍟 ', '🍕 ', '🌮 ', '🍣 ', '🍜 ', '🍱 '], blocker: '🪳' },
    { id: 'pets', name: 'Питомцы', price: 1000, emojis: ['🐣 ', '🐹 ', '🐰 ', '🐱 ', '🐶 ', '🦊 ', '🐼 ', '🦁 ', '🐉 '], blocker: '🦴' },
    { id: 'magic', name: 'Магия', price: 1500, emojis: ['✨ ', '🔮 ', '🪄 ', '🧪 ', '🧙‍♂️ ', '🧚‍♀️ ', '🦄 ', '🐉 ', '👑 '], blocker: '💀' },
    { id: 'success', name: 'Успех', price: 2500, emojis: ['🎒 ', '⌚ ', '📱 ', '🚗 ', '🏠 ', '✈️ ', '🛥️ ', '🌍 ', '🚀 '], blocker: '💸' },
    { id: 'space', name: 'Космос', price: 4000, emojis: ['🌑 ', '🌒 ', '🌍 ', '🪐 ', '☀️ ', '🌟 ', '🌌 ', '☄️ ', '👽 '], blocker: '🌑' },
    { id: 'wealth', name: 'Богатство', price: 6000, emojis: ['🪙 ', '💵 ', '💳 ', '💰 ', '💎 ', '👑 ', '🏦 ', '🏝️ ', '🚁 '], blocker: '🧾' }
];

// ==========================================
// 3. СОСТОЯНИЕ
// ==========================================
let score = 0, lives = 3, level = 1, soundOn = true;
let coins = Number(localStorage.getItem('mergeCoins')) || 0;
let bestScore = Number(localStorage.getItem('mergeBestScore')) || 0;
let unlockedThemes = ['fruits'];
try { const st = localStorage.getItem('mergeUnlockedThemes'); if (st) unlockedThemes = JSON.parse(st) || ['fruits']; } catch(e) {}
let activeThemeId = localStorage.getItem('mergeActiveTheme') || 'fruits';
let currentTheme = themesConfig.find(t => t.id === activeThemeId) || themesConfig[0];
let EMOJIS = currentTheme.emojis;
document.body.className = 'theme-' + activeThemeId;
let unlockedFruits = new Array(EMOJIS.length).fill(false);
unlockedFruits[0] = true;
let loginStreak = Number(localStorage.getItem('mergeLoginStreak')) || 0;
const dailyRewards = [50, 60, 70, 80, 100, 150, 300];

// ==========================================
// 4. ЗВУКИ И ЭФФЕКТЫ
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); }
function playSound(type) {
  if (!soundOn) return; initAudio();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  if (type === 'drop') { osc.frequency.setValueAtTime(500, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1); gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1); osc.start(); osc.stop(audioCtx.currentTime + 0.1); }
  else if (type === 'merge') { osc.frequency.setValueAtTime(700, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15); gain.gain.setValueAtTime(0.15, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15); osc.start(); osc.stop(audioCtx.currentTime + 0.15); }
  else if (type === 'lose') { osc.frequency.setValueAtTime(300, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3); gain.gain.setValueAtTime(0.2, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3); osc.start(); osc.stop(audioCtx.currentTime + 0.3); }
  else if (type === 'coin') { osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.1); gain.gain.setValueAtTime(0.15, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1); osc.start(); osc.stop(audioCtx.currentTime + 0.1); }
}

function spawnParticles(x, y, isExplosion = false) {
  const count = isExplosion ? 30 : 8;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div'); p.className = 'particle'; p.style.left = x + 'px'; p.style.top = y + 'px';
    p.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
    const distance = isExplosion ? 150 : 80;
    p.style.setProperty('--dx', (Math.random() - 0.5) * distance + 'px'); p.style.setProperty('--dy', (Math.random() - 0.5) * distance + 'px');
    document.getElementById('game-container').appendChild(p); setTimeout(() => p.remove(), 600);
  }
}

// ==========================================
// 5. УТИЛИТЫ И МАГАЗИН
// ==========================================
function updateCoins(val) { coins += val; const c = document.getElementById('coinVal'); if (c) c.textContent = coins; localStorage.setItem('mergeCoins', coins); }
function updateEarrings() { let l = Number(localStorage.getItem('mergeLastCoinScore')) || 0; if (score >= l + 100) { updateCoins(2); localStorage.setItem('mergeLastCoinScore', score); playSound('coin'); } }
function applyTranslation() { const t = translations[currentLang]; if(!t) return; const s = document.getElementById('shopBtn'); if(s) s.textContent = '🛒 ' + t.shop; const ti = document.getElementById('titleText'); if(ti) ti.textContent = t.title; }
window.setLang = function(lang) { currentLang = lang; localStorage.setItem('mergeLang', lang); applyTranslation(); document.getElementById('langModal').classList.add('hidden'); };

function renderShop() {
  const grid = document.getElementById('shopGrid'); if (!grid) return; grid.innerHTML = '';
  themesConfig.forEach(theme => {
    const isOwned = unlockedThemes.includes(theme.id), isActive = activeThemeId === theme.id, canBuy = coins >= theme.price;
    const card = document.createElement('div'); card.className = `shop-card ${isActive ? 'active' : ''}`;
    card.innerHTML = `<div class="theme-preview">${theme.emojis.slice(0, 3).join(' ')}</div><div class="theme-name">${theme.name}</div><div class="theme-price">${theme.price === 0 ? 'Бесплатно' : '🪙 ' + theme.price}</div><button class="${isActive ? 'active-btn' : (isOwned ? 'owned' : '')}" ${(!canBuy && !isOwned) ? 'disabled' : ''}>${isActive ? 'Активна' : (isOwned ? 'Выбрать' : (canBuy ? 'Купить' : 'Не хватает'))}</button>`;
    card.querySelector('button').addEventListener('click', () => { if (isActive) return; if (isOwned) setActiveTheme(theme.id); else if (canBuy) buyTheme(theme.id); });
    grid.appendChild(card);
  });
}
function buyTheme(themeId) { const t = themesConfig.find(t => t.id === themeId); if (!t || coins < t.price) return; updateCoins(-t.price); playSound('coin'); unlockedThemes.push(t.id); localStorage.setItem('mergeUnlockedThemes', JSON.stringify(unlockedThemes)); setActiveTheme(t.id); renderShop(); }
function setActiveTheme(themeId) { activeThemeId = themeId; currentTheme = themesConfig.find(t => t.id === themeId) || themesConfig[0]; document.body.className = 'theme-' + themeId; EMOJIS = currentTheme.emojis; unlockedFruits = new Array(EMOJIS.length).fill(false); unlockedFruits[0] = true; renderProgressBar(); localStorage.setItem('mergeActiveTheme', themeId); const sm = document.getElementById('shopModal'); if (sm) sm.classList.add('hidden'); resetGame(); }

// ==========================================
// 6. ФИЗИКА И ИГРА
// ==========================================
const Engine = Matter.Engine, Composite = Matter.Composite, Bodies = Matter.Bodies, Events = Matter.Events;
const engine = Engine.create(), world = engine.world;
const container = document.getElementById('game-container'), conveyorWrapper = document.getElementById('conveyor'), progressBar = document.getElementById('progressBar');
let conveyorTiles = [], activeBodies = [], isGameOver = false, animationId, lastSpawnTime = 0, tileSpeed = 0.4, spawnInterval = 2500;
const scorePerLevel = 500;
let nextFruitLevel = 0, beltOffset = 0, width = 400, height = 450;

function updateSizes() { if (container) { width = container.clientWidth; height = container.clientHeight; } }
let walls = [];
function createWalls() { if (walls.length > 0) Composite.remove(world, walls); walls = []; const opt = { isStatic: true, render: { visible: false } }; walls.push(Bodies.rectangle(width / 2, height + 30, width, 60, opt), Bodies.rectangle(-20, height / 2, 40, height * 2, opt), Bodies.rectangle(width + 20, height / 2, 40, height * 2, opt)); Composite.add(world, walls); }
if (window.ResizeObserver) new ResizeObserver(() => { updateSizes(); createWalls(); }).observe(container); else window.addEventListener('resize', () => { updateSizes(); createWalls(); });

function renderProgressBar() { if (!progressBar) return; progressBar.innerHTML = ''; EMOJIS.forEach((emoji, index) => { const el = document.createElement('div'); el.className = 'progress-fruit' + (unlockedFruits[index] ? ' unlocked' : ''); el.textContent = emoji; progressBar.appendChild(el); }); }
function updateLevel() { const nl = Math.floor(score / scorePerLevel) + 1; if (nl > level) { level = nl; const l = document.getElementById('levelVal'); if(l) l.textContent = level; tileSpeed = 0.4 + (level - 1) * 0.02; spawnInterval = Math.max(800, 2500 - (level - 1) * 200); } }
function updateNextFruitDisplay() { const n = document.getElementById('nextFruitVal'); if(n) n.textContent = EMOJIS[nextFruitLevel]; }

function spawnConveyorTile() {
  if (isGameOver) return;
  const isGolden = Math.random() < 0.1;
  const isBomb = Math.random() < 0.04; // В 2 РАЗА РЕЖЕ (было 0.08)
  const isBlocker = Math.random() < 0.03; // В 2 РАЗА РЕЖЕ (было 0.06)
  const val = nextFruitLevel;
  
  nextFruitLevel = Math.random() > 0.7 ? 1 : 0; updateNextFruitDisplay();
  const tile = document.createElement('div'); tile.className = 'conveyor-tile' + (isGolden ? ' golden' : '');
  
  if (isBlocker) { tile.textContent = currentTheme.blocker; tile.dataset.isBlocker = 'true'; }
  else if (isBomb) { tile.textContent = '💣'; tile.dataset.isBomb = 'true'; }
  else { tile.textContent = EMOJIS[val]; }
  
  tile.dataset.val = val; const startX = -80; tile.style.left = startX + 'px';
  tile.addEventListener('click', () => { if (isGameOver) return; if (isBlocker) dropBlocker(tile.offsetLeft); else if (isBomb) dropBomb(tile.offsetLeft); else dropFruit(val, tile.offsetLeft); playSound('drop'); tile.remove(); conveyorTiles = conveyorTiles.filter(t => t.el !== tile); });
  if (conveyorWrapper) conveyorWrapper.appendChild(tile);
  conveyorTiles.push({ el: tile, x: startX, val: val });
}

function createFruit(x, y, level, isGolden = false) {
  const radius = level === 99 ? 25 : (20 + level * 5) * (width / 400);
  const body = Bodies.circle(x, y, radius, { restitution: 0.02, friction: 0.9, density: 0.002, frictionAir: 0.01, slop: 0.05, label: 'fruit_' + level, render: { fillStyle: 'transparent' } });
  Composite.add(world, body);
  const el = document.createElement('div'); el.style.position = 'absolute'; el.style.width = radius * 2 + 'px'; el.style.height = radius * 2 + 'px'; el.style.display = 'flex'; el.style.alignItems = 'center'; el.style.justifyContent = 'center'; el.style.fontSize = radius * 1.5 + 'px'; el.style.pointerEvents = 'auto'; el.textContent = EMOJIS[level];
  if (isGolden) el.style.filter = 'drop-shadow(0 0 10px gold)'; if (container) container.appendChild(el);
  
  el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isHammerActive) {
          spawnParticles(body.position.x, body.position.y); removeFruit(body); playSound('merge');
          hammerUses--; const hc = document.getElementById('hammerCount'); if (hc) hc.textContent = hammerUses;
          
          // ИГРА ПРОДОЛЖАЕТСЯ СРАЗУ ПОСЛЕ ОДНОГО УДАРА
          isHammerActive = false; 
          isGameOver = false; 
          
          const hb = document.getElementById('hammerBtn'); if (hb) hb.classList.remove('active');
          document.body.classList.remove('hammer-mode'); if (container) container.style.cursor = 'default';
      }
  });

  body.domEl = el; body.level = level; body.birthTime = performance.now(); activeBodies.push(body);
  if (!unlockedFruits[level] && level < EMOJIS.length) { unlockedFruits[level] = true; renderProgressBar(); }
  return body;
}

function dropFruit(level, x) { const r = (20 + level * 5) * (width / 400); const s = Math.max(r + 10, Math.min(x, width - r - 10)); createFruit(s, 50, level); }
function dropBomb(x) { const r = 30, s = Math.max(r + 10, Math.min(x, width - r - 10)); const b = createFruit(s, 50, 99); b.domEl.textContent = '💣'; b.isBomb = true; setTimeout(() => { spawnParticles(b.position.x, b.position.y, true); playSound('lose'); activeBodies.forEach(bd => { if (bd !== b) { const d = Matter.Vector.magnitude(Matter.Vector.sub(b.position, bd.position)); if (d < 120) removeFruit(bd); } }); removeFruit(b); }, 1000); }
function dropBlocker(x) { const r = 25, s = Math.max(r + 10, Math.min(x, width - r - 10)); const b = createFruit(s, 50, 99); b.domEl.textContent = currentTheme.blocker; b.isBlocker = true; }

Events.on(engine, 'collisionStart', (event) => {
  for (let i = 0; i < event.pairs.length; i++) {
    const bA = event.pairs[i].bodyA, bB = event.pairs[i].bodyB;
    if (bA.label.startsWith('fruit_') && bB.label.startsWith('fruit_')) {
        if (bA.isBlocker || bB.isBlocker || bA.isBomb || bB.isBomb) continue;
        const lA = Number(bA.label.split('_')[1]), lB = Number(bB.label.split('_')[1]);
        if (lA === lB && lA < EMOJIS.length - 1) {
            const nl = lA + 1, nx = (bA.position.x + bB.position.x) / 2, ny = (bA.position.y + bB.position.y) / 2;
            removeFruit(bA); removeFruit(bB); const nB = createFruit(nx, ny, nl); if (nB && nB.domEl) { nB.domEl.classList.add('merge-animation'); setTimeout(() => nB.domEl.classList.remove('merge-animation'), 300); }
            spawnParticles(nx, ny, false); playSound('merge');
            score += (nl + 1) * 10; const sv = document.getElementById('scoreVal'); if (sv) sv.textContent = score;
            if (score > bestScore) { bestScore = score; const rv = document.getElementById('recordVal'); if (rv) rv.textContent = bestScore; localStorage.setItem('mergeBestScore', bestScore); }
            updateLevel(); updateEarrings();
        }
    }
  }
});

function removeFruit(body) { const i = activeBodies.indexOf(body); if (i > -1) activeBodies.splice(i, 1); if (body.domEl && body.domEl.parentNode) body.domEl.remove(); Composite.remove(world, body); }

function updateDOM() {
    const m = document.querySelector('.modal:not(.hidden)'); if (m) { animationId = requestAnimationFrame(updateDOM); return; }
    if (!isGameOver) {
        for (let i = conveyorTiles.length - 1; i >= 0; i--) { const t = conveyorTiles[i]; t.x += tileSpeed; t.el.style.left = t.x + 'px'; if (t.x > width + 70) { t.el.remove(); conveyorTiles.splice(i, 1); loseLife(); } }
        beltOffset += tileSpeed; if (conveyorWrapper) conveyorWrapper.style.backgroundPosition = `${beltOffset}px 0`;
        const now = performance.now(); if (now - lastSpawnTime > spawnInterval) { spawnConveyorTile(); lastSpawnTime = now; }
        const dY = height * 0.15; for (let b of activeBodies) { const tA = performance.now() - (b.birthTime || 0); if (b.position.y < dY && tA > 1500) { gameOver(); break; } }
    }
    activeBodies.forEach(b => { if (b.domEl) { b.domEl.style.left = (b.position.x - b.circleRadius) + 'px'; b.domEl.style.top = (b.position.y - b.circleRadius) + 'px'; } });
    animationId = requestAnimationFrame(updateDOM);
}

function loseLife() { lives--; const lv = document.getElementById('livesVal'); if (lv) lv.textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives); playSound('lose'); if (lives <= 0) gameOver(); }

function gameOver() {
  isGameOver = true; cancelAnimationFrame(animationId); const t = translations[currentLang] || translations['ru'];
  const o = document.createElement('div'); o.className = 'modal game-over-modal';
  o.innerHTML = `<h2 style="color:#e94560; font-size:36px; margin-bottom:10px;">${t.gameOver}</h2><p class="score-text" style="font-size:24px; margin-bottom:20px;">${t.yourScore} ${score}</p><button class="btn btn-restart" id="continueAdBtn" style="background-color: #4CAF50; margin-bottom: 10px; display: block; width: 100%;">▶ Продолжить за рекламу</button><button class="btn btn-restart" id="restartGameBtn" style="display: block; width: 100%;">${t.restart}</button>`;
  if (container) container.appendChild(o);
  document.getElementById('continueAdBtn').addEventListener('click', () => { window.showAdReward(() => { o.remove(); isGameOver = false; const cY = height * 0.35; activeBodies = activeBodies.filter(b => { if (b.position.y < cY) { if (b.domEl) b.domEl.remove(); Matter.Composite.remove(world, b); return false; } return true; }); lastSpawnTime = performance.now(); updateDOM(); }); });
  document.getElementById('restartGameBtn').addEventListener('click', () => { window.showAdFullscreen(); resetGame(); });
}

function resetGame() {
  cancelAnimationFrame(animationId); activeBodies.forEach(b => { if (b.domEl) b.domEl.remove(); Composite.remove(world, b); }); activeBodies = []; conveyorTiles.forEach(t => t.el.remove()); conveyorTiles = [];
  score = 0; lives = 3; level = 1; tileSpeed = 0.4; spawnInterval = 2500; isGameOver = false; unlockedFruits = new Array(EMOJIS.length).fill(false); unlockedFruits[0] = true;
  const sv = document.getElementById('scoreVal'); if (sv) sv.textContent = '0'; const lv = document.getElementById('livesVal'); if (lv) lv.textContent = '❤️❤️❤️'; const ll = document.getElementById('levelVal'); if (ll) ll.textContent = '1'; const nf = document.getElementById('nextFruitVal'); if (nf) nf.textContent = EMOJIS[0];
  renderProgressBar(); const o = document.querySelector('.game-over-modal'); if (o) o.remove(); updateSizes(); createWalls(); spawnConveyorTile(); updateDOM();
}

setInterval(() => { const m = document.querySelector('.modal:not(.hidden)'); if (!isGameOver && !m) Engine.update(engine, 1000 / 60); }, 1000 / 60);

// ==========================================
// 7. МОЛОТОК (ИСПРАВЛЕНА ЛОГИКА)
// ==========================================
let hammerUses = 2, isHammerActive = false;
const hammerBtn = document.getElementById('hammerBtn'), hammerCount = document.getElementById('hammerCount');
if (hammerBtn) {
    hammerBtn.style.display = 'flex';
    hammerBtn.addEventListener('click', () => {
        if (isHammerActive) { 
            isHammerActive = false; isGameOver = false; hammerBtn.classList.remove('active'); document.body.classList.remove('hammer-mode'); if (container) container.style.cursor = 'default'; return; 
        }
        if (hammerUses > 0) { 
            isHammerActive = true; isGameOver = true; hammerBtn.classList.add('active'); document.body.classList.add('hammer-mode'); if (container) container.style.cursor = 'crosshair'; 
        } else { 
            window.showAdReward(() => { 
                hammerUses = 2; if (hammerCount) hammerCount.textContent = hammerUses; 
                isHammerActive = true; isGameOver = true; hammerBtn.classList.add('active'); document.body.classList.add('hammer-mode'); if (container) container.style.cursor = 'crosshair'; 
            }); 
        }
    });
}

// ==========================================
// 8. ИНИЦИАЛИЗАЦИЯ
// ==========================================
updateSizes(); createWalls(); renderProgressBar();
const rV = document.getElementById('recordVal'); if (rV) rV.textContent = bestScore; const cV = document.getElementById('coinVal'); if (cV) cV.textContent = coins;
spawnConveyorTile(); updateDOM(); applyTranslation();

// Принудительное скрытие экрана загрузки
setTimeout(() => { const l = document.getElementById('loadingScreen'); if (l) l.style.display = 'none'; }, 800);

document.addEventListener('DOMContentLoaded', () => {
    const lS = document.getElementById('langSelect'); if (lS) { lS.value = currentLang; lS.addEventListener('change', (e) => { currentLang = e.target.value; localStorage.setItem('mergeLang', currentLang); applyTranslation(); }); }
    const sB = document.getElementById('soundBtn'); if (sB) sB.addEventListener('click', () => { soundOn = !soundOn; sB.innerText = soundOn ? '🔊' : '🔇'; });
    const shB = document.getElementById('shopBtn'), shM = document.getElementById('shopModal'); if (shB && shM) shB.addEventListener('click', () => { renderShop(); shM.classList.remove('hidden'); });
    
    const dB = document.getElementById('dailyBtn'), dM = document.getElementById('dailyModal');
    if (dB && dM) { 
        dB.addEventListener('click', () => { 
            const c = dM.querySelector('.modal-content') || dM; const lC = localStorage.getItem('mergeLastLogin'), t = new Date().toDateString(); 
            if (lC === t) { c.innerHTML = `<h2 style="color:#38bdf8; text-align:center;">Ежедневный бонус</h2><p style="text-align:center; font-size:18px; margin-top: 20px;">Вы уже забрали бонус сегодня!</p><button id="closeBonusBtn" style="display:block; margin: 20px auto; padding:10px 20px; background:#555; color:white; border:none; border-radius:5px; font-size:16px; cursor:pointer;">Закрыть</button>`; document.getElementById('closeBonusBtn').onclick = () => dM.classList.add('hidden'); } 
            else { 
                c.innerHTML = `<h2 style="color:#38bdf8; text-align:center;">Ежедневный бонус</h2><p style="text-align:center; font-size:18px;">Твой стрик: ${loginStreak} дней</p><p style="text-align:center; font-size:24px; color:#FFD700;">${dailyRewards[loginStreak - 1] || 50} 🪙 </p><button id="claimBonusBtn" style="display:block; margin: 20px auto; padding:10px 20px; background:#4CAF50; color:white; border:none; border-radius:5px; font-size:16px; cursor:pointer;">Забрать</button><button id="closeBonusBtn" style="display:block; margin: 10px auto; padding:5px 15px; background:transparent; color:#aaa; border:none; font-size:14px; cursor:pointer;">Закрыть</button>`; 
                const cB = document.getElementById('claimBonusBtn'); 
                cB.onclick = () => { 
                    cB.disabled = true; cB.style.background = '#555'; 
                    let s = loginStreak > 0 ? loginStreak : 1; if (s > 7) s = 1; 
                    updateCoins(dailyRewards[s - 1] || 50); 
                    localStorage.setItem('mergeLastLogin', t); localStorage.setItem('mergeLoginStreak', s + 1); 
                    dM.classList.add('hidden'); 
                }; 
                document.getElementById('closeBonusBtn').onclick = () => dM.classList.add('hidden'); 
            } 
            dM.classList.remove('hidden'); 
        }); 
    }
    
    const eB = document.getElementById('exitBtn'); if (eB) { if (typeof ysdk !== 'undefined' && ysdk !== null) eB.style.display = 'flex'; eB.addEventListener('click', () => { if (confirm('Вы уверены, что хотите выйти?')) { if (ysdk && ysdk.sdk && ysdk.sdk.exit) ysdk.sdk.exit(); else window.close(); } }); }
});

document.addEventListener('visibilitychange', () => { if (document.hidden) isGameOver = true; else isGameOver = false; });