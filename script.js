// ==========================================
// 1. БЕЗОПАСНЫЙ БЛОК РЕКЛАМЫ ЯНДЕКСА
// ==========================================
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

// ==========================================
// 2. ПЕРЕВОДЫ (10 ЯЗЫКОВ)
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
// 3. КОНФИГ ТЕМ И БЛОКИРОВЩИКОВ
// ==========================================
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
// 4. СОСТОЯНИЕ ИГРЫ
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
document.body.className = 'theme-' + activeThemeId;
let unlockedFruits = new Array(EMOJIS.length).fill(false);
unlockedFruits[0] = true;

let loginStreak = Number(localStorage.getItem('mergeLoginStreak')) || 0;
const dailyRewards = [50, 60, 70, 80, 100, 150, 300];

// ==========================================
// 5. ЗВУКИ
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
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
  }
}

// ==========================================
// 6. УТИЛИТЫ
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
  const shopBtn = document.getElementById('shopBtn');
  if(shopBtn) shopBtn.textContent = '🛒 ' + t.shop;
  const titleText = document.getElementById('titleText');
  if(titleText) titleText.textContent = t.title;
  const lvlLabel = document.getElementById('lvlLabel');
  if(lvlLabel) lvlLabel.textContent = t.level;
  const scoreLabel = document.getElementById('scoreLabel');
  if(scoreLabel) scoreLabel.textContent = t.score;
  const livesLabel = document.getElementById('livesLabel');
  if(livesLabel) livesLabel.textContent = t.lives;
  const nextLabel = document.getElementById('nextLabel');
  if(nextLabel) nextLabel.textContent = t.next;
  const recordLabel = document.getElementById('recordLabel');
  if(recordLabel) recordLabel.textContent = t.record;
}

window.setLang = function(lang) {
  currentLang = lang;
  localStorage.setItem('mergeLang', lang);
  applyTranslation();
  document.getElementById('langModal').classList.add('hidden');
};

// ==========================================
// 7. МАГАЗИН
// ==========================================
function renderShop() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
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
  renderShop();
}

function setActiveTheme(themeId) {
  activeThemeId = themeId;
  localStorage.setItem('mergeActiveTheme', themeId);
  currentTheme = themesConfig.find(t => t.id === themeId);
  document.body.className = 'theme-' + themeId;
  EMOJIS = currentTheme.emojis;

  unlockedFruits = new Array(EMOJIS.length).fill(false);
  unlockedFruits[0] = true;
  renderProgressBar();
  document.getElementById('shopModal').classList.add('hidden');
  resetGame();
}

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
let tileSpeed = 0.4;
let spawnInterval = 2500;
const scorePerLevel = 500;
let nextFruitLevel = 0;
let beltOffset = 0;

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
  walls.push(Bodies.rectangle(width / 2, height + 30, width, 60, wallOptions));
  walls.push(Bodies.rectangle(-20, height / 2, 40, height * 2, wallOptions));
  walls.push(Bodies.rectangle(width + 20, height / 2, 40, height * 2, wallOptions));
  Composite.add(world, walls);
}

if (window.ResizeObserver) {
  new ResizeObserver(() => { updateSizes(); createWalls(); }).observe(container);
} else {
  window.addEventListener('resize', () => { updateSizes(); createWalls(); });
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
    tileSpeed = 0.4 + (level - 1) * 0.05;
    spawnInterval = Math.max(800, 2500 - (level - 1) * 200);
  }
}

function updateNextFruitDisplay() {
  document.getElementById('nextFruitVal').textContent = EMOJIS[nextFruitLevel];
}

function spawnConveyorTile() {
  if (isGameOver) return;

  const isGolden = Math.random() < 0.1;
  const isBomb = Math.random() < 0.08;
  const isBlocker = Math.random() < 0.06;
  const val = nextFruitLevel;

  nextFruitLevel = Math.random() > 0.7 ? 1 : 0;
  updateNextFruitDisplay();

  const tile = document.createElement('div');
  tile.className = 'conveyor-tile' + (isGolden ? ' golden' : '');
  
  if (isBlocker) {
      tile.textContent = currentTheme.blocker;
      tile.dataset.isBlocker = 'true';
  } else if (isBomb) {
      tile.textContent = '💣';
      tile.dataset.isBomb = 'true';
  } else {
      tile.textContent = EMOJIS[val];
  }
  
  tile.dataset.val = val;
  tile.dataset.golden = isGolden;
  const startX = -80;
  tile.style.left = startX + 'px';

  tile.addEventListener('click', () => {
    if (isGameOver) return;
    if (isBlocker) {
        dropBlocker(tile.offsetLeft);
    } else if (isBomb) {
        dropBomb(tile.offsetLeft);
    } else {
        dropFruit(val, tile.offsetLeft, isGolden);
    }
    playSound('drop');
    tile.remove();
    conveyorTiles = conveyorTiles.filter(t => t.el !== tile);
  });

  conveyorWrapper.appendChild(tile);
  conveyorTiles.push({ el: tile, x: startX, val: val, isGolden: isGolden });
}

