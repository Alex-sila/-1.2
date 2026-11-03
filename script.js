// --- БЕЗОПАСНЫЙ БЛОК РЕКЛАМЫ ЯНДЕКСА ---
let ysdk = null;
if (typeof YaGames !== 'undefined') {
    YaGames.init().then(sdk => {
        ysdk = sdk;
        if (ysdk.features && ysdk.features.LoadingAPI) ysdk.features.LoadingAPI.ready();
    }).catch(e => console.log("SDK локально не работает - это нормально"));
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
    else console.log("Полноэкранная реклама пропущена (локальный тест)");
};
// ---------------------------------------// ==========================================
// 1. ПЕРЕВОДЫ (10 ЯЗЫКОВ)
// ==========================================
const translations = {
  ru: { title: "Мастер слияния", level: "Уровень:", score: "Очки:", lives: "Жизни:", restart: "Заново", hint: "Кликай по объектам!", gameOver: "Игра Окончена!", yourScore: "Твои очки:", playAgain: "Заново", next: "Следующий:", record: "Рекорд:", skip: "Пропустить", shop: "Магазин" },
  en: { title: "Merge Master", level: "Level:", score: "Score:", lives: "Lives:", restart: "Restart", hint: "Click on the objects!", gameOver: "Game Over!", yourScore: "Your score:", playAgain: "Play Again", next: "Next:", record: "Best:", skip: "Skip", shop: "Shop" },
  es: { title: "Física de Fusión", level: "Nivel:", score: "Puntos:", lives: "Vidas:", restart: "Reiniciar", hint: "¡Haz clic en las frutas!", gameOver: "¡Fin del Juego!", yourScore: "Tu puntuación:", playAgain: "Jugar de nuevo", next: "Siguiente:", record: "Récord:", skip: "Saltar", shop: "Tienda" },
  pt: { title: "Física da Fusão", level: "Nível:", score: "Pontos:", lives: "Vidas:", restart: "Reiniciar", hint: "Clique nas frutas!", gameOver: "Fim de Jogo!", yourScore: "Sua pontuação:", playAgain: "Jogar Novamente", next: "Próximo:", record: "Recorde:", skip: "Pular", shop: "Loja" },
  tr: { title: "Füzyon Fiziği", level: "Seviye:", score: "Puan:", lives: "Can:", restart: "Yeniden Başlat", hint: "Meyveleri tıklayın!", gameOver: "Oyun Bitti!", yourScore: "Puanınız:", playAgain: "Tekrar Oyna", next: "Sıradaki:", record: "Rekor:", skip: "Atla", shop: "Mağaza" },
  de: { title: "Fusionsphysik", level: "Level:", score: "Punkte:", lives: "Leben:", restart: "Neustart", hint: "Klicke auf die Früchte!", gameOver: "Spiel Vorbei!", yourScore: "Deine Punkte:", playAgain: "Nochmal", next: "Nächste:", record: "Rekord:", skip: "Überspringen", shop: "Shop" },
  fr: { title: "Physique de Fusion", level: "Niveau:", score: "Score:", lives: "Vies:", restart: "Redémarrer", hint: "Cliquez sur les fruits!", gameOver: "Jeu Terminé!", yourScore: "Votre score:", playAgain: "Rejouer", next: "Suivant:", record: "Record:", skip: "Passer", shop: "Boutique" },
  id: { title: "Fisika Penggabungan", level: "Level:", score: "Skor:", lives: "Nyawa:", restart: "Ulangi", hint: "Klik buah di konveyor!", gameOver: "Permainan Selesai!", yourScore: "Skor Anda:", playAgain: "Main Lagi", next: "Berikutnya:", record: "Rekor:", skip: "Lewati", shop: "Toko" },
  ar: { title: "فيزياء الدمج", level: "المستوى:", score: "النقاط:", lives: "الحياة:", restart: "إعادة", hint: "انقر على الفواكه!", gameOver: "انتهت اللعبة!", yourScore: "نتيجتك:", playAgain: "العب مرة أخرى", next: "التالي:", record: "الرقم القياسي:", skip: "تخطى", shop: "متجر" },
  zh: { title: "合并物理", level: "等级:", score: "分数:", lives: "生命:", restart: "重新开始", hint: "点击传送带上的水果!", gameOver: "游戏结束!", yourScore: "你的分数:", playAgain: "再玩一次", next: "下一个:", record: "最高分:", skip: "跳过", shop: "商店" }
};
let currentLang = localStorage.getItem('mergeLang') || 'ru';
// ==========================================
// 2. КОНФИГ ТЕМ (LIVEOPS)
// ==========================================
const themesConfig = [
    { id: 'fruits', name: 'Фрукты', price: 0, emojis: ['🍅 ', '🍏 ', '🥕 ', '🍋 ', '🍊 ', '🍎 ', '🍇 ', '🍓 ', '🍉 '] },
    { id: 'sweets', name: 'Сладости', price: 150, emojis: ['🍬 ', '🍭 ', '🍩 ', '🍪 ', '🧁 ', '🍰 ', '🎂 ', '🍫 ', '🍨 '] },
    { id: 'food', name: 'Еда', price: 400, emojis: ['🍞 ', '🧀 ', '🍔 ', '🍟 ', '🍕 ', '🌮 ', '🍣 ', '🍜 ', '🍱 '] },
    { id: 'pets', name: 'Питомцы', price: 1000, emojis: ['🐣 ', '🐹 ', '🐰 ', '🐱 ', '🐶 ', '🦊 ', '🐼 ', '🦁 ', '🐉 '] },
    { id: 'magic', name: 'Магия', price: 1500, emojis: ['✨ ', '🔮 ', '🪄 ', '🧪 ', '🧙‍♂️ ', '🧚‍♀️ ', '🦄 ', '🐉 ', '👑 '] },
    { id: 'success', name: 'Успех', price: 2500, emojis: ['🎒 ', '⌚ ', '📱 ', '🚗 ', '🏠 ', '✈️ ', '🛥️ ', '🌍 ', '🚀 '] },
    { id: 'space', name: 'Космос', price: 4000, emojis: ['🌑 ', '🌒 ', '🌍 ', '🪐 ', '☀️ ', '🌟 ', '🌌 ', '☄️ ', '👽 '] },
    { id: 'wealth', name: 'Богатство', price: 6000, emojis: ['🪙 ', '💵 ', '💳 ', '💰 ', '💎 ', '👑 ', '🏦 ', '🏝️ ', '🚁 '] }];
