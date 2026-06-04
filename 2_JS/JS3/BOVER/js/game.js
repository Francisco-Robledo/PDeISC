let canvas, ctx, animationId;
let players = [], dots = [], ghosts = [];
let gameMode = "1", isPlaying = false, level = 1;
let lives = 3, gameSeconds = 0, timerInterval = null;
let diMariaGhost = null, diMariaTimer = 0;
let levelMessageTimer = 0;
let specialSpawnWarningTimer = 0;

function getSpecialEnemyConfig() {
    return specialEnemies[Math.min(level, specialEnemies.length) - 1];
}

const mapLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 1, 2, 1, 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 2, 1, 4, 4, 4, 1, 2, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 2, 1, 1, 1, 1, 1, 2, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function initGame(mode, p1Name, p1Team, p2Name, p2Team) {
    playMusic('play');
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = COLS * TILE_SIZE;
    canvas.height = ROWS * TILE_SIZE;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    gameMode = mode; players = []; dots = []; ghosts = [];
    diMariaGhost = null; diMariaTimer = 0; levelMessageTimer = 0; specialSpawnWarningTimer = 0;
    level = 1; lives = 3; gameSeconds = 0; isPlaying = false;

    const gameLayout = document.querySelector('.game-layout');
    if (gameLayout) {
        gameLayout.classList.toggle('one-player', mode === "1");
        gameLayout.classList.toggle('two-players', mode === "2");
    }
    
    updateLevelDisplay();
    updateLivesDisplay(); updateTimerDisplay();

    if (timerInterval) clearInterval(timerInterval); timerInterval = null;

    let p1Controls = mode === "1" ? "both" : "wasd";
    players.push(new Player(1, p1Name, p1Team, 13 * TILE_SIZE + TILE_SIZE/2, 11 * TILE_SIZE + TILE_SIZE/2, p1Controls));

    if (mode === "2") {
        players.push(new Player(2, p2Name, p2Team, 14 * TILE_SIZE + TILE_SIZE/2, 11 * TILE_SIZE + TILE_SIZE/2, "arrows"));
    }

    ghosts.push(new Ghost(13, 7, "#ff0000", "LIB", "libertadores", "chase"));  
    ghosts.push(new Ghost(12, 8, "#ff66b2", "APE", "apertura", "ambush"));     
    ghosts.push(new Ghost(14, 8, "#00ffff", "MUN", "mundial", "flank"));       
    ghosts.push(new Ghost(13, 8, "#00ff00", "SUD", "sudamericana", "random")); 

    setupControls(); generateDots();
    document.getElementById('pause-overlay').innerHTML = "<p>¡PARTIDO EN PAUSA!<br>Presioná una tecla para moverte</p>";
    document.getElementById('pause-overlay').classList.remove('hidden');
    if (animationId) cancelAnimationFrame(animationId);
    gameLoop();
}

function startGameAction() {
    if (!isPlaying) {
        isPlaying = true;
        document.getElementById('pause-overlay').classList.add('hidden');
        if (!timerInterval) {
            timerInterval = setInterval(() => {
                if (isPlaying) { gameSeconds++; updateTimerDisplay(); }
            }, 1000);
        }
    }
}

function toggleGamePause() {
    if (!canvas) return;
    const overlay = document.getElementById('pause-overlay');
    isPlaying = !isPlaying;
    if (isPlaying) {
        overlay.classList.add('hidden');
    } else {
        overlay.innerHTML = "<p>PARTIDO EN PAUSA<br>Presiona PAUSA para seguir</p>";
        overlay.classList.remove('hidden');
    }
}

function stopCurrentGame() {
    isPlaying = false;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
    stopMusic();
}

function updateTimerDisplay() {
    let m = Math.floor(gameSeconds / 60).toString().padStart(2, '0');
    let s = (gameSeconds % 60).toString().padStart(2, '0');
    document.getElementById('time-display').textContent = `${m}:${s}`;
}

function updateLivesDisplay() {
    let hearts = ""; for(let i=0; i<lives; i++) hearts += "V ";
    document.getElementById('lives-display').textContent = hearts.trim() || "X";
}

function updateLevelDisplay() {
    document.getElementById('level-display').textContent = level;
    document.querySelectorAll('.level-step').forEach(step => {
        const stepLevel = Number(step.dataset.levelStep);
        step.classList.toggle('active', stepLevel <= Math.min(level, MAX_LEVEL));
    });
}

function resetPlayersForNextLevel() {
    if (players[0]) {
        players[0].x = 13 * TILE_SIZE + TILE_SIZE / 2;
        players[0].y = 11 * TILE_SIZE + TILE_SIZE / 2;
        players[0].dirX = 0;
        players[0].dirY = 0;
        players[0].setIntent('STOP');
    }
    if (players[1]) {
        players[1].x = 14 * TILE_SIZE + TILE_SIZE / 2;
        players[1].y = 11 * TILE_SIZE + TILE_SIZE / 2;
        players[1].dirX = 0;
        players[1].dirY = 0;
        players[1].setIntent('STOP');
    }
}

function showLevelMessage() {
    const specialEnemy = getSpecialEnemyConfig();
    const overlay = document.getElementById('pause-overlay');
    overlay.innerHTML = `<p class="level-message">NIVEL ${level}<br>${specialEnemy.label} DESBLOQUEADO<br>Presiona una tecla o boton</p>`;
    overlay.classList.remove('hidden');
    levelMessageTimer = 120;
}

function advanceLevel() {
    if (level >= MAX_LEVEL) {
        triggerGameOver();
        return;
    }
    playSound('newLevel');
    level++;
    updateLevelDisplay();
    resetPlayersForNextLevel();
    ghosts.forEach(g => {
        g.isScared = false;
        g.scaredTimer = 0;
        g.returningHome = false;
        g.returnPath = [];
        g.returnPathIndex = 0;
    });
    diMariaGhost = null;
    diMariaTimer = 0;
    specialSpawnWarningTimer = 0;
    isPlaying = false;
    generateDots();
    showLevelMessage();
}

function generateDots() {
    dots = []; let normalDots = []; 
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (mapLayout[r][c] === 0 || mapLayout[r][c] === 3) { 
                let isArbitro = mapLayout[r][c] === 3;
                let newDot = {
                    x: c * TILE_SIZE + TILE_SIZE / 2, y: r * TILE_SIZE + TILE_SIZE / 2,
                    radius: isArbitro ? 5 : 2, isArbitro: isArbitro, isPenal: false
                };
                dots.push(newDot);
                if (!isArbitro) normalDots.push(newDot);
            }
        }
    }
    if (normalDots.length > 0) {
        let penalDot = normalDots[Math.floor(Math.random() * normalDots.length)];
        penalDot.isPenal = true; penalDot.radius = 5;
    }
}

function setupControls() {
    if (!window.boverKeyboardReady) {
        window.addEventListener('keydown', handleKeyDown);
        window.boverKeyboardReady = true;
    }
    setupTouchControls();
}

function handleKeyDown(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) e.preventDefault();
    if (e.shiftKey && (e.key === '0' || e.code === 'Digit0')) {
        e.preventDefault();
        advanceLevel();
        return;
    }
    startGameAction();
    const key = e.key.toLowerCase();
    players.forEach(p => {
        if (p.controls === "both" || p.controls === "wasd") {
            if (key === 'w') p.setIntent('UP'); if (key === 's') p.setIntent('DOWN');
            if (key === 'a') p.setIntent('LEFT'); if (key === 'd') p.setIntent('RIGHT');
        }
        if (p.controls === "both" || p.controls === "arrows") {
            if (key === 'arrowup') p.setIntent('UP'); if (key === 'arrowdown') p.setIntent('DOWN');
            if (key === 'arrowleft') p.setIntent('LEFT'); if (key === 'arrowright') p.setIntent('RIGHT');
        }
    });
}

