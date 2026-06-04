(function () {
    // Servicio de audio: centraliza musica y efectos para no mezclar sonidos con logica del juego.
    const SOUND_PATHS = {
        click: "assets/sounds/click.wav",
        collect: "assets/sounds/recoger.wav",
        specialCollect: "assets/sounds/recoger(especial).wav",
        crash: "assets/sounds/choque.wav",
        event: "assets/sounds/eventoloco.wav",
        levelUp: "assets/sounds/nuevonivel.wav",
        gameOver: "assets/sounds/gameover.wav",
        record: "assets/sounds/record.wav",
        menuMusic: "assets/sounds/menu.mp3",
        gameMusic: "assets/sounds/play.mp3"
    };

    const VOLUMES = {
        music: 0.28,
        effects: 0.65
    };

    const effects = {};
    let menuMusic = null;
    let gameMusic = null;
    let currentMusic = null;
    let unlocked = false;

    // Crea un elemento de audio con volumen, loop y precarga configurados.
    function createAudio(src, volume, loop) {
        const audio = new Audio(src);
        audio.volume = volume;
        audio.loop = Boolean(loop);
        audio.preload = "auto";
        return audio;
    }

    // Carga todos los audios una sola vez y los deja listos para usar.
    function ensureLoaded() {
        if (menuMusic) {
            return;
        }

        menuMusic = createAudio(SOUND_PATHS.menuMusic, VOLUMES.music, true);
        gameMusic = createAudio(SOUND_PATHS.gameMusic, VOLUMES.music, true);

        Object.entries(SOUND_PATHS).forEach(([name, path]) => {
            if (name.endsWith("Music")) {
                return;
            }

            effects[name] = createAudio(path, VOLUMES.effects, false);
        });
    }

    // Desbloquea el audio despues de una interaccion real del usuario.
    function unlock() {
        // Los navegadores solo permiten audio luego de una accion del usuario.
        ensureLoaded();
        unlocked = true;
    }

    // Reproduce efectos cortos clonando el audio para permitir sonidos superpuestos.
    function playEffect(name) {
        ensureLoaded();

        if (!unlocked || !effects[name]) {
            return;
        }

        const sound = effects[name].cloneNode();
        sound.volume = effects[name].volume;
        sound.play().catch(function () {});
    }

    // Cambia entre musica de menu y musica de partida.
    function playMusic(trackName) {
        ensureLoaded();

        if (!unlocked) {
            return;
        }

        const nextMusic = trackName === "game" ? gameMusic : menuMusic;

        if (currentMusic === nextMusic && !currentMusic.paused) {
            return;
        }

        stopMusic();
        currentMusic = nextMusic;
        currentMusic.currentTime = 0;
        currentMusic.play().catch(function () {});
    }

    // Detiene ambas pistas y las vuelve al inicio.
    function stopMusic() {
        [menuMusic, gameMusic].forEach((music) => {
            if (!music) {
                return;
            }

            music.pause();
            music.currentTime = 0;
        });
    }

    // Pausa la musica actual sin reiniciarla.
    function pauseMusic() {
        if (currentMusic) {
            currentMusic.pause();
        }
    }

    // Reanuda la musica pausada, por ejemplo al salir de pausa.
    function resumeMusic() {
        if (unlocked && currentMusic) {
            currentMusic.play().catch(function () {});
        }
    }

    window.AudioService = {
        unlock,
        playEffect,
        playMusic,
        stopMusic,
        pauseMusic,
        resumeMusic
    };
})();