// ==========================================
// 3. СОСТОЯНИЕ
// ==========================================
let score = 0;
let lives = 3;
let level = 1;
let soundOn = true;
let coins = Number(localStorage.getItem('mergeCoins')) || 0;
let bestScore = Number(localStorage.getItem('mergeBestScore')) || 0;
let unlockedThemes = JSON.parse(localStorage.getItem('mergeUnlockedThemes')) || ['fruits'];
let activeThemeId = localStorage.getItem('mergeActiveTheme') || 'fruits';
let currentTheme = themesConfig.find(t => t.id === activeThemeId) || themesConfig[0];
let EMOJIS = currentTheme.emojis;
let unlockedFruits = new Array(EMOJIS.length).fill(false);
unlockedFruits[0] = true;

let lastLoginDate = localStorage.getItem('mergeLastLogin') || '';
let loginStreak = Number(localStorage.getItem('mergeLoginStreak')) || 0;
const dailyRewards = [50, 60, 70, 80, 100, 150, 300];

// ==========================================
// 4. ЗВУКИ
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  if (!soundOn) return;
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'drop') {
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'merge') {
    osc.frequency.setValueAtTime(700, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    osc.start(); osc.stop(audioCtx.currentTime + 0.15);
  } else if (type === 'lose') {
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
  } else if (type === 'coin') {
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'buy') {
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start(); osc.stop(audioCtx.currentTime + 0.2);
  }
}

// ==========================================
// 5. УТИЛИТЫ
// ==========================================
function updateCoins(val) {
  coins += val;
  localStorage.setItem('mergeCoins', coins);
  document.getElementById('coinVal').textContent = coins;
}

function updateEarrings() {
  let lastCoinScore = Number(localStorage.getItem('mergeLastCoinScore')) || 0;
  if (score >= lastCoinScore + 100) {
    updateCoins(2);
    localStorage.setItem('mergeLastCoinScore', score);
    playSound('coin');
  }
}

