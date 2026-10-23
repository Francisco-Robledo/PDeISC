const ALFABETO = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
const VIDAS_INICIALES = 6;
const NOMBRE_VALIDO = /^[\p{L}][\p{L}\s'-]{1,29}$/u;

class JuegoAhorcado {
    constructor() {
        this.elements = {
            canvas: document.querySelector('#hangmanCanvas'), word: document.querySelector('#wordDisplay'), keyboard: document.querySelector('#keyboard'),
            lives: document.querySelector('#livesValue'), time: document.querySelector('#timeValue'), points: document.querySelector('#pointsValue'),
            message: document.querySelector('#gameMessage'), newGame: document.querySelector('#newGameButton'), exportPdf: document.querySelector('#exportPdfButton'),
            refreshScores: document.querySelector('#refreshScoresButton'), scoresBody: document.querySelector('#scoresBody'), theme: document.querySelector('#themeToggle'),
            scrollTop: document.querySelector('#scrollTopButton'), modal: document.querySelector('#resultModal'), resultTitle: document.querySelector('#resultModalTitle'),
            resultMessage: document.querySelector('#resultMessage'), form: document.querySelector('#scoreForm'), name: document.querySelector('#playerName'),
            nameLabel: document.querySelector('#playerNameLabel'), nameFeedback: document.querySelector('#nameFeedback'), save: document.querySelector('#saveScoreButton'), toastContainer: document.querySelector('#toastContainer')
        };
        this.context = this.elements.canvas.getContext('2d');
        this.modal = new bootstrap.Modal(this.elements.modal);
        this.state = { word: '', guessed: new Set(), lives: VIDAS_INICIALES, seconds: 0, points: 0, finished: false, won: false, timer: null };
        this.bindEvents();
        this.restoreTheme();
        this.startGame();
        this.loadScores();
    }

    bindEvents() {
        this.elements.newGame.addEventListener('click', () => this.startGame());
        this.elements.exportPdf.addEventListener('click', () => this.exportPdf());
        this.elements.refreshScores.addEventListener('click', () => this.loadScores());
        this.elements.form.addEventListener('submit', (event) => this.saveScore(event));
        this.elements.theme.addEventListener('click', () => this.toggleTheme());
        this.elements.scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => this.elements.scrollTop.classList.toggle('visible', window.scrollY > 300));
        document.querySelectorAll('#menuPrincipal .nav-link').forEach((link) => link.addEventListener('click', () => {
            bootstrap.Collapse.getOrCreateInstance(document.querySelector('#menuPrincipal')).hide();
        }));
    }

    async request(url, body = {}) {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) throw new Error(data.mensaje || 'No se pudo completar la solicitud.');
        return data;
    }

    async startGame() {
        clearInterval(this.state.timer);
        this.state = { word: '', guessed: new Set(), lives: VIDAS_INICIALES, seconds: 0, points: 0, finished: false, won: false, timer: null };
        this.elements.newGame.disabled = true;
        this.elements.exportPdf.disabled = true;
        this.elements.message.textContent = 'Solicitando una palabra...';
        this.render();
        try {
            const { palabra } = await this.request('/api/game/word');
            const word = String(palabra).trim().toLocaleUpperCase('es-AR');
            if (!/^[A-ZÁÉÍÓÚÜÑ\s]{3,30}$/u.test(word)) throw new Error('La palabra recibida no es apta para jugar.');
            this.state.word = word;
            this.elements.message.textContent = 'Elegí una letra para comenzar.';
            this.startTimer();
        } catch (error) {
            this.elements.message.textContent = error.message;
            this.showToast('No se pudo iniciar la partida. Intentá de nuevo.', 'danger');
        } finally {
            this.elements.newGame.disabled = false;
            this.render();
        }
    }

    startTimer() { this.state.timer = setInterval(() => { this.state.seconds += 1; this.updateStats(); }, 1000); }
    formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
    calculatePoints() { return this.state.won ? this.state.lives * 100 + Math.max(0, 120 - this.state.seconds) * 5 : 0; }

    guess(letter) {
        if (this.state.finished || this.state.guessed.has(letter) || !this.state.word) return;
        this.state.guessed.add(letter);
        if (!this.state.word.includes(letter)) this.state.lives -= 1;
        const pending = [...this.state.word].some((character) => character !== ' ' && !this.state.guessed.has(character));
        if (!pending) this.finish(true);
        if (this.state.lives === 0) this.finish(false);
        this.render();
    }

    finish(won) {
        this.state.finished = true; this.state.won = won; clearInterval(this.state.timer);
        this.state.points = this.calculatePoints(); this.elements.exportPdf.disabled = false;
        this.elements.resultTitle.textContent = won ? '¡Ganaste!' : 'Fin de la partida';
        this.elements.resultMessage.textContent = won ? `Resolviste “${this.state.word}” en ${this.formatTime(this.state.seconds)} y obtuviste ${this.state.points} puntos.` : `La palabra era “${this.state.word}”. Podés iniciar una nueva partida cuando quieras.`;
        this.elements.form.hidden = !won; this.elements.nameLabel.hidden = !won; this.elements.name.value = ''; this.clearNameError();
        this.elements.message.textContent = won ? '¡Excelente trabajo!' : `La palabra era: ${this.state.word}`;
        this.modal.show();
    }

    render() { this.updateStats(); this.drawHangman(); this.renderWord(); this.renderKeyboard(); }
    updateStats() { this.elements.lives.textContent = this.state.lives; this.elements.time.textContent = this.formatTime(this.state.seconds); this.elements.points.textContent = this.state.points; }
    renderWord() {
        this.elements.word.replaceChildren();
        [...this.state.word].forEach((character) => {
            const slot = document.createElement('span');
            if (character === ' ') { slot.className = 'word-space'; slot.setAttribute('aria-hidden', 'true'); }
            else { slot.className = 'letter-slot'; slot.textContent = this.state.guessed.has(character) || this.state.finished ? character : ''; }
            this.elements.word.append(slot);
        });
    }
    renderKeyboard() {
        this.elements.keyboard.replaceChildren();
        ALFABETO.forEach((letter) => {
            const button = document.createElement('button'); button.type = 'button'; button.className = 'key-button'; button.textContent = letter;
            const pressed = this.state.guessed.has(letter); button.disabled = pressed || this.state.finished || !this.state.word;
            if (pressed) button.classList.add(this.state.word.includes(letter) ? 'correct' : 'wrong');
            button.addEventListener('click', () => this.guess(letter)); this.elements.keyboard.append(button);
        });
    }
    drawHangman() {
        const ctx = this.context; ctx.clearRect(0, 0, 300, 330); ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--canvas').trim(); ctx.lineWidth = 6; ctx.lineCap = 'round';
        const lines = [[[35,300],[265,300]], [[75,300],[75,30]], [[75,30],[185,30]], [[185,30],[185,65]], [[185,88],[185,128]], [[185,128],[155,166]], [[185,128],[215,166]], [[185,110],[157,85]], [[185,110],[213,85]]];
        lines.slice(0, 4).forEach(([[x1,y1],[x2,y2]]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
        if (this.state.lives < 6) { ctx.beginPath(); ctx.arc(185, 78, 15, 0, Math.PI * 2); ctx.stroke(); }
        lines.slice(4, 4 + Math.max(0, 5 - this.state.lives)).forEach(([[x1,y1],[x2,y2]]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
    }

    async saveScore(event) {
        event.preventDefault(); const nombre = this.elements.name.value.trim().replace(/\s+/g, ' ');
        if (!NOMBRE_VALIDO.test(nombre)) return this.showNameError('Ingresá un nombre de 2 a 30 caracteres.');
        this.clearNameError(); this.elements.save.disabled = true;
        try { await this.request('/api/scores', { nombre, puntos: this.state.points, tiempo: this.state.seconds }); this.modal.hide(); this.showToast('Puntaje guardado correctamente.', 'success'); await this.loadScores(); }
        catch (error) { this.showNameError(error.message); } finally { this.elements.save.disabled = false; }
    }
    showNameError(message) { this.elements.name.classList.add('is-invalid'); this.elements.nameFeedback.textContent = message; }
    clearNameError() { this.elements.name.classList.remove('is-invalid'); this.elements.nameFeedback.textContent = ''; }
    async loadScores() {
        this.elements.refreshScores.disabled = true;
        try { const { scores } = await this.request('/api/scores/top'); this.renderScores(scores); }
        catch (error) { this.renderScores([]); this.showToast('No se pudo cargar la tabla de posiciones.', 'danger'); }
        finally { this.elements.refreshScores.disabled = false; }
    }
    renderScores(scores) {
        this.elements.scoresBody.replaceChildren();
        if (!scores.length) { const row = document.createElement('tr'); const cell = document.createElement('td'); cell.colSpan = 5; cell.className = 'text-center'; cell.textContent = 'Todavía no hay puntajes guardados.'; row.append(cell); this.elements.scoresBody.append(row); return; }
        scores.forEach((score, index) => { const row = document.createElement('tr'); [index + 1, score.nombre, score.puntos, this.formatTime(score.tiempo), new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(score.fecha))].forEach((value) => { const cell = document.createElement('td'); cell.textContent = String(value); row.append(cell); }); this.elements.scoresBody.append(row); });
    }
    exportPdf() {
        if (!this.state.finished || !window.jspdf) return this.showToast('Finalizá una partida para exportar el resultado.', 'danger');
        const { jsPDF } = window.jspdf; const pdf = new jsPDF(); pdf.setFontSize(22); pdf.text('El Ahorcado — Resultado', 20, 25); pdf.setFontSize(13); pdf.text(`Palabra: ${this.state.word}`, 20, 48); pdf.text(`Resultado: ${this.state.won ? 'Ganada' : 'Perdida'}`, 20, 60); pdf.text(`Puntos: ${this.state.points}`, 20, 72); pdf.text(`Tiempo: ${this.formatTime(this.state.seconds)}`, 20, 84); pdf.text(`Vidas restantes: ${this.state.lives}`, 20, 96); pdf.save('resultado-ahorcado.pdf');
    }
    toggleTheme() { document.body.classList.toggle('dark-mode'); const dark = document.body.classList.contains('dark-mode'); localStorage.setItem('ahorcado-theme', dark ? 'dark' : 'light'); this.elements.theme.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'); this.drawHangman(); }
    restoreTheme() { if (localStorage.getItem('ahorcado-theme') === 'dark') this.toggleTheme(); }
    showToast(message, variant) { const toast = document.createElement('div'); toast.className = `toast align-items-center text-bg-${variant} border-0`; toast.setAttribute('role', 'alert'); const body = document.createElement('div'); body.className = 'd-flex'; const text = document.createElement('div'); text.className = 'toast-body'; text.textContent = message; const close = document.createElement('button'); close.type = 'button'; close.className = 'btn-close me-2 m-auto'; close.dataset.bsDismiss = 'toast'; close.setAttribute('aria-label', 'Cerrar'); body.append(text, close); toast.append(body); this.elements.toastContainer.append(toast); const instance = new bootstrap.Toast(toast, { delay: 4000 }); toast.addEventListener('hidden.bs.toast', () => toast.remove()); instance.show(); }
}

document.addEventListener('DOMContentLoaded', () => new JuegoAhorcado());
