// Crea el diccionario de imagenes que usa el juego.
const assets = {
    // Carga la copa enemiga 1.
    libertadores: new Image(),
    // Carga la copa enemiga 2.
    sudamericana: new Image(),
    // Carga la copa enemiga 3.
    apertura: new Image(),
    // Carga la copa enemiga 4.
    mundial: new Image(),
    // Carga el item penal.
    penal: new Image(),
    // Carga el item arbitro.
    arbitro: new Image(),
    // Carga el enemigo especial Fideo.
    di_maria: new Image(),
    // Carga el enemigo especial Chiqui.
    chiqui: new Image(),
    // Carga el enemigo especial Infantino.
    infantino: new Image(),
    // Carga la pelota que vuelve al spawn.
    pelota: new Image()
};

// Asigna la ruta del sprite de la copa 1.
assets.libertadores.src = 'assets/img/FANTASMA1.png';
// Asigna la ruta del sprite de la copa 2.
assets.sudamericana.src = 'assets/img/FANTASMA2.png';
// Asigna la ruta del sprite de la copa 3.
assets.apertura.src = 'assets/img/FANTASMA3.png';
// Asigna la ruta del sprite de la copa 4.
assets.mundial.src = 'assets/img/FANTASMA4.png';
// Asigna la ruta del penal.
assets.penal.src = 'assets/img/PENAL.jpg';
// Asigna la ruta del arbitro.
assets.arbitro.src = 'assets/img/arbitro.png';
// Asigna la ruta de Di Maria.
assets.di_maria.src = 'assets/img/DIMARIA.png';
// Asigna la ruta de Chiqui.
assets.chiqui.src = 'assets/img/CHIQUI.png';
// Asigna la ruta de Infantino.
assets.infantino.src = 'assets/img/INFANTINO.png';
// Asigna la ruta de la pelota de retorno.
assets.pelota.src = 'assets/img/PELOTA.png';

// Dibuja una imagen centrada sin deformarla.
function drawCenteredImage(ctx, img, centerX, centerY, maxWidth, maxHeight) {
    // Calcula el factor para que la imagen entre dentro del maximo pedido.
    const ratio = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight);
    // Calcula el ancho final respetando proporcion.
    const width = img.naturalWidth * ratio;
    // Calcula el alto final respetando proporcion.
    const height = img.naturalHeight * ratio;
    // Dibuja la imagen tomando el centro como punto de referencia.
    ctx.drawImage(img, centerX - width / 2, centerY - height / 2, width, height);
}

// Crea los efectos de sonido del juego.
const sounds = {
    // Sonido de click de interfaz.
    click: new Audio('assets/sounds/click.wav'),
    // Sonido al recoger un punto.
    eat: new Audio('assets/sounds/recoger.wav'),
    // Sonido al recoger un penal.
    penal: new Audio('assets/sounds/recoger.wav'),
    // Sonido al recoger un arbitro.
    arbitro: new Audio('assets/sounds/recoger.wav'),
    // Sonido al comer una copa debil.
    eatGhost: new Audio('assets/sounds/choque.wav'),
    // Sonido al perder una vida.
    die: new Audio('assets/sounds/choque.wav'),
    // Sonido al terminar la partida.
    gameOver: new Audio('assets/sounds/gameover.wav'),
    // Sonido al subir de nivel.
    newLevel: new Audio('assets/sounds/nuevonivel.wav')
};

// Crea las musicas principales.
const music = {
    // Musica del menu.
    menu: new Audio('assets/sounds/menu.mp3'),
    // Musica de la partida.
    play: new Audio('assets/sounds/play.mp3')
};

// Configura las musicas para que se repitan y no tapen los efectos.
Object.values(music).forEach(track => {
    // Repite la musica continuamente.
    track.loop = true;
    // Baja el volumen de la musica.
    track.volume = 0.32;
    // Pide al navegador que cargue la pista antes de reproducir.
    track.preload = 'auto';
});

// Configura un volumen base para todos los efectos.
Object.values(sounds).forEach(sound => {
    // Aplica volumen moderado.
    sound.volume = 0.85;
    // Pide al navegador que cargue el efecto antes de reproducir.
    sound.preload = 'auto';
});

// Baja un poco el click porque se repite mucho.
sounds.click.volume = 0.5;

// Baja un poco el sonido de recoger para no saturar.
sounds.eat.volume = 0.62;

// Guarda si el audio ya fue habilitado por una accion del usuario.
let audioUnlocked = false;

// Habilita audio despues del primer click, toque o tecla.
function unlockAudio() {
    // Sale si ya estaba habilitado.
    if (audioUnlocked) return;
    // Marca el audio como habilitado.
    audioUnlocked = true;
    // Carga todos los efectos.
    Object.values(sounds).forEach(sound => sound.load());
    // Carga todas las musicas.
    Object.values(music).forEach(track => track.load());
}

// Reproduce un efecto por nombre.
function playSound(soundName) {
    // Busca el sonido pedido.
    const snd = sounds[soundName];
    // Sale si no existe.
    if (!snd) return;
    // Crea una copia para que los efectos repetidos no se corten entre si.
    const instance = snd.cloneNode();
    // Copia el volumen configurado.
    instance.volume = snd.volume;
    // Reproduce la copia.
    instance.play().catch(() => {});
}

// Detiene toda la musica.
function stopMusic() {
    // Recorre cada pista musical.
    Object.values(music).forEach(track => {
        // Pausa la pista.
        track.pause();
        // La vuelve al inicio.
        track.currentTime = 0;
    });
}

// Reproduce una musica y apaga las demas.
function playMusic(trackName) {
    // Busca la pista pedida.
    const track = music[trackName];
    // Sale si no existe esa pista.
    if (!track) return;
    // Recorre todas las pistas para apagar las que no corresponden.
    Object.entries(music).forEach(([name, otherTrack]) => {
        // Si esta pista no es la pedida, la apaga.
        if (name !== trackName) {
            // Pausa la otra pista.
            otherTrack.pause();
            // La reinicia para que empiece limpia la proxima vez.
            otherTrack.currentTime = 0;
        }
    });
    // Intenta reproducir la pista elegida.
    track.play().catch(() => {});
}

// Expone el desbloqueo de audio para main.js.
window.unlockAudio = unlockAudio;