function applyTranslation() {
  const t = translations[currentLang];
  document.getElementById('shopBtn').textContent = '🛒 ' + t.shop;
  document.getElementById('titleText').textContent = t.title;
  document.getElementById('lvlLabel').textContent = t.level;
  document.getElementById('scoreLabel').textContent = t.score;
  document.getElementById('livesLabel').textContent = t.lives;
  document.getElementById('nextLabel').textContent = t.next;
  document.getElementById('recordLabel').textContent = t.record;

  const overDiv = document.querySelector('.game-over-modal');
  if (overDiv) {
    overDiv.querySelector('h2').textContent = t.gameOver;
    overDiv.querySelector('.score-text').textContent = t.yourScore + ' ' + score;
    overDiv.querySelector('.btn-restart').textContent = t.playAgain;
  }
}

window.setLang = function(lang) {
  currentLang = lang;
  localStorage.setItem('mergeLang', lang);
  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = lang;
  applyTranslation();
  const langModal = document.getElementById('langModal');
  if (langModal) langModal.classList.add('hidden');
};

// ==========================================
// 6. МАГАЗИН
// ==========================================
function renderShop() {
  const grid = document.getElementById('shopGrid');
  grid.innerHTML = '';

  themesConfig.forEach(theme => {
    const isOwned = unlockedThemes.includes(theme.id);
    const isActive = activeThemeId === theme.id;
    const canBuy = coins >= theme.price;

    const card = document.createElement('div');
    card.className = `shop-card ${isActive ? 'active' : ''}`;
    card.dataset.id = theme.id;
    card.innerHTML = `
      <div class="theme-preview">${theme.emojis.slice(0, 3).join(' ')}</div>
      <div class="theme-name">${theme.name}</div>
      <div class="theme-price">${theme.price === 0 ? 'Бесплатно' : '🪙 ' + theme.price}</div>
      <button class="${isActive ? 'active-btn' : (isOwned ? 'owned' : '')}" ${(!canBuy && !isOwned) ? 'disabled' : ''}>
        ${isActive ? 'Активна' : (isOwned ? 'Выбрать' : (canBuy ? 'Купить' : 'Не хватает'))}
      </button>
    `;

    card.querySelector('button').addEventListener('click', () => {
      if (isActive) return;
      if (isOwned) {
        setActiveTheme(theme.id);
      } else if (canBuy) {
        buyTheme(theme.id);
      }
    });
    grid.appendChild(card);
  });
}

function buyTheme(themeId) {
  const theme = themesConfig.find(t => t.id === themeId);
  if (!theme || coins < theme.price) return;

  updateCoins(-theme.price);
  playSound('buy');
  unlockedThemes.push(theme.id);
  localStorage.setItem('mergeUnlockedThemes', JSON.stringify(unlockedThemes));
  setActiveTheme(themeId);
    const boughtCard = document.querySelector(`.shop-card[data-id="${themeId}"]`);
  if (boughtCard) {
    boughtCard.classList.add('buy-flash');
    setTimeout(() => boughtCard.classList.remove('buy-flash'), 500);
  }
  renderShop();
}

function setActiveTheme(themeId) {
  activeThemeId = themeId;
  localStorage.setItem('mergeActiveTheme', themeId);
  currentTheme = themesConfig.find(t => t.id === themeId);
  EMOJIS = currentTheme.emojis;

  unlockedFruits = new Array(EMOJIS.length).fill(false);
  unlockedFruits[0] = true;
  renderProgressBar();
  document.getElementById('shopModal').classList.add('hidden');
  resetGame();
}

// ==========================================
// 7. ЕЖЕДНЕВНЫЙ БОНУС
// ==========================================

// ==========================================
// 8. ФИЗИКА И ИГРА
// ==========================================
const Engine = Matter.Engine, Composite = Matter.Composite, Bodies = Matter.Bodies, Events = Matter.Events;
const engine = Engine.create();
const world = engine.world;

const container = document.getElementById('game-container');
const conveyorWrapper = document.getElementById('conveyor');
const progressBar = document.getElementById('progressBar');

let conveyorTiles = [];
let activeBodies = [];
let isGameOver = false;
let animationId;
let lastSpawnTime = 0;
let tileSpeed = 0.7;
let spawnInterval = 2500;
const scorePerLevel = 500;
let skipCooldown = false;
let nextFruitLevel = 0;

let width = 400;
let height = 450;

function updateSizes() {
  width = container.clientWidth;
  height = container.clientHeight;
}

let walls = [];
function createWalls() {
  if (walls.length > 0) Composite.remove(world, walls);
  walls = [];
  const wallOptions = { isStatic: true, render: { visible: false } };

  // Дно (толстое, чтобы фрукты не проваливались)
  walls.push(Bodies.rectangle(width / 2, height + 30, width, 60, wallOptions));
  
  // Левая и правая стены (сдвинуты наружу, чтобы фрукты падали в самый край)
  walls.push(Bodies.rectangle(-20, height / 2, 40, height * 2, { ...wallOptions, angle: 0 }));
  walls.push(Bodies.rectangle(width + 20, height / 2, 40, height * 2, { ...wallOptions, angle: 0 }));

  Composite.add(world, walls);
}
if (window.ResizeObserver) {
  new ResizeObserver(() => {
    updateSizes();
    createWalls();
  }).observe(container);
} else {
  window.addEventListener('resize', () => {
    updateSizes();
    createWalls();
  });
}

function renderProgressBar() {
  progressBar.innerHTML = '';
  EMOJIS.forEach((emoji, index) => {
    const el = document.createElement('div');
    el.className = 'progress-fruit' + (unlockedFruits[index] ? ' unlocked' : '');
    el.textContent = emoji;
    progressBar.appendChild(el);
  });
}

function updateLevel() {
  const newLevel = Math.floor(score / scorePerLevel) + 1;
  if (newLevel > level) {
    level = newLevel;
    document.getElementById('levelVal').textContent = level;
    tileSpeed = 0.7 + (level - 1) * 0.15;
    spawnInterval = Math.max(800, 2500 - (level - 1) * 200);
  }
}

function updateNextFruitDisplay() {
  document.getElementById('nextFruitVal').textContent = EMOJIS[nextFruitLevel];
}

function spawnConveyorTile() {
  if (isGameOver) return;

  const isGolden = Math.random() < 0.1;
  const val = nextFruitLevel;

  nextFruitLevel = Math.random() > 0.7 ? 1 : 0;
  updateNextFruitDisplay();

  const tile = document.createElement('div');
  tile.className = 'conveyor-tile' + (isGolden ? ' golden' : '');
  tile.textContent = EMOJIS[val];
  tile.dataset.val = val;
  tile.dataset.golden = isGolden;
  const startX = width;
  tile.style.left = startX + 'px';

 tile.addEventListener('click', () => {
    if (isGameOver) return;
    
    // Берем позицию фрукта на ленте
    dropFruit(val, tile.offsetLeft, isGolden);
    playSound('drop');
    tile.remove();
    // Убираем фрукт из массива, чтобы он не "висел" там мертвым грузом
    conveyorTiles = conveyorTiles.filter(t => t.el !== tile);
  });

  conveyorWrapper.appendChild(tile);
  conveyorTiles.push({ el: tile, x: startX, val: val, isGolden: isGolden });
}

function createFruit(x, y, level, isGolden = false) {
  const radius = (20 + level * 5) * (width / 400);
  const body = Bodies.circle(x, y, radius, {
    restitution: 0.5, friction: 0.5, density: 0.001,
    label: 'fruit_' + level + (isGolden ? '_golden' : ''),
    render: { fillStyle: 'transparent' }
  });
  Composite.add(world, body);

  const el = document.createElement('div');
  el.style.position = 'absolute';
  el.style.width = radius * 2 + 'px';
  el.style.height = radius * 2 + 'px';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.fontSize = radius * 1.5 + 'px';
  el.style.pointerEvents = 'none';
  el.textContent = EMOJIS[level];
  if (isGolden) {
    el.style.filter = 'drop-shadow(0 0 10px gold)';
  }
  container.appendChild(el);

  body.domEl = el;
  body.level = level;
  body.isGolden = isGolden;
  activeBodies.push(body);

  if (!unlockedFruits[level]) {
    unlockedFruits[level] = true;
    renderProgressBar();
  }

  return body;
}

function dropFruit(level, x, isGolden) {
  const radius = (20 + level * 5) * (width / 400);
  const safeX = Math.max(radius + 10, Math.min(x, width - radius - 10));
  createFruit(safeX, 50, level, isGolden);
}