function createFruit(x, y, level, isGolden = false) {
  const radius = level === 99 ? 25 : (20 + level * 5) * (width / 400);
  const body = Bodies.circle(x, y, radius, {
    restitution: 0.02, friction: 0.9, density: 0.002, frictionAir: 0.01, slop: 0.05,
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
  el.style.pointerEvents = 'auto';
  el.textContent = EMOJIS[level];
  
  if (isGolden) el.style.filter = 'drop-shadow(0 0 10px gold)';
  container.appendChild(el);

  el.addEventListener('click', () => {
      if (isHammerActive) {
          spawnParticles(body.position.x, body.position.y);
          removeFruit(body);
          playSound('merge');
          hammerUses--;
          hammerCount.textContent = hammerUses;
          if (hammerUses <= 0) {
              isHammerActive = false;
              isGameOver = false;
              hammerBtn.classList.remove('active');
              document.getElementById('game-container').style.cursor = 'default';
          }
      }
  });

  body.domEl = el;
  body.level = level;
  body.isGolden = isGolden;
  body.birthTime = performance.now();
  activeBodies.push(body);

  if (!unlockedFruits[level] && level < EMOJIS.length) {
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

function dropBomb(x) {
    const radius = 30;
    const safeX = Math.max(radius + 10, Math.min(x, width - radius - 10));
    const bomb = createFruit(safeX, 50, 99, false);
    bomb.domEl.textContent = '💣';
    bomb.isBomb = true;
    
    setTimeout(() => {
        spawnParticles(bomb.position.x, bomb.position.y);
        playSound('lose');
        activeBodies.forEach(body => {
            if (body !== bomb) {
                const dist = Matter.Vector.magnitude(Matter.Vector.sub(bomb.position, body.position));
                if (dist < 100) removeFruit(body);
            }
        });
        removeFruit(bomb);
    }, 1000);
}

function dropBlocker(x) {
    const radius = 25;
    const safeX = Math.max(radius + 10, Math.min(x, width - radius - 10));
    const blocker = createFruit(safeX, 50, 99, false); 
    blocker.domEl.textContent = currentTheme.blocker;
    blocker.isBlocker = true;
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
        if (bodyA.isBlocker || bodyB.isBlocker || bodyA.isBomb || bodyB.isBomb) continue;

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

            if (isGolden) updateCoins(50);

            score += (newLevel + 1) * 10;
            document.getElementById('scoreVal').textContent = score;

            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('mergeBestScore', bestScore);
                document.getElementById('recordVal').textContent = bestScore;
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
    const activeModal = document.querySelector('.modal:not(.hidden)');
    if (activeModal) {
        animationId = requestAnimationFrame(updateDOM);
        return;
    }
    
    if (!isGameOver) {
        for (let i = conveyorTiles.length - 1; i >= 0; i--) {
            const t = conveyorTiles[i];
            t.x += tileSpeed;
            t.el.style.left = t.x + 'px';
            if (t.x > width + 70) {
                t.el.remove();
                conveyorTiles.splice(i, 1);
                loseLife();
            }
        }

        // Синхронизированное движение фона ленты
        beltOffset += tileSpeed;
        conveyorWrapper.style.backgroundPosition = `${beltOffset}px 0`;

        const now = performance.now();
        if (now - lastSpawnTime > spawnInterval) {
            spawnConveyorTile();
            lastSpawnTime = now;
        }

        const dangerY = height * 0.15; 
        for (let body of activeBodies) {
            const timeAlive = performance.now() - (body.birthTime || 0);
            if (body.position.y < dangerY && timeAlive > 1500) {
                gameOver();
                break;
            }
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

  document.getElementById('continueAdBtn').addEventListener('click', () => {
    window.showAdReward(() => {
        overDiv.remove();
        isGameOver = false;
        
        const clearY = height * 0.35;
        activeBodies = activeBodies.filter(body => {
            if (body.position.y < clearY) {
                if (body.domEl) body.domEl.remove();
                Matter.Composite.remove(world, body);
                return false;
            }
            return true;
        });
        
        lastSpawnTime = performance.now();
        updateDOM();
    });
  });

  document.getElementById('restartGameBtn').addEventListener('click', () => {
    window.showAdFullscreen();
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
  tileSpeed = 0.4;
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

// ==========================================
// 9. МОЛОТОК
// ==========================================
let hammerUses = 2;
let isHammerActive = false;
const hammerBtn = document.getElementById('hammerBtn');
const hammerCount = document.getElementById('hammerCount');

if (hammerBtn) {
    hammerBtn.style.display = 'flex';
    hammerBtn.addEventListener('click', () => {
        if (isHammerActive) {
            isHammerActive = false;
            isGameOver = false;
            hammerBtn.classList.remove('active');
            document.getElementById('game-container').style.cursor = 'default';
            return;
        }
        if (hammerUses > 0) {
            isHammerActive = true;
            isGameOver = true; 
            hammerBtn.classList.add('active');
            document.getElementById('game-container').style.cursor = 'crosshair';
        } else {
            window.showAdReward(() => {
                hammerUses = 2;
                hammerCount.textContent = hammerUses;
                isHammerActive = true;
                isGameOver = true; 
                hammerBtn.classList.add('active');
                document.getElementById('game-container').style.cursor = 'crosshair';
            });
        }
    });
}

// ==========================================
// 10. ИНИЦИАЛИЗАЦИЯ И КНОПКИ
// ==========================================
updateSizes();
createWalls();
renderProgressBar();
document.getElementById('recordVal').textContent = bestScore;
document.getElementById('coinVal').textContent = coins;
spawnConveyorTile();
updateDOM();
applyTranslation();

document.addEventListener('DOMContentLoaded', () => {
    // Язык
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('mousedown', () => { isGameOver = true; });
        langSelect.addEventListener('touchstart', () => { isGameOver = true; });
        langSelect.addEventListener('change', (e) => {
            currentLang = e.target.value; 
            localStorage.setItem('mergeLang', currentLang); 
            applyTranslation(); 
            renderShop(); 
            isGameOver = false;
        });
        langSelect.addEventListener('blur', () => { isGameOver = false; });
    }

    // Звук
    const sBtn = document.getElementById('soundBtn');
    if (sBtn) {
        sBtn.addEventListener('click', () => {
            soundOn = !soundOn;
            sBtn.innerText = soundOn ? '🔊' : '🔇';
        });
    }

    // Магазин
    const shBtn = document.getElementById('shopBtn');
    const shModal = document.getElementById('shopModal');
    if (shBtn && shModal) {
        shBtn.addEventListener('click', () => {
            renderShop();
            shModal.classList.remove('hidden');
        });
    }

    // Ежедневный бонус
    const dBtn = document.getElementById('dailyBtn');
    const dModal = document.getElementById('dailyModal');
    if (dBtn && dModal) {
        dBtn.addEventListener('click', () => {
            const content = dModal.querySelector('.modal-content') || dModal;
            const lastClaim = localStorage.getItem('mergeLastLogin');
            const today = new Date().toDateString();

            if (lastClaim === today) {
                content.innerHTML = `
                    <h2 style="color:#38bdf8; text-align:center;">Ежедневный бонус</h2>
                    <p style="text-align:center; font-size:18px; margin-top: 20px;">Вы уже забрали бонус сегодня!</p>
                    <button id="closeBonusBtn" style="display:block; margin: 20px auto; padding:10px 20px; background:#555; color:white; border:none; border-radius:5px; font-size:16px; cursor:pointer;">Закрыть</button>
                `;
                document.getElementById('closeBonusBtn').onclick = () => dModal.classList.add('hidden');
            } else {
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
                    updateCoins(reward);
                    localStorage.setItem('mergeLastLogin', today);
                    localStorage.setItem('mergeLoginStreak', currentStreak + 1);
                    dModal.classList.add('hidden');
                    alert(`Вы получили ${reward} монет!`);
                };
                document.getElementById('closeBonusBtn').onclick = () => dModal.classList.add('hidden');
            }
            dModal.classList.remove('hidden');
        });
    }

    // Кнопка Выхода
    const exitBtn = document.getElementById('exitBtn');
    if (exitBtn) {
        if (typeof ysdk !== 'undefined' && ysdk !== null) exitBtn.style.display = 'flex';
        exitBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите выйти?')) {
                if (ysdk && ysdk.sdk && ysdk.sdk.exit) ysdk.sdk.exit();
                else window.close();
            }
        });
    }

    // Скрытие экрана загрузки
    setTimeout(() => {
        const loader = document.getElementById('loadingScreen');
        if (loader) loader.style.display = 'none';
    }, 800);
});

// Пауза при сворачивании
document.addEventListener('visibilitychange', () => {
    if (document.hidden) isGameOver = true;
    else isGameOver = false;
});