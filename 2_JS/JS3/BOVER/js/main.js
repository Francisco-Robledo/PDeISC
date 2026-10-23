document.addEventListener('DOMContentLoaded', () => {
    const menuScreen = document.getElementById('main-menu');
    const setupScreen = document.getElementById('setup-screen');
    const rankingScreen = document.getElementById('ranking-screen');
    const creditsScreen = document.getElementById('credits-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');

    const btnToSetup = document.getElementById('btn-to-setup');
    const btnToRanking = document.getElementById('btn-to-ranking');
    const btnToCredits = document.getElementById('btn-to-credits');

    const btn1p = document.getElementById('btn-1p');
    const btn2p = document.getElementById('btn-2p');
    const p2Container = document.getElementById('p2-container');
    const btnStart = document.getElementById('btn-start');
    const btnBackSetup = document.getElementById('btn-back-setup');
    let currentMode = "1";

    const btnBackRanking = document.getElementById('btn-back-ranking');
    const btnClearHistory = document.getElementById('btn-clear-history');
    const btnBackCredits = document.getElementById('btn-back-credits');
    const btnRestart = document.getElementById('btn-restart');
    const btnMenu = document.getElementById('btn-menu');
    const btnPauseGame = document.getElementById('btn-pause-game');
    const btnGameMenu = document.getElementById('btn-game-menu');
    const btnFullscreenGame = document.getElementById('btn-fullscreen-game');
    const confirmModal = document.getElementById('confirm-modal');
    const btnConfirmYes = document.getElementById('btn-confirm-yes');
    const btnConfirmNo = document.getElementById('btn-confirm-no');
    let pendingConfirmAction = null;
    const allScreens = [menuScreen, setupScreen, rankingScreen, creditsScreen, gameScreen, gameOverScreen];

    function changeScreen(hideScreen, showScreen) {
        allScreens.forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        showScreen.classList.remove('hidden');
        showScreen.classList.add('active');
    }

    function playClick() {
        if (window.playUiClick) window.playUiClick();
    }

    function updateDeviceControls() {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 900;
        document.body.classList.toggle('touch-device', isTouchDevice);
        document.body.classList.toggle('desktop-device', !isTouchDevice);
    }

    async function enterFullscreenMode() {
        if (document.fullscreenElement) return;
        if (document.documentElement.requestFullscreen) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (error) {
                console.warn('Pantalla completa no disponible', error);
            }
        }
    }

    async function toggleFullscreenMode() {
        if (document.fullscreenElement && document.exitFullscreen) {
            try {
                await document.exitFullscreen();
            } catch (error) {
                console.warn('No se pudo salir de pantalla completa', error);
            }
            return;
        }
        await enterFullscreenMode();
    }

    function updateFullscreenButton() {
        btnFullscreenGame.textContent = document.fullscreenElement ? 'SALIR' : 'PANTALLA';
    }

    updateDeviceControls();
    updateFullscreenButton();
    window.addEventListener('resize', updateDeviceControls);
    window.addEventListener('orientationchange', updateDeviceControls);
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('pointerdown', () => { if (window.unlockAudio) window.unlockAudio(); }, { once: true });
    document.addEventListener('keydown', () => { if (window.unlockAudio) window.unlockAudio(); }, { once: true });

    document.addEventListener('click', (event) => {
        if (event.target.closest('button')) playClick();
    });

    window.showOnlyScreen = (screenId) => {
        const screen = document.getElementById(screenId);
        if (screen) changeScreen(null, screen);
    };

    btnToSetup.addEventListener('click', () => {
        if (window.stopCurrentGame) window.stopCurrentGame();
        if (window.playMenuMusic) window.playMenuMusic();
        changeScreen(menuScreen, setupScreen);
    });
    btnToRanking.addEventListener('click', () => {
        if (window.playMenuMusic) window.playMenuMusic();
        renderRankingTable();
        changeScreen(menuScreen, rankingScreen);
    });
    btnToCredits.addEventListener('click', () => {
        if (window.playMenuMusic) window.playMenuMusic();
        changeScreen(menuScreen, creditsScreen);
    });

    btnBackSetup.addEventListener('click', () => {
        if (window.playMenuMusic) window.playMenuMusic();
        changeScreen(setupScreen, menuScreen);
    });
    btnBackRanking.addEventListener('click', () => {
        if (window.playMenuMusic) window.playMenuMusic();
        changeScreen(rankingScreen, menuScreen);
    });
    btnBackCredits.addEventListener('click', () => {
        if (window.playMenuMusic) window.playMenuMusic();
        changeScreen(creditsScreen, menuScreen);
    });
    btnMenu.addEventListener('click', () => {
        if (window.stopCurrentGame) window.stopCurrentGame();
        if (window.playMenuMusic) window.playMenuMusic();
        changeScreen(gameOverScreen, menuScreen);
    });
    btnPauseGame.addEventListener('click', () => {
        if (window.toggleGamePause) window.toggleGamePause();
    });
    btnGameMenu.addEventListener('click', () => {
        if (window.stopCurrentGame) window.stopCurrentGame();
        if (window.playMenuMusic) window.playMenuMusic();
        changeScreen(gameScreen, menuScreen);
    });
    btnFullscreenGame.addEventListener('click', toggleFullscreenMode);

    btn1p.addEventListener('click', () => {
        currentMode = "1";
        btn1p.classList.add('active');
        btn2p.classList.remove('active');
        p2Container.classList.add('hidden');
    });

    btn2p.addEventListener('click', () => {
        currentMode = "2";
        btn2p.classList.add('active');
        btn1p.classList.remove('active');
        p2Container.classList.remove('hidden');
    });

    btnStart.addEventListener('click', () => {
        const name1 = document.getElementById('p1-name').value || "JUGADOR 1";
        const team1 = document.getElementById('p1-team').value;
        const name2 = document.getElementById('p2-name').value || "JUGADOR 2";
        const team2 = document.getElementById('p2-team').value;

        document.getElementById('name-p1').textContent = name1;
        if (currentMode === "2") {
            document.getElementById('name-p2').textContent = name2;
            document.getElementById('score-p2-container').classList.remove('hidden');
        } else {
            document.getElementById('score-p2-container').classList.add('hidden');
        }

        if (window.Storage && Storage.getHighScore) {
            document.getElementById('high-score').textContent = Storage.getHighScore();
        }

        changeScreen(setupScreen, gameScreen);
        enterFullscreenMode();

        if (window.initGame) {
            window.initGame(currentMode, name1, team1, name2, team2);
        }
    });

    btnRestart.addEventListener('click', () => {
        if (window.stopCurrentGame) window.stopCurrentGame();
        if (window.playMenuMusic) window.playMenuMusic();
        changeScreen(gameOverScreen, setupScreen);
    });

    async function renderRankingTable() {
        const tbody = document.getElementById('history-table-body');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 15px; color: var(--boca-yellow);">CONECTANDO AL SERVIDOR...</td></tr>';

        let history = (window.Storage && Storage.getMatchHistory) ? await Storage.getMatchHistory() : [];
        tbody.innerHTML = '';

        if (!history || history.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 15px; color: #555;">EL ARCHIVO HISTORY.JSON ESTA VACIO</td></tr>';
            return;
        }

        history.sort((a, b) => b.totalScore - a.totalScore);

        history.slice(0, 10).forEach(match => {
            let dateText = "-";
            if (match.date) {
                const dateObj = new Date(match.date);
                dateText = dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }

            const modeLabel = match.mode === "1" ? "1 JUGADOR" : "CO-OP 2J";
            const colorJ1 = match.p1Team === 'boca' ? '#fecb00' : '#ed1c24';
            const colorJ2 = match.p2Team === 'boca' ? '#fecb00' : '#ed1c24';
            const labelPlayers = match.mode === "1"
                ? `<span style="color: ${colorJ1}">${match.p1Name}</span>`
                : `<span style="color: ${colorJ1}">${match.p1Name}</span>+<span style="color: ${colorJ2}">${match.p2Name}</span>`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="color: #888;">${dateText}</td>
                <td>${modeLabel}</td>
                <td>${labelPlayers}</td>
                <td style="color: #39ff14; font-weight: bold;">${match.totalScore}</td>
                <td>${match.duration || "00:00"}</td>
            `;
            tbody.appendChild(row);
        });
    }

    function openConfirmModal(onConfirm) {
        pendingConfirmAction = onConfirm;
        confirmModal.classList.remove('hidden');
    }

    function closeConfirmModal() {
        pendingConfirmAction = null;
        confirmModal.classList.add('hidden');
    }

    btnConfirmYes.addEventListener('click', async () => {
        if (pendingConfirmAction) await pendingConfirmAction();
        closeConfirmModal();
    });

    btnConfirmNo.addEventListener('click', closeConfirmModal);

    btnClearHistory.addEventListener('click', () => {
        openConfirmModal(async () => {
            if (Storage && Storage.clearHistory) {
                await Storage.clearHistory();
                renderRankingTable();
            }
        });
    });
});