function spawnParticles(x, y) {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
    p.style.setProperty('--dx', (Math.random() - 0.5) * 100 + 'px');
    p.style.setProperty('--dy', (Math.random() - 0.5) * 100 + 'px');
    container.appendChild(p);
    setTimeout(() => p.remove(), 500);
  }
}

Events.on(engine, 'collisionStart', (event) => {
  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const bodyA = pairs[i].bodyA;
    const bodyB = pairs[i].bodyB;
    if (bodyA.label.startsWith('fruit_') && bodyB.label.startsWith('fruit_')) {
      const levelA = Number(bodyA.label.split('_')[1]);
      const levelB = Number(bodyB.label.split('_')[1]);
      if (levelA === levelB && levelA < EMOJIS.length - 1) {
        const newLevel = levelA + 1;
        const newX = (bodyA.position.x + bodyB.position.x) / 2;
        const newY = (bodyA.position.y + bodyB.position.y) / 2;
        const isGolden = bodyA.isGolden && bodyB.isGolden;

        removeFruit(bodyA);
        removeFruit(bodyB);

        const newBody = createFruit(newX, newY, newLevel, isGolden);
        if (newBody.domEl) {
          newBody.domEl.classList.add('merge-animation');
          setTimeout(() => newBody.domEl.classList.remove('merge-animation'), 300);
        }

        spawnParticles(newX, newY);
        playSound('merge');

        if (isGolden) {
          updateCoins(50);
        }

        score += (newLevel + 1) * 10;
        document.getElementById('scoreVal').textContent = score;

        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem('mergeBestScore', bestScore);
          document.getElementById('recordVal').textContent = bestScore;
          
          // Показываем окно "Новый рекорд!" только один раз за игру
          if (!window.recordShown) {
            window.recordShown = true;
            
            // Воспроизводим звук монетки как фанфары
            playSound('coin'); 
            
            const recordDiv = document.createElement('div');
            recordDiv.className = 'modal';
            recordDiv.style.zIndex = '10000';
            recordDiv.innerHTML = `
              <h2 style="color:#fbbf24; font-size: 32px; text-shadow: 0 0 15px gold; text-align: center;">🏆 Новый Рекорд!</h2>
              <p style="font-size: 24px; margin: 20px 0;">${score} очков</p>
              <button class="btn" id="closeRecordBtn" style="background: #fbbf24; color: #1a1a2e; padding: 12px 30px; font-size: 18px;">Круто!</button>
            `;
            document.body.appendChild(recordDiv);
            
            document.getElementById('closeRecordBtn').onclick = () => {
              recordDiv.remove();
            };
          }
        }
        updateLevel();
        updateEarrings();
      }
    }
  }
});

function removeFruit(body) {
  const index = activeBodies.indexOf(body);
  if (index > -1) activeBodies.splice(index, 1);
  if (body.domEl && body.domEl.parentNode) body.domEl.remove();
  Composite.remove(world, body);
}

function updateDOM() {
  // ПАУЗА, ЕСЛИ ОТКРЫТО МЕНЮ (МАГАЗИН ИЛИ БОНУС)
const activeModal = document.querySelector('.modal:not(.hidden)');
if (activeModal) {
animationId = requestAnimationFrame(updateDOM); // Продолжаем цикл, сохраняя ID
    return; // Останавливаем движение конвейера и физику
}
  if (!isGameOver) {
    for (let i = conveyorTiles.length - 1; i >= 0; i--) {
      const t = conveyorTiles[i];
      t.x -= tileSpeed;
      t.el.style.left = t.x + 'px';
      if (t.x < -70) {
        t.el.remove();
        conveyorTiles.splice(i, 1);
        loseLife();
      }
    }
    const now = performance.now();
    if (now - lastSpawnTime > spawnInterval) {
      spawnConveyorTile();
      lastSpawnTime = now;
    }
  }
  activeBodies.forEach(body => {
    if (body.domEl) {
      body.domEl.style.left = (body.position.x - body.circleRadius) + 'px';
      body.domEl.style.top = (body.position.y - body.circleRadius) + 'px';
    }
  });
  animationId = requestAnimationFrame(updateDOM);
}