function setPlayerIntent(playerId, direction) {
    startGameAction();
    const player = players.find(p => p.id === playerId);
    if (player) player.setIntent(direction);
}

function setupTouchControls() {
    if (window.boverTouchReady) return;
    document.querySelectorAll('.touch-btn').forEach(btn => {
        const sendIntent = (event) => {
            event.preventDefault();
            const playerId = Number(btn.dataset.player);
            const direction = btn.dataset.direction;
            btn.classList.add('pressed');
            setPlayerIntent(playerId, direction);
        };
        const release = () => btn.classList.remove('pressed');

        btn.addEventListener('pointerdown', sendIntent);
        btn.addEventListener('pointerup', release);
        btn.addEventListener('pointercancel', release);
        btn.addEventListener('pointerleave', release);
    });
    window.boverTouchReady = true;
}

window.setPlayerIntent = setPlayerIntent;

function update() {
    if (!isPlaying) return;

    players.forEach(p => p.update(canvas.width, canvas.height, mapLayout, TILE_SIZE));
    
    ghosts.forEach(g => {
        let target = players[0];
        if (gameMode === "2" && players.length > 1) {
            const dist1 = Math.hypot(players[0].x - g.x, players[0].y - g.y);
            const dist2 = Math.hypot(players[1].x - g.x, players[1].y - g.y);
            if (dist2 < dist1) target = players[1];
        }
        g.update(mapLayout, TILE_SIZE, target);
    });
    
    if (!diMariaGhost && specialSpawnWarningTimer <= 0 && Math.random() < SPECIAL_SPAWN_CHANCE) {
        specialSpawnWarningTimer = SPECIAL_WARNING_TIME;
    }

    if (!diMariaGhost && specialSpawnWarningTimer > 0) {
        specialSpawnWarningTimer--;
        if (specialSpawnWarningTimer === 0) {
            const specialEnemy = getSpecialEnemyConfig();
            diMariaGhost = new Ghost(13, 7, "#ffffff", specialEnemy.label, specialEnemy.imgKey, "chase");
            diMariaGhost.speed = 2.25; diMariaTimer = 540;
        }
    }

    if (diMariaGhost) {
        diMariaTimer--;
        let target = players[0];
        if (gameMode === "2" && players.length > 1) {
            if (Math.hypot(players[1].x - diMariaGhost.x, players[1].y - diMariaGhost.y) < Math.hypot(players[0].x - diMariaGhost.x, players[0].y - diMariaGhost.y)) target = players[1];
        }
        diMariaGhost.update(mapLayout, TILE_SIZE, target);
        if (diMariaTimer <= 0) diMariaGhost = null; 
    }

    players.forEach(p => {
        for (let i = dots.length - 1; i >= 0; i--) {
            const dot = dots[i];
            const dist = Math.hypot(p.x - dot.x, p.y - dot.y);
            if (dist < p.radius + dot.radius) {
                if (dot.isPenal) { p.score += 50; playSound('penal'); } 
                else if (dot.isArbitro) {
                    p.score += 20; playSound('arbitro');
                    ghosts.forEach(g => { g.isScared = true; g.scaredTimer = SCARED_TIME; });
                    if (diMariaGhost) { diMariaGhost.isScared = true; diMariaGhost.scaredTimer = SCARED_TIME; }
                } else { p.score += 10; playSound('eat'); }
                updateHUD(p); dots.splice(i, 1);
            }
        }
    });

    players.forEach(p => {
        ghosts.forEach(g => {
            if (g.returningHome) return;
            if (Math.hypot(p.x - g.x, p.y - g.y) < p.radius + g.radius - 3) { 
                if (g.isScared) {
                    p.score += 200; updateHUD(p); playSound('eatGhost');
                    g.startReturnHome(mapLayout, TILE_SIZE);
                } else handlePlayerDeath();
            }
        });
        if (diMariaGhost && Math.hypot(p.x - diMariaGhost.x, p.y - diMariaGhost.y) < p.radius + diMariaGhost.radius - 3) {
            if (diMariaGhost.isScared) {
                p.score += 500; updateHUD(p); playSound('eatGhost'); diMariaGhost = null; 
            } else handlePlayerDeath();
        }
    });

    if (dots.length === 0) advanceLevel();
}

function handlePlayerDeath() {
    playSound('die'); lives--; updateLivesDisplay();
    
    const container = document.getElementById('canvas-container');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 400);

    if (lives > 0) {
        isPlaying = false;
        players.forEach(p => p.setIntent('STOP'));

        players[0].x = 13 * TILE_SIZE + TILE_SIZE/2; players[0].y = 11 * TILE_SIZE + TILE_SIZE/2;
        if (players[1]) { players[1].x = 14 * TILE_SIZE + TILE_SIZE/2; players[1].y = 11 * TILE_SIZE + TILE_SIZE/2; }

        ghosts[0].x = 13 * TILE_SIZE + TILE_SIZE/2; ghosts[0].y = 7 * TILE_SIZE + TILE_SIZE/2;
        ghosts[1].x = 12 * TILE_SIZE + TILE_SIZE/2; ghosts[1].y = 8 * TILE_SIZE + TILE_SIZE/2;
        ghosts[2].x = 14 * TILE_SIZE + TILE_SIZE/2; ghosts[2].y = 8 * TILE_SIZE + TILE_SIZE/2;
        ghosts[3].x = 13 * TILE_SIZE + TILE_SIZE/2; ghosts[3].y = 8 * TILE_SIZE + TILE_SIZE/2;
        
        ghosts.forEach(g => { g.isScared = false; g.returningHome = false; g.returnPath = []; g.returnPathIndex = 0; });
        diMariaGhost = null; specialSpawnWarningTimer = 0;

        document.getElementById('pause-overlay').innerHTML = "<p>¡GOL EN CONTRA!<br>Presioná una tecla para reanudar...</p>";
        document.getElementById('pause-overlay').classList.remove('hidden');
    } else triggerGameOver();
}

function updateHUD(player) {
    document.getElementById(`score-p${player.id}`).textContent = player.score;
    let currentTotal = player.score;
    if (gameMode === "2") {
        currentTotal = players[0].score + players[1].score;
    }
    if (Storage.checkAndSaveRecord(currentTotal)) document.getElementById('high-score').textContent = currentTotal;
}

function triggerGameOver() {
    isPlaying = false;
    if (timerInterval) clearInterval(timerInterval); timerInterval = null;
    stopMusic();
    playSound('gameOver');

    let finalScore = gameMode === "2" ? players[0].score + players[1].score : players[0].score;
    document.getElementById('final-score').textContent = finalScore;
    
    if (Storage.checkAndSaveRecord(finalScore)) document.getElementById('new-record-panel').classList.remove('hidden');
    else document.getElementById('new-record-panel').classList.add('hidden');

    let m = Math.floor(gameSeconds / 60).toString().padStart(2, '0');
    let s = (gameSeconds % 60).toString().padStart(2, '0');
    document.getElementById('final-time').textContent = `${m}:${s}`;

    // Enviamos a Node.js la fecha actual junto a la partida
    const matchData = {
        mode: gameMode, p1Name: players[0].name, p1Team: players[0].team, p1Score: players[0].score,
        p2Name: gameMode === "2" ? players[1].name : null, p2Team: gameMode === "2" ? players[1].team : null,
        p2Score: gameMode === "2" ? players[1].score : 0, totalScore: finalScore, duration: `${m}:${s}`,
        date: new Date().toISOString() // Agrega fecha de guardado automático
    };
    Storage.saveMatchHistory(matchData);

    if (window.showOnlyScreen) {
        window.showOnlyScreen('game-over-screen');
    } else {
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('game-over-screen').classList.add('active');
    }
}

function drawMaze() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (mapLayout[r][c] === 1) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = "#1b5e20"; 
                ctx.fillRect(c * TILE_SIZE + 1, r * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();

    dots.forEach(dot => {
        if (dot.isPenal) {
            if (assets.penal.complete && assets.penal.naturalWidth !== 0) {
                drawCenteredImage(ctx, assets.penal, dot.x, dot.y, ITEM_SPRITE_SIZE, ITEM_SPRITE_SIZE);
            } else {
                ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#fecb00'; ctx.fill();
                ctx.shadowBlur = 10; ctx.shadowColor = "rgba(254, 203, 0, 0.8)"; ctx.closePath();
            }
        } else if (dot.isArbitro) {
            if (assets.arbitro.complete && assets.arbitro.naturalWidth !== 0) {
                drawCenteredImage(ctx, assets.arbitro, dot.x, dot.y, ARBITRO_SPRITE_SIZE, ARBITRO_SPRITE_SIZE);
            } else {
                ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#000000'; ctx.fill(); ctx.closePath();
            }
        } else {
            ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.closePath();
        }
        ctx.shadowBlur = 0; 
    });

    players.forEach(p => p.draw(ctx));
    ghosts.forEach(g => g.draw(ctx));

    if (diMariaGhost) {
        diMariaGhost.draw(ctx);
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(canvas.width / 2 - 110, 5, 220, 30);
        ctx.fillStyle = "#fecb00"; ctx.font = "bold 8px 'Press Start 2P'"; ctx.textAlign = "center";
        ctx.fillText(`¡FIDEO ACTIVO! ${Math.ceil(diMariaTimer/60)}s`, canvas.width / 2, 24);
    }
}

function drawGameClean() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();

    dots.forEach(dot => {
        if (dot.isPenal) {
            if (assets.penal.complete && assets.penal.naturalWidth !== 0) {
                drawCenteredImage(ctx, assets.penal, dot.x, dot.y, ITEM_SPRITE_SIZE, ITEM_SPRITE_SIZE);
            } else {
                ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#fecb00'; ctx.fill(); ctx.closePath();
            }
        } else if (dot.isArbitro) {
            if (assets.arbitro.complete && assets.arbitro.naturalWidth !== 0) {
                drawCenteredImage(ctx, assets.arbitro, dot.x, dot.y, ARBITRO_SPRITE_SIZE, ARBITRO_SPRITE_SIZE);
            } else {
                ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#000000'; ctx.fill(); ctx.closePath();
            }
        } else {
            ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.closePath();
        }
        ctx.shadowBlur = 0;
    });

    players.forEach(p => p.draw(ctx));
    ghosts.forEach(g => g.draw(ctx));

    if (!diMariaGhost && specialSpawnWarningTimer > 0) {
        const specialEnemy = getSpecialEnemyConfig();
        ctx.fillStyle = "rgba(0, 0, 0, 0.76)";
        ctx.fillRect(canvas.width / 2 - 135, 5, 270, 30);
        ctx.fillStyle = "#ed1c24";
        ctx.font = "bold 8px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText(`${specialEnemy.label} ESTA POR ENTRAR`, canvas.width / 2, 24);
    }

    if (diMariaGhost) {
        const specialEnemy = getSpecialEnemyConfig();
        diMariaGhost.draw(ctx);
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(canvas.width / 2 - 120, 5, 240, 30);
        ctx.fillStyle = "#fecb00";
        ctx.font = "bold 8px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText(`${specialEnemy.message} ${Math.ceil(diMariaTimer / 60)}s`, canvas.width / 2, 24);
    }
}

function gameLoop() {
    update(); drawGameClean();
    animationId = requestAnimationFrame(gameLoop);
}

window.initGame = initGame;
window.toggleGamePause = toggleGamePause;
window.stopCurrentGame = stopCurrentGame;
window.playMenuMusic = () => playMusic('menu');
window.stopAllMusic = stopMusic;
window.playUiClick = () => playSound('click');