function loseLife() {
  lives--;
  document.getElementById('livesVal').textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
  playSound('lose');
  if (lives <= 0) gameOver();
}

function gameOver() {
  isGameOver = true;
  cancelAnimationFrame(animationId);
  const t = translations[currentLang];

  const overDiv = document.createElement('div');
  overDiv.className = 'modal game-over-modal';
  overDiv.innerHTML = `
  <h2 style="color:#e94560; font-size:36px; margin-bottom:10px;">${t.gameOver}</h2>
  <p class="score-text" style="font-size:24px; margin-bottom:20px;">${t.yourScore} ${score}</p>
  <button class="btn btn-restart" id="continueAdBtn" style="background-color: #4CAF50; margin-bottom: 10px; display: block; width: 100%;">▶ Продолжить за рекламу</button>
  <button class="btn btn-restart" id="restartGameBtn" style="display: block; width: 100%;">${t.restart}</button>
`;
container.appendChild(overDiv);
  // Логика для кнопки "Продолжить за рекламу"
document.getElementById('continueAdBtn').addEventListener('click', () => {
    window.showAdReward(function() {
        overDiv.remove(); // Убираем экран Game Over
        isGameOver = false;
        lives = 3; // Возвращаем 3 жизни
        document.getElementById('livesVal').textContent = '❤️❤️❤️';
        
        // Очищаем старые фрукты с поля
        activeBodies.forEach(body => {
            if (body.domEl) body.domEl.remove();
            Matter.Composite.remove(world, body);
        });
        activeBodies = [];
        
        // Сбрасываем таймеры, чтобы первый фрукт появился сразу
        lastSpawnTime = performance.now();
        nextFruitLevel = 0;
        
        // Восстанавливаем физику и анимацию
        updateSizes();
        createWalls();
        cancelAnimationFrame(animationId);
        updateDOM();
    });
});
// Логикаэ для обычной кнопки "Заново"
document.getElementById('restartGameBtn').addEventListener('click', () => {
    window.showAdFullscreen(); // Полноэкранная реклама (на Яндексе)
    resetGame();
});
}

function resetGame() {
  cancelAnimationFrame(animationId);

  activeBodies.forEach(body => {
    if (body.domEl) body.domEl.remove();
    Composite.remove(world, body);
  });
  activeBodies = [];
  conveyorTiles.forEach(t => t.el.remove());
  conveyorTiles = [];

score = 0;
lives = 3;
level = 1;
tileSpeed = 0.7;
spawnInterval = 2500;
isGameOver = false;
unlockedFruits = new Array(EMOJIS.length).fill(false);
unlockedFruits[0] = true;
  document.getElementById('scoreVal').textContent = '0';
  document.getElementById('livesVal').textContent = '❤️❤️❤️';
  document.getElementById('levelVal').textContent = '1';
  document.getElementById('nextFruitVal').textContent = EMOJIS[0];
  renderProgressBar();

  const overDiv = document.querySelector('.game-over-modal');
  if (overDiv) overDiv.remove();

  updateSizes();
  createWalls();
  spawnConveyorTile();
  updateDOM();
}

setInterval(() => {
  const modalOpen = document.querySelector('.modal:not(.hidden)');
  if (!isGameOver && !modalOpen) Engine.update(engine, 1000 / 60);
}, 1000 / 60);
updateSizes();
createWalls();
renderProgressBar();
document.getElementById('recordVal').textContent = bestScore;
document.getElementById('coinVal').textContent = coins;
spawnConveyorTile();
updateDOM();
applyTranslation();
// =========================================
// ОЖИВЛЯЕМ КНОПКИ УПРАВЛЕНИЯ
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Кнопка Звука
    const sBtn = document.getElementById('soundBtn');
    if (sBtn) {
        sBtn.addEventListener('click', () => {
            soundOn = !soundOn;
            sBtn.innerText = soundOn ? '🔊 ' : '🔇 ';
        });
    }

    // 2. Кнопка Магазина
    const shBtn = document.getElementById('shopBtn');
    const shModal = document.getElementById('shopModal');
    if (shBtn && shModal) {
        shBtn.addEventListener('click', () => {
            if (typeof renderShop === 'function') renderShop();
            shModal.classList.remove('hidden');
        });
    }

    // 4. Смена языка через выпадающий список
const langSelect = document.getElementById('langSelect');
if (langSelect) {
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value; // Берем выбранный язык
        localStorage.setItem('mergeLang', currentLang); // Сохраняем выбор
        applyTranslation(); // Применяем перевод
        
        // Если магазин открыт, обновляем его, чтобы названия тем тоже перевелись
        if (typeof renderShop === 'function') renderShop(); 
    });
}
// 3. Кнопка Подарка (ЕЖЕДНЕВНЫЙ БОНУС С ЗАЩИТОЙ И КНОПКОЙ ЗАКРЫТИЯ)
    // Проверяем, доступен ли подарок, чтобы включить мигание
    const todayStr = new Date().toDateString();
    const lastClaimDate = localStorage.getItem('mergeLastLogin');
    if (lastClaimDate !== todayStr) {
        const giftBtn = document.getElementById('dailyBtn');
        if (giftBtn) giftBtn.classList.add('gift-active');
    }
    const dBtn = document.getElementById('dailyBtn');
    const dModal = document.getElementById('dailyModal');
    if (dBtn && dModal) {
        dBtn.addEventListener('click', () => {
            const content = dModal.querySelector('.modal-content') || dModal;
            const lastClaim = localStorage.getItem('mergeLastLogin');
            const today = new Date().toDateString();

            if (lastClaim === today) {
                // Если уже забирал — показываем отказ и кнопку Закрыть
                content.innerHTML = `
                    <h2 style="color:#38bdf8; text-align:center;">Ежедневный бонус</h2>
                    <p style="text-align:center; font-size:18px; margin-top: 20px;">Вы уже забрали бонус сегодня!</p>
                    <p style="text-align:center; font-size:16px; color: #aaa;">Возвращайтесь завтра.</p>
                    <button id="closeBonusBtn" style="display:block; margin: 20px auto; padding:10px 20px; background:#555; color:white; border:none; border-radius:5px; font-size:16px; cursor:pointer;">Закрыть</button>
                `;
                document.getElementById('closeBonusBtn').onclick = () => dModal.classList.add('hidden');
            } else {
                // Если еще не забирал — показываем награду и кнопку Закрыть
                content.innerHTML = `
                    <h2 style="color:#38bdf8; text-align:center;">Ежедневный бонус</h2>
                    <p style="text-align:center; font-size:18px;">Твой стрик: ${loginStreak} дней</p>
                    <p style="text-align:center; font-size:24px; color:#FFD700;">${dailyRewards[loginStreak - 1] || 50} 🪙 </p>
                    <button id="claimBonusBtn" style="display:block; margin: 20px auto; padding:10px 20px; background:#4CAF50; color:white; border:none; border-radius:5px; font-size:16px; cursor:pointer;">Забрать</button>
                    <button id="closeBonusBtn" style="display:block; margin: 10px auto; padding:5px 15px; background:transparent; color:#aaa; border:none; font-size:14px; cursor:pointer;">Закрыть</button>
                `;
                
                const claimBtn = document.getElementById('claimBonusBtn');
                claimBtn.onclick = () => {
                    claimBtn.disabled = true;
                    claimBtn.style.background = '#555';
                    
                    let currentStreak = loginStreak > 0 ? loginStreak : 1;
                    if (currentStreak > 7) currentStreak = 1;
                    const reward = dailyRewards[currentStreak - 1] || 50;
                    
                    coins += reward;
                    localStorage.setItem('mergeCoins', coins);
                    localStorage.setItem('mergeLastLogin', today);
                    localStorage.setItem('mergeLoginStreak', currentStreak + 1);
                    const giftBtn = document.getElementById('dailyBtn');
                    if (giftBtn) giftBtn.classList.remove('gift-active'); 
                    document.getElementById('coinVal').textContent = coins;
                    dModal.classList.add('hidden');
                    alert(`Вы получили ${reward} монет!`);
                };
                
                document.getElementById('closeBonusBtn').onclick = () => dModal.classList.add('hidden');
            }
            dModal.classList.remove('hidden');
        });
    }
        // Скрываем экран загрузки
    setTimeout(() => {
        const loader = document.getElementById('loadingScreen');
        if (loader) loader.style.display = 'none';
    }, 800);
});