(function () {
    const {
        CELL_COUNT,
        BASE_SPEED,
        LEVEL_POINTS,
        LEVEL_SPEEDS,
        TOPPING_POINTS,
        GOLDEN_TOPPING_POINTS,
        FINAL_SCORE_LIMIT,
        KEY_POINTS,
        KEY_VISIBLE_TICKS,
        KEY_INTERVAL_TICKS,
        GOLDEN_VISIBLE_TICKS,
        GOLDEN_INTERVAL_TICKS,
        OBSTACLE_INTERVAL_TICKS,
        MAX_OBSTACLES,
        EVENT_INTERVAL_SECONDS,
        EVENT_DURATION_TICKS,
        EVENT_WARNING_TICKS,
        MOVING_TOPPING_INTERVAL_TICKS,
        ASSET_PATHS,
        DIRECTIONS,
        OPPOSITES,
        KEY_MAP
    } = window.GameConfig;

    const {
        loadImage,
        sameCell,
        randomCell,
        hasOpenNeighbor,
        cloneTrail,
        lerp,
        formatDuration
    } = window.GameUtils;
    const { pickRandomEvent, needsWarning } = window.GameEvents;

    // Crea una instancia de partida con referencias al canvas, paneles y callbacks de la UI.
    function createGame(options) {
        // El estado vive en un solo objeto para que render, colisiones y UI trabajen sincronizados.
        const canvas = options.canvas;
        const context = canvas.getContext("2d");
        const boardWrapper = options.boardWrapper;
        const scorePanel = options.scorePanel;
        const matchSummary = options.matchSummary;
        const recordPanel = options.recordPanel;
        const onEnd = options.onEnd;

        const state = {
            // Referencias principales del DOM/canvas.
            canvas,
            context,
            boardWrapper,
            scorePanel,
            matchSummary,
            recordPanel,
            onEnd,
            onWaitingChange: options.onWaitingChange || function () {},

            // Datos de partida elegidos antes de jugar.
            record: options.record || null,
            mode: options.mode,
            players: [],

            // Elementos del mapa.
            topping: { x: 10, y: 10 },
            goldenTopping: null,
            obstacles: [],
            specialSauce: null,

            // Eventos temporales.
            currentEvent: null,
            pendingEvent: null,
            nextEventAt: EVENT_INTERVAL_SECONDS,
            eventBanner: createEventBanner(boardWrapper),

            // Nivel, velocidad y tiempo.
            level: 1,
            currentSpeed: BASE_SPEED,
            tickCount: 0,
            startedAt: null,
            elapsedSeconds: 0,

            // Timers y animacion.
            intervalId: null,
            animationFrameId: null,
            lastStepAt: performance.now(),

            // Estados generales de la partida.
            paused: false,
            waitingForInput: true,
            finished: false,

            // Cache de HTML para no re-renderizar paneles sin cambios.
            lastScoreMarkup: "",
            lastSummaryMarkup: "",
            lastRecordMarkup: "",
            lastRecordHighlight: false,

            // Imagenes cargadas una vez para dibujarlas en canvas.
            images: {
                map: loadImage(ASSET_PATHS.map),
                topping: loadImage(ASSET_PATHS.topping),
                goldenTopping: loadImage(ASSET_PATHS.goldenTopping),
                specialSauce: loadImage(ASSET_PATHS.specialSauce),
                obstacle: loadImage(ASSET_PATHS.obstacle),
                explosion: loadImage(ASSET_PATHS.explosion),
                panchoHead: loadImage(ASSET_PATHS.panchoHead),
                panchoTip: loadImage(ASSET_PATHS.panchoTip),
                panchoBodyHorizontal: loadImage(ASSET_PATHS.panchoBodyHorizontal),
                panchoBodyVertical: loadImage(ASSET_PATHS.panchoBodyVertical),
                panchoTurnRightDown: loadImage(ASSET_PATHS.panchoTurnRightDown),
                panchoTurnLeftDown: loadImage(ASSET_PATHS.panchoTurnLeftDown),
                panchoTurnRightUp: loadImage(ASSET_PATHS.panchoTurnRightUp),
                panchoTurnLeftUp: loadImage(ASSET_PATHS.panchoTurnLeftUp)
            },

            // Sprites con borde cacheados por jugador.
            outlinedSprites: {
                1: new Map(),
                2: new Map()
            },

            // Items con borde cacheados por color.
            outlinedItems: new Map()
        };
        let keydownAttached = false;

        // Se crean los jugadores con sus colores base y puntos de salida.
        state.players = [
            PlayerService.createPlayer({
                id: 1,
                name: options.playerNames[0],
                color: "#ffcc19",
                bodyColor: "rgba(255, 204, 25, 0.68)",
                headSprite: loadImage("assets/img/pancho-player-1.png"),
                bodySprite: loadImage("assets/img/pancho-body-player-1.png"),
                startPosition: { x: 5, y: 12 },
                startDirection: "right"
            })
        ];

        if (state.mode === 2) {
            state.players.push(PlayerService.createPlayer({
                id: 2,
                name: options.playerNames[1],
                color: "#55c7ff",
                bodyColor: "rgba(85, 199, 255, 0.62)",
                headSprite: loadImage("assets/img/pancho-player-2.png"),
                bodySprite: loadImage("assets/img/pancho-body-player-2.png"),
                startPosition: { x: 18, y: 12 },
                startDirection: "left"
            }));
        }

        function reset() {
            // Deja la partida como nueva, pero conserva modo, nombres y record cargado.
            // Reinicia jugadores y guarda su trail inicial para animacion.
            state.players.forEach(PlayerService.resetPlayer);
            state.players.forEach((player) => {
                player.previousTrail = cloneTrail(player.panchoTrail);
            });

            // Reinicia contadores de tiempo.
            state.tickCount = 0;
            state.startedAt = null;
            state.elapsedSeconds = 0;

            // Limpia items y eventos temporales.
            state.goldenTopping = null;
            state.obstacles = [];
            state.specialSauce = null;
            state.currentEvent = null;
            state.pendingEvent = null;
            state.nextEventAt = EVENT_INTERVAL_SECONDS;

            // Vuelve a valores iniciales de dificultad y estado.
            state.level = 1;
            state.currentSpeed = getSpeedForLevel(state.level);
            state.boardWrapper.classList.remove("event-shake", "event-active");
            state.waitingForInput = true;
            state.paused = false;
            state.finished = false;
            state.lastScoreMarkup = "";
            state.lastSummaryMarkup = "";
            state.lastRecordMarkup = "";
            state.lastRecordHighlight = false;

            // Coloca el primer aderezo y pinta los paneles iniciales.
            state.topping = randomToppingCell();
            hideEventBanner();
            state.onWaitingChange(true);
            renderScore();
            renderMatchSummary();
            renderRecord();
            draw(1);
        }

        function start() {
            // Arranca el ciclo logico y el ciclo visual. El pancho espera input antes de moverse.
            stop();
            reset();
            attachKeyboardControls();
            startRenderLoop();
            restartTickInterval();
        }

        // Detiene timers, animacion y controles para evitar partidas duplicadas en memoria.
        function stop() {
            if (state.intervalId) {
                clearInterval(state.intervalId);
                state.intervalId = null;
            }

            if (state.animationFrameId) {
                cancelAnimationFrame(state.animationFrameId);
                state.animationFrameId = null;
            }

            detachKeyboardControls();
        }

        function startRenderLoop() {
            // requestAnimationFrame suaviza el movimiento entre cada tick de logica.
            if (state.animationFrameId) {
                cancelAnimationFrame(state.animationFrameId);
            }

            const renderFrame = () => {
                const rawProgress = state.paused || state.waitingForInput ? 1 : Math.min(1, (performance.now() - state.lastStepAt) / state.currentSpeed);
                const smoothProgress = rawProgress * rawProgress * (3 - rawProgress * 2);
                draw(smoothProgress);
                state.animationFrameId = requestAnimationFrame(renderFrame);
            };

            state.animationFrameId = requestAnimationFrame(renderFrame);
        }

        function restartTickInterval() {
            // Los niveles cambian la velocidad, por eso se reinicia solo el intervalo de logica.
            if (state.intervalId) {
                clearInterval(state.intervalId);
            }

            state.intervalId = setInterval(tick, state.currentSpeed);
        }

        // Alterna pausa y devuelve el nuevo estado para que la UI cambie el boton.
        function togglePause() {
            if (state.finished) {
                return state.paused;
            }

            state.paused = !state.paused;
            return state.paused;
        }

        // Recibe una direccion desde teclado o botones tactiles y la aplica al jugador correcto.
        function setDirection(playerIndex, direction) {
            // Eventos temporales pueden alterar el jugador o invertir la direccion.
            const realPlayerIndex = getControlledPlayerIndex(playerIndex);
            const player = state.players[realPlayerIndex];
            const effectiveDirection = getEffectiveDirection(direction);

            // Si el jugador esta muerto, no puede cambiar de direccion.
            if (!player || !player.alive) {
                return;
            }

            // Evita giro de 180 grados.
            if (OPPOSITES[player.direction] === effectiveDirection) {
                return;
            }

            player.nextDirection = effectiveDirection;

            // Primer input real: empieza a correr el tiempo.
            if (state.waitingForInput) {
                state.waitingForInput = false;
                state.startedAt = Date.now();
                state.onWaitingChange(false);
            }
        }

        function tick() {
            // Un tick es un paso completo: tiempo, eventos, movimiento, niveles y UI.
            if (state.paused || state.finished || state.waitingForInput) {
                return;
            }

            state.tickCount += 1;
            updateElapsedTime();
            handleSpecialSauceTiming();
            handleGoldenToppingTiming();
            handleObstacleTiming();
            handleRandomEvents();
            maybeMoveToppingsDuringEvent();

            state.players.forEach((player) => {
                player.previousTrail = cloneTrail(player.panchoTrail);
            });

            movePlayers();
            checkLevelProgress();
            checkGameEnd();

            if (state.finished) {
                return;
            }

            renderScore();
            renderMatchSummary();
            renderRecord();
            state.lastStepAt = performance.now();
        }

        // Calcula la duracion usando la hora real desde el primer movimiento.
        function updateElapsedTime() {
            if (!state.startedAt) {
                state.elapsedSeconds = 0;
                return;
            }

            state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
        }

        function handleSpecialSauceTiming() {
            // La salsa de revivir aparece por tiempo limitado y luego se retira del mapa.
            if (!state.specialSauce && state.tickCount % KEY_INTERVAL_TICKS === 0) {
                state.specialSauce = {
                    ...randomToppingCell(),
                    expiresAt: state.tickCount + KEY_VISIBLE_TICKS
                };
            }

            if (state.specialSauce && state.tickCount > state.specialSauce.expiresAt) {
                state.specialSauce = null;
            }
        }

        // Controla aparicion y vencimiento del aderezo dorado de puntaje alto.
        function handleGoldenToppingTiming() {
            if (!state.goldenTopping && state.tickCount % GOLDEN_INTERVAL_TICKS === 0) {
                state.goldenTopping = {
                    ...randomToppingCell(),
                    expiresAt: state.tickCount + GOLDEN_VISIBLE_TICKS
                };
                showEventMessage("Aderezo dorado", "+50 puntos", false);
            }

            if (state.goldenTopping && state.tickCount > state.goldenTopping.expiresAt) {
                state.goldenTopping = null;
            }
        }

        // Agrega obstaculos de forma gradual hasta el maximo configurado.
        function handleObstacleTiming() {
            if (state.tickCount % OBSTACLE_INTERVAL_TICKS !== 0 || state.obstacles.length >= MAX_OBSTACLES) {
                return;
            }

            state.obstacles.push(randomSafeObstacleCell());
        }

        // Busca una casilla de obstaculo que no encierre aderezos ni aparezca pegada a la cabeza.
        function randomSafeObstacleCell() {
            let cell;
            let attempts = 0;

            do {
                cell = randomCell(getObstacleBlockedCells());
                attempts += 1;
            } while ((isNearAnyHead(cell) || isNearTopping(cell)) && attempts < 500);

            return cell;
        }

        // Evita que un obstaculo aparezca demasiado cerca de un jugador activo.
        function isNearAnyHead(cell) {
            return state.players.some((player) => {
                const head = player.panchoTrail[0];
                return Math.abs(head.x - cell.x) <= 2 && Math.abs(head.y - cell.y) <= 2;
            });
        }

        function handleRandomEvents() {
            // Cada cierto tiempo se prepara o activa un evento aleatorio que altera las reglas.
            if (state.currentEvent && state.tickCount >= state.currentEvent.endsAt) {
                endRandomEvent();
                return;
            }

            if (state.pendingEvent) {
                updatePendingEvent();
                return;
            }

            if (state.currentEvent || state.elapsedSeconds < state.nextEventAt) {
                return;
            }

            if (state.tickCount < 12) {
                return;
            }

            startRandomEvent();
        }

        // Elige un evento del catalogo y decide si necesita advertencia previa.
        function startRandomEvent() {
            const event = pickRandomEvent(state.mode);

            if (needsWarning(event)) {
                queueWarnedEvent(event);
                return;
            }

            activateRandomEvent(event);
        }

        // Prepara una cuenta regresiva antes de eventos especialmente injustos.
        function queueWarnedEvent(event) {
            state.pendingEvent = {
                ...event,
                startsAt: state.tickCount + EVENT_WARNING_TICKS,
                warningTitle: `${event.title} en`,
                lastCountdown: null
            };
            showEventMessage(state.pendingEvent.warningTitle, "3", true);
        }

        // Actualiza la cuenta regresiva y activa el evento cuando llega a cero.
        function updatePendingEvent() {
            const ticksLeft = Math.max(0, state.pendingEvent.startsAt - state.tickCount);
            const countdown = Math.max(1, Math.ceil(ticksLeft / 9));

            if (state.pendingEvent.lastCountdown !== countdown && ticksLeft > 0) {
                state.pendingEvent.lastCountdown = countdown;
                showEventMessage(state.pendingEvent.warningTitle, String(countdown), true);
            }

            if (state.tickCount >= state.pendingEvent.startsAt) {
                const event = state.pendingEvent;
                state.pendingEvent = null;
                activateRandomEvent(event);
            }
        }

        // Activa el evento actual, sacude la pantalla y muestra el cartel grande.
        function activateRandomEvent(event) {
            state.currentEvent = {
                ...event,
                endsAt: state.tickCount + EVENT_DURATION_TICKS
            };
            state.boardWrapper.classList.add("event-active", "event-shake");
            AudioService.playEffect("event");
            showEventMessage("Evento loco", event.title, true);
        }

        // Limpia el evento y programa el proximo ciclo de eventos.
        function endRandomEvent() {
            const endedTitle = state.currentEvent ? state.currentEvent.title : "";
            state.currentEvent = null;
            state.nextEventAt = state.elapsedSeconds + EVENT_INTERVAL_SECONDS;
            state.boardWrapper.classList.remove("event-active", "event-shake");
            showEventMessage("Evento terminado", endedTitle, false);
        }

        // Durante "aderezos movedizos" recoloca comida cada pocos ticks.
        function maybeMoveToppingsDuringEvent() {
            if (!isEventActive("moving-toppings") || state.tickCount % MOVING_TOPPING_INTERVAL_TICKS !== 0) {
                return;
            }

            state.topping = randomToppingCell();

            if (state.goldenTopping) {
                state.goldenTopping = {
                    ...randomToppingCell(),
                    expiresAt: state.goldenTopping.expiresAt
                };
            }
        }

        // Consulta simple para saber si cierta regla temporal esta activa.
        function isEventActive(type) {
            return state.currentEvent && state.currentEvent.type === type;
        }

        // Punto de extension para eventos que alteren controles entre jugadores.
        function getControlledPlayerIndex(playerIndex) {
            if (isEventActive("swap-controls") && state.mode === 2) {
                return playerIndex === 0 ? 1 : 0;
            }

            return playerIndex;
        }

        // Aplica el evento de controles al reves sin tocar el input original.
        function getEffectiveDirection(direction) {
            if (!isEventActive("reverse-controls")) {
                return direction;
            }

            return OPPOSITES[direction] || direction;
        }

        function movePlayers() {
            // Primero se calculan todos los movimientos y despues se aplican; asi 2 jugadores son justos.
            // plannedMoves evita que un jugador tenga ventaja por moverse antes que otro.
            const plannedMoves = state.players.map((player) => {
                if (!player.alive) {
                    return null;
                }

                // La direccion pendiente pasa a ser la direccion real del tick.
                player.direction = player.nextDirection;
                const vector = DIRECTIONS[player.direction];
                const head = player.panchoTrail[0];

                return {
                    player,
                    nextHead: {
                        x: head.x + vector.x,
                        y: head.y + vector.y
                    },
                    shouldGrow: false
                };
            });

            plannedMoves.forEach((move) => {
                if (!move) {
                    return;
                }

                // Revisa choque antes de insertar la nueva cabeza.
                if (isWallCollision(move.nextHead) || isPanchoCollision(move.player, move.nextHead) || isObstacleCollision(move.nextHead)) {
                    AudioService.playEffect("crash");
                    killOrRevive(move.player);
                    shakeBoard();
                    return;
                }

                // Agrega la cabeza nueva al principio del array.
                move.player.panchoTrail.unshift(move.nextHead);

                // Aderezo comun: suma 10 y permite crecer.
                if (sameCell(move.nextHead, state.topping)) {
                    AudioService.playEffect("collect");
                    move.shouldGrow = true;
                    move.player.score += TOPPING_POINTS;
                    move.player.toppingsCollected += 1;
                    state.topping = randomToppingCell();
                }

                // Aderezo dorado: puntaje alto y efecto especial.
                if (state.goldenTopping && sameCell(move.nextHead, state.goldenTopping)) {
                    AudioService.playEffect("specialCollect");
                    move.shouldGrow = true;
                    move.player.score += GOLDEN_TOPPING_POINTS;
                    move.player.toppingsCollected += 1;
                    state.goldenTopping = null;
                    showEventMessage("Aderezo dorado", `+${GOLDEN_TOPPING_POINTS}`, false);
                }

                // Salsa: revive a alguien o da segunda vida.
                if (state.specialSauce && sameCell(move.nextHead, state.specialSauce)) {
                    useSpecialSauce(move.player);
                    state.specialSauce = null;
                }

                // Si no comio, se borra la cola para mantener el largo.
                if (!move.shouldGrow) {
                    move.player.panchoTrail.pop();
                }
            });
        }

        // Colision contra los bordes del tablero.
        function isWallCollision(cell) {
            return cell.x < 0 || cell.x >= CELL_COUNT || cell.y < 0 || cell.y >= CELL_COUNT;
        }

        // Colision contra obstaculos generados en el mapa.
        function isObstacleCollision(cell) {
            return state.obstacles.some((obstacle) => sameCell(obstacle, cell));
        }

        // Colision contra cualquier pancho, ignorando la cola propia que se esta moviendo.
        function isPanchoCollision(currentPlayer, cell) {
            return state.players.some((player) => {
                return player.panchoTrail.some((segment, index) => {
                    if (player === currentPlayer && index === player.panchoTrail.length - 1) {
                        return false;
                    }

                    return sameCell(segment, cell);
                });
            });
        }

        function killOrRevive(player) {
            // Si tenia salsa extra, revive; si no, queda como cuerpo eliminado en el tablero.
            if (player.hasExtraLife) {
                player.hasExtraLife = false;
                reviveAtSafeSpot(player);
                AudioService.playEffect("specialCollect");
                return;
            }

            player.alive = false;
        }

        // La salsa revive a un eliminado; si no hay nadie muerto, queda como vida extra.
        function useSpecialSauce(player) {
            player.score += KEY_POINTS;
            AudioService.playEffect("specialCollect");
            const deadPlayer = state.players.find((candidate) => !candidate.alive);

            if (deadPlayer) {
                reviveAtSafeSpot(deadPlayer);
                return;
            }

            player.hasExtraLife = true;
        }

        function reviveAtSafeSpot(player) {
            // Revivir ocupa 3 casillas: cabeza, medio y cola.
            const reviveSpot = findSafeReviveSpot(player);

            PlayerService.revivePlayer(player, reviveSpot.position, reviveSpot.direction);
            player.previousTrail = cloneTrail(player.panchoTrail);
        }

        function findSafeReviveSpot(player) {
            // Busca una posicion donde el cuerpo completo entre sin pisar obstaculos ni panchos.
            const blockedCells = getBlockedCells(player);
            const directions = Object.keys(DIRECTIONS);

            for (let attempt = 0; attempt < 700; attempt += 1) {
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const position = randomCell(blockedCells);
                const trail = createReviveTrail(position, direction);

                if (isValidReviveTrail(trail, blockedCells)) {
                    return { position, direction };
                }
            }

            return {
                position: { ...player.startPosition },
                direction: player.startDirection
            };
        }

        // Construye las 3 casillas iniciales del pancho al revivir.
        function createReviveTrail(position, direction) {
            const vector = DIRECTIONS[direction];

            return [
                { ...position },
                { x: position.x - vector.x, y: position.y - vector.y },
                { x: position.x - vector.x * 2, y: position.y - vector.y * 2 }
            ];
        }

        // Verifica que las 3 casillas de revive esten dentro del tablero y libres.
        function isValidReviveTrail(trail, blockedCells) {
            return trail.every((segment) => {
                const insideBoard = segment.x >= 0 && segment.x < CELL_COUNT && segment.y >= 0 && segment.y < CELL_COUNT;
                const isBlocked = blockedCells.some((blocked) => sameCell(blocked, segment));

                return insideBoard && !isBlocked;
            });
        }

        // Reune casillas ocupadas para colocar items o revivir sin superposiciones.
        function getBlockedCells(ignoredPlayer) {
            return [
                ...state.players
                    .filter((player) => player !== ignoredPlayer)
                    .flatMap((player) => player.panchoTrail),
                ...state.obstacles,
                state.topping,
                state.goldenTopping,
                state.specialSauce
            ].filter(Boolean);
        }

        // Similar a getBlockedCells, pero pensado para crear obstaculos.
        function getObstacleBlockedCells() {
            return [
                ...state.players.flatMap((player) => player.panchoTrail),
                ...state.obstacles,
                state.topping,
                state.goldenTopping,
                state.specialSauce
            ].filter(Boolean);
        }

        // Busca una casilla para aderezo que tenga al menos un vecino libre.
        function randomToppingCell() {
            let cell;
            let attempts = 0;
            const blockedCells = getBlockedCells();

            do {
                cell = randomCell(blockedCells);
                attempts += 1;
            } while (!hasOpenNeighbor(cell, blockedCells) && attempts < 700);

            return cell;
        }

        // Evita que los obstaculos rodeen demasiado los aderezos.
        function isNearTopping(cell) {
            return [state.topping, state.goldenTopping, state.specialSauce]
                .filter(Boolean)
                .some((item) => Math.abs(item.x - cell.x) <= 1 && Math.abs(item.y - cell.y) <= 1);
        }

        // Convierte puntaje total en nivel de dificultad.
        function getLevelForScore(score) {
            return Math.min(LEVEL_SPEEDS.length, Math.floor(score / LEVEL_POINTS) + 1);
        }

        // Obtiene la velocidad correspondiente al nivel actual.
        function getSpeedForLevel(level) {
            return LEVEL_SPEEDS[Math.max(0, Math.min(LEVEL_SPEEDS.length - 1, level - 1))];
        }

        function checkLevelProgress() {
            // El nivel depende del puntaje total y aumenta la velocidad hasta el nivel maximo.
            const nextLevel = getLevelForScore(getTotalScore());

            if (nextLevel <= state.level) {
                return;
            }

            state.level = nextLevel;
            state.currentSpeed = getSpeedForLevel(state.level);
            restartTickInterval();
            AudioService.playEffect("levelUp");
            showEventMessage(`Nivel ${state.level}`, `Velocidad ${state.level}/${LEVEL_SPEEDS.length}`, true);
        }

        // Termina la partida si todos mueren o si se alcanza el limite final de puntos.
        function checkGameEnd() {
            const alivePlayers = state.players.filter((player) => player.alive);

            if (getTotalScore() >= FINAL_SCORE_LIMIT) {
                finishGame("score-limit");
                return;
            }

            if (alivePlayers.length > 0) {
                return;
            }

            finishGame("all-dead");
        }

        function finishGame(reason) {
            // Guarda una foto final de la partida para historial, ranking y record.
            if (state.finished) {
                return;
            }

            // Se marca terminada antes de detener controles para evitar dobles cierres.
            state.finished = true;
            AudioService.pauseMusic();
            AudioService.playEffect("gameOver");
            stop();

            // Limpia efectos visuales activos del tablero.
            state.boardWrapper.classList.remove("event-shake", "event-active");
            updateElapsedTime();

            // Envia un resumen completo a main.js para guardar y mostrar modal.
            state.onEnd({
                mode: state.mode,
                players: state.players.map((player) => ({
                    name: player.name,
                    score: player.score,
                    toppingsCollected: player.toppingsCollected,
                    revivedTimes: player.revivedTimes
                })),
                totalScore: getTotalScore(),
                durationSeconds: state.elapsedSeconds,
                durationText: formatDuration(state.elapsedSeconds),
                endReason: reason,
                performanceMessage: getPerformanceMessage(reason),
                winner: state.mode === 2 ? getWinner() : null,
                date: new Date().toLocaleString("es-AR")
            });
        }

        // Calcula ganador solo para datos internos; la UI no muestra texto de ganador.
        function getWinner() {
            const orderedPlayers = [...state.players].sort((a, b) => b.score - a.score);
            const topPlayer = orderedPlayers[0];
            const secondPlayer = orderedPlayers[1];

            if (secondPlayer && topPlayer.score === secondPlayer.score) {
                return "Empate";
            }

            return topPlayer.name;
        }

        function renderScore() {
            // Re-renderiza solo si el HTML cambia para evitar trabajo innecesario.
            const markup = state.players.map((player) => {
                // Estado visible de cada jugador en el panel lateral.
                const extraLife = player.hasExtraLife ? " | salsa lista" : "";
                const statusClass = player.alive ? "status" : "status dead";
                const statusText = player.alive ? "En carrera" : "Eliminado";

                return `
                    <article class="score-card">
                        <h3>${player.name}</h3>
                        <p>Puntos: <strong>${player.score}</strong></p>
                        <p>Nivel: <strong>${state.level}</strong></p>
                        <p>Aderezos: ${player.toppingsCollected}</p>
                        <p>Revividas: ${player.revivedTimes}</p>
                        <p class="${statusClass}">${statusText}${extraLife}</p>
                    </article>
                `;
            }).join("");

            // Evita tocar el DOM si el contenido no cambio.
            if (state.lastScoreMarkup !== markup) {
                state.scorePanel.innerHTML = markup;
                state.lastScoreMarkup = markup;
            }
        }

        // Suma los puntos de todos los jugadores.
        function getTotalScore() {
            return state.players.reduce((total, player) => total + player.score, 0);
        }

        // Actualiza barra superior: puntos, duracion y progreso de niveles.
        function renderMatchSummary() {
            // En modo 2 se muestra total combinado; en modo 1 solo puntos.
            const totalText = state.mode === 2 ? `Total: <strong>${getTotalScore()}</strong>` : `Puntos: <strong>${getTotalScore()}</strong>`;

            // LEVEL_SPEEDS se usa para dibujar los circulos de progreso.
            const markup = `
                <span>${totalText}</span>
                <span>Duracion: <strong>${formatDuration(state.elapsedSeconds)}</strong></span>
                <div class="level-track" aria-label="Nivel ${state.level} de ${LEVEL_SPEEDS.length}">
                    <span class="level-track-label">Nivel</span>
                    ${LEVEL_SPEEDS.map((_, index) => `
                        <span class="level-step${index + 1 <= state.level ? " is-active" : ""}">
                            <span>${index + 1}</span>
                        </span>
                    `).join("")}
                </div>
            `;

            if (state.lastSummaryMarkup !== markup) {
                state.matchSummary.innerHTML = markup;
                state.lastSummaryMarkup = markup;
            }
        }

        // Dibuja el panel de record y lo resalta cuando la partida actual lo alcanza.
        function renderRecord() {
            // currentTotal permite comparar la partida actual contra el record guardado.
            const record = state.record;
            const currentTotal = getTotalScore();
            const recordWasReached = record && currentTotal >= record.totalScore && currentTotal > 0;

            // La clase dorada se activa solo cuando se alcanza o supera el record.
            const shouldHighlight = Boolean(recordWasReached);

            if (state.lastRecordHighlight !== shouldHighlight) {
                state.recordPanel.classList.toggle("is-current-record", shouldHighlight);
                state.lastRecordHighlight = shouldHighlight;
            }

            // Si todavia no hay record, se informa que esta partida puede crearlo.
            if (!record) {
                const markup = `
                    <h3>Record</h3>
                    <p>Primer record disponible desde esta partida.</p>
                    <p>Puntos actuales: <strong>${currentTotal}</strong></p>
                `;

                if (state.lastRecordMarkup !== markup) {
                    state.recordPanel.innerHTML = markup;
                    state.lastRecordMarkup = markup;
                }
                return;
            }

            // Cuando hay record, se listan jugadores, puntajes y duracion.
            const names = record.players.map((player) => `${player.name}: ${player.score}`).join(" | ");
            const note = recordWasReached ? `<p class="record-note">Record alcanzado</p>` : "";

            const markup = `
                <h3>Record</h3>
                <p><strong>${record.totalScore}</strong> puntos</p>
                <p>${names}</p>
                <p>Duracion: ${record.durationText || "0:00"}</p>
                ${note}
            `;

            if (state.lastRecordMarkup !== markup) {
                state.recordPanel.innerHTML = markup;
                state.lastRecordMarkup = markup;
            }
        }

        function draw(progress = 1) {
            // Dibuja el mapa completo: fondo, items, obstaculos, panchos y mensajes.
            const cellSize = state.canvas.width / CELL_COUNT;
            state.context.imageSmoothingEnabled = false;
            drawMap();

            // El evento invisible oculta obstaculos e items durante unos segundos.
            if (!isEventActive("invisible-chaos")) {
                drawObstacles(cellSize);
                drawTopping(cellSize);
                drawGoldenTopping(cellSize);
                drawSpecialSauce(cellSize);
            }

            // Los jugadores siempre se dibujan al final para quedar sobre el mapa.
            state.players.forEach((player) => drawPlayer(player, cellSize, progress));
        }

        // Dibuja fondo del tablero y grilla de referencia.
        function drawMap() {
            const image = state.images.map;

            if (image.complete && image.naturalWidth > 0) {
                state.context.drawImage(image, 0, 0, state.canvas.width, state.canvas.height);
            } else {
                state.context.fillStyle = "#303030";
                state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
            }

            state.context.strokeStyle = "rgba(255, 255, 255, 0.05)";

            const cellSize = state.canvas.width / CELL_COUNT;

            for (let index = 0; index <= CELL_COUNT; index += 1) {
                const position = index * cellSize;
                state.context.beginPath();
                state.context.moveTo(position, 0);
                state.context.lineTo(position, state.canvas.height);
                state.context.stroke();
                state.context.beginPath();
                state.context.moveTo(0, position);
                state.context.lineTo(state.canvas.width, position);
                state.context.stroke();
            }
        }

        // Dibuja el aderezo comun.
        function drawTopping(cellSize) {
            drawItem(state.images.topping, state.topping, cellSize, "#f05222", "A", "#141b22", 0);
        }

        // Dibuja el aderezo dorado con parpadeo cuando esta por desaparecer.
        function drawGoldenTopping(cellSize) {
            if (!state.goldenTopping) {
                return;
            }

            const shouldBlink = state.goldenTopping.expiresAt - state.tickCount < 16 && state.tickCount % 2 === 0;

            if (!shouldBlink) {
                drawItem(state.images.goldenTopping, state.goldenTopping, cellSize, "#ffd03c", "50", "#ffd03c", 0.12);
            }
        }

        // Dibuja obstaculos con sprite o fallback en Canvas.
        function drawObstacles(cellSize) {
            state.obstacles.forEach((obstacle) => {
                const x = obstacle.x * cellSize;
                const y = obstacle.y * cellSize;

                if (state.images.obstacle.complete && state.images.obstacle.naturalWidth > 0) {
                    drawOutlinedItem(state.images.obstacle, x, y, cellSize, "#8c1010", 1);
                    return;
                }

                state.context.fillStyle = "rgba(178, 22, 22, 0.92)";
                state.context.beginPath();
                state.context.ellipse(x + cellSize / 2, y + cellSize / 2, cellSize * 0.42, cellSize * 0.28, -0.25, 0, Math.PI * 2);
                state.context.fill();
                state.context.fillStyle = "rgba(255, 255, 255, 0.28)";
                state.context.beginPath();
                state.context.ellipse(x + cellSize * 0.38, y + cellSize * 0.4, cellSize * 0.16, cellSize * 0.08, -0.25, 0, Math.PI * 2);
                state.context.fill();
            });
        }

        // Dibuja la salsa especial de revive con parpadeo de vencimiento.
        function drawSpecialSauce(cellSize) {
            if (!state.specialSauce) {
                return;
            }

            const shouldBlink = state.specialSauce.expiresAt - state.tickCount < 20 && state.tickCount % 2 === 0;

            if (!shouldBlink) {
                drawItem(state.images.specialSauce, state.specialSauce, cellSize, "#e7e7e7", "S", "#55c7ff", 0.1);
            }
        }

        // Dibuja un item del tablero usando sprite si existe o circulo/texto si falta.
        function drawItem(image, cell, cellSize, fallbackColor, label, outlineColor, pulseAmount) {
            const x = cell.x * cellSize;
            const y = cell.y * cellSize;

            if (image && image.complete && image.naturalWidth > 0) {
                drawOutlinedItem(image, x, y, cellSize, outlineColor, 2, pulseAmount);
                return;
            }

            state.context.fillStyle = fallbackColor;
            state.context.beginPath();
            state.context.roundRect(x + 3, y + 3, cellSize - 6, cellSize - 6, 5);
            state.context.fill();
            state.context.fillStyle = "#111";
            state.context.font = "bold 10px Arial";
            state.context.textAlign = "center";
            state.context.textBaseline = "middle";
            state.context.fillText(label, x + cellSize / 2, y + cellSize / 2);
        }

        // Dibuja items con borde y pulso para que destaquen sobre el mapa.
        function drawOutlinedItem(image, x, y, cellSize, outlineColor, padding, pulseAmount) {
            const outlined = getOutlinedItem(image, outlineColor);
            const inset = padding || 0;
            const pulse = pulseAmount ? 1 + Math.sin(performance.now() / 160) * pulseAmount : 1;
            const size = (cellSize - inset * 2) * pulse;
            const offset = (cellSize - size) / 2;

            state.context.drawImage(outlined, x + offset, y + offset, size, size);
        }

        // Devuelve la direccion entre dos casillas vecinas.
        function getCellVector(from, to) {
            if (!from || !to) {
                return DIRECTIONS.right;
            }

            return {
                x: Math.sign(to.x - from.x),
                y: Math.sign(to.y - from.y)
            };
        }

        // Convierte una direccion de grilla en angulo para rotar sprites.
        function getSpriteAngle(vector) {
            if (vector.x > 0) {
                return Math.PI;
            }

            if (vector.y > 0) {
                return -Math.PI / 2;
            }

            if (vector.x < 0) {
                return 0;
            }

            return Math.PI / 2;
        }

        // Dibuja un sprite recto del pancho con borde del color del jugador.
        function drawSprite(image, x, y, cellSize, player) {
            if (image && image.complete && image.naturalWidth > 0) {
                const overlap = Math.max(1, cellSize * 0.035);
                const outlined = getOutlinedSprite(image, player);
                state.context.drawImage(outlined, x - overlap, y - overlap, cellSize + overlap * 2, cellSize + overlap * 2);
                return true;
            }

            return false;
        }

        // Dibuja cabeza/cola rotando el sprite segun la direccion.
        function drawRotatedSprite(image, x, y, cellSize, angle, player, flipHorizontal) {
            if (!image || !image.complete || image.naturalWidth <= 0) {
                return false;
            }

            const overlap = Math.max(1, cellSize * 0.035);
            const outlined = getOutlinedSprite(image, player);
            state.context.save();
            state.context.translate(x + cellSize / 2, y + cellSize / 2);
            state.context.rotate(angle);
            if (flipHorizontal) {
                state.context.scale(-1, 1);
            }
            state.context.drawImage(
                outlined,
                -cellSize / 2 - overlap,
                -cellSize / 2 - overlap,
                cellSize + overlap * 2,
                cellSize + overlap * 2
            );
            state.context.restore();
            return true;
        }

        // Jugador 1 usa borde rojo; jugador 2 usa borde celeste.
        function getPlayerOutlineColor(player) {
            return player.id === 1 ? "#d42b2b" : "#55c7ff";
        }

        function getOutlinedSprite(image, player) {
            // Cachea el sprite con borde por jugador; evita recalcularlo en cada frame.
            const cache = state.outlinedSprites[player.id];

            if (cache.has(image.src)) {
                return cache.get(image.src);
            }

            const outlineSize = 2;
            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth + outlineSize * 2;
            canvas.height = image.naturalHeight + outlineSize * 2;

            const outlineContext = canvas.getContext("2d");
            outlineContext.imageSmoothingEnabled = false;
            outlineContext.drawImage(image, outlineSize - 1, outlineSize);
            outlineContext.drawImage(image, outlineSize + 1, outlineSize);
            outlineContext.drawImage(image, outlineSize, outlineSize - 1);
            outlineContext.drawImage(image, outlineSize, outlineSize + 1);
            outlineContext.globalCompositeOperation = "source-in";
            outlineContext.fillStyle = getPlayerOutlineColor(player);
            outlineContext.fillRect(0, 0, canvas.width, canvas.height);
            outlineContext.globalCompositeOperation = "source-over";
            outlineContext.drawImage(image, outlineSize, outlineSize);

            cache.set(image.src, canvas);
            return canvas;
        }

        // Cachea items con borde para no recalcular el contorno en cada frame.
        function getOutlinedItem(image, outlineColor) {
            const cacheKey = `${image.src}|${outlineColor}`;

            if (state.outlinedItems.has(cacheKey)) {
                return state.outlinedItems.get(cacheKey);
            }

            const outlineSize = 2;
            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth + outlineSize * 2;
            canvas.height = image.naturalHeight + outlineSize * 2;

            const outlineContext = canvas.getContext("2d");
            outlineContext.imageSmoothingEnabled = false;
            outlineContext.drawImage(image, outlineSize - 1, outlineSize);
            outlineContext.drawImage(image, outlineSize + 1, outlineSize);
            outlineContext.drawImage(image, outlineSize, outlineSize - 1);
            outlineContext.drawImage(image, outlineSize, outlineSize + 1);
            outlineContext.drawImage(image, outlineSize - 1, outlineSize - 1);
            outlineContext.drawImage(image, outlineSize + 1, outlineSize - 1);
            outlineContext.drawImage(image, outlineSize - 1, outlineSize + 1);
            outlineContext.drawImage(image, outlineSize + 1, outlineSize + 1);
            outlineContext.globalCompositeOperation = "source-in";
            outlineContext.fillStyle = outlineColor;
            outlineContext.fillRect(0, 0, canvas.width, canvas.height);
            outlineContext.globalCompositeOperation = "source-over";
            outlineContext.drawImage(image, outlineSize, outlineSize);

            state.outlinedItems.set(cacheKey, canvas);
            return canvas;
        }

        function getPanchoBodySprite(previous, segment, next) {
            // Elige sprite recto o curva segun los vecinos del segmento actual.
            const toPrevious = getCellVector(segment, previous);
            const toNext = getCellVector(segment, next);
            const hasLeft = toPrevious.x < 0 || toNext.x < 0;
            const hasRight = toPrevious.x > 0 || toNext.x > 0;
            const hasUp = toPrevious.y < 0 || toNext.y < 0;
            const hasDown = toPrevious.y > 0 || toNext.y > 0;

            if (hasLeft && hasRight) {
                return state.images.panchoBodyHorizontal;
            }

            if (hasUp && hasDown) {
                return state.images.panchoBodyVertical;
            }

            if (hasRight && hasDown) {
                return state.images.panchoTurnRightDown;
            }

            if (hasLeft && hasDown) {
                return state.images.panchoTurnLeftDown;
            }

            if (hasRight && hasUp) {
                return state.images.panchoTurnRightUp;
            }

            if (hasLeft && hasUp) {
                return state.images.panchoTurnLeftUp;
            }

            return state.images.panchoBodyHorizontal;
        }

        function getAnimatedSegment(player, index, progress) {
            // Interpola entre la posicion anterior y actual para que el movimiento no se vea duro.
            const current = player.panchoTrail[index];
            const previous = player.previousTrail && player.previousTrail[index];

            if (!current || !previous || state.paused || state.waitingForInput) {
                return current;
            }

            return {
                x: lerp(previous.x, current.x, progress),
                y: lerp(previous.y, current.y, progress)
            };
        }

        function drawPlayer(player, cellSize, progress) {
            // Los cuerpos eliminados se dibujan oscuros para diferenciarlos de jugadores activos.
            const isDeadBody = !player.alive;

            if (isDeadBody) {
                state.context.save();
                state.context.globalAlpha = 0.52;
                state.context.filter = "brightness(0.45) saturate(0.55)";
            }

            player.panchoTrail.slice().reverse().forEach((segment, reverseIndex, reversedTrail) => {
                const actualIndex = reversedTrail.length - 1 - reverseIndex;
                const isHead = actualIndex === 0;
                const isTail = actualIndex === player.panchoTrail.length - 1;
                const previous = player.panchoTrail[actualIndex - 1];
                const next = player.panchoTrail[actualIndex + 1];
                const animatedSegment = getAnimatedSegment(player, actualIndex, progress);
                const x = animatedSegment.x * cellSize;
                const y = animatedSegment.y * cellSize;

                if (isHead) {
                    const direction = getCellVector(next, segment);
                    const headAngle = getSpriteAngle(direction) + Math.PI;

                    if (drawRotatedSprite(state.images.panchoHead, x, y, cellSize, headAngle, player, false)) {
                        return;
                    }
                } else if (isTail) {
                    const direction = getCellVector(previous, segment);

                    if (drawRotatedSprite(state.images.panchoTip, x, y, cellSize, getSpriteAngle(direction), player, false)) {
                        return;
                    }
                } else if (drawSprite(getPanchoBodySprite(previous, segment, next), x, y, cellSize, player)) {
                    return;
                }

                if (isHead) {
                    drawPanchoHeadFallback(player, x, y, cellSize);
                } else {
                    drawPanchoBodyFallback(player, x, y, cellSize);
                }
            });

            if (isDeadBody) {
                state.context.restore();
            }
        }

        // Cabeza dibujada con Canvas si el sprite no carga.
        function drawPanchoHeadFallback(player, x, y, size) {
            state.context.fillStyle = "#d99144";
            state.context.beginPath();
            state.context.roundRect(x + 2, y + 5, size - 4, size - 10, 8);
            state.context.fill();
            state.context.fillStyle = player.color;
            state.context.beginPath();
            state.context.roundRect(x + 6, y + 7, size - 12, size - 14, 8);
            state.context.fill();
            state.context.fillStyle = "#111";
            state.context.fillRect(x + size - 7, y + 8, 2, 2);
            state.context.fillRect(x + size - 7, y + size - 10, 2, 2);
        }

        // Cuerpo dibujado con Canvas si el sprite no carga.
        function drawPanchoBodyFallback(player, x, y, size) {
            state.context.fillStyle = "#d99144";
            state.context.beginPath();
            state.context.roundRect(x + 2, y + 5, size - 4, size - 10, 8);
            state.context.fill();
            state.context.fillStyle = player.bodyColor;
            state.context.beginPath();
            state.context.roundRect(x + 5, y + 8, size - 10, size - 16, 8);
            state.context.fill();
        }

        // Reinicia la animacion de sacudida cada vez que hay choque.
        function shakeBoard() {
            state.boardWrapper.classList.remove("board-shake");
            void state.boardWrapper.offsetWidth;
            state.boardWrapper.classList.add("board-shake");
        }

        // Crea el cartel flotante de eventos dentro del tablero.
        function createEventBanner(wrapper) {
            const oldBanner = wrapper.querySelector(".event-banner");

            if (oldBanner) {
                oldBanner.remove();
            }

            const banner = document.createElement("div");
            banner.className = "event-banner hidden";
            wrapper.appendChild(banner);
            return banner;
        }

        // Muestra mensajes temporales de evento, nivel o prueba.
        function showEventMessage(title, detail, isBig) {
            state.eventBanner.innerHTML = `
                <span>${title}</span>
                <strong>${detail}</strong>
            `;
            state.eventBanner.classList.toggle("is-big", Boolean(isBig));
            state.eventBanner.classList.remove("hidden", "event-banner-out");
            state.eventBanner.classList.add("event-banner-in");

            window.clearTimeout(state.eventBannerTimeout);
            state.eventBannerTimeout = window.setTimeout(() => {
                state.eventBanner.classList.remove("event-banner-in");
                state.eventBanner.classList.add("event-banner-out");
            }, isBig ? 1400 : 950);
        }

        // Oculta y limpia el cartel de eventos.
        function hideEventBanner() {
            window.clearTimeout(state.eventBannerTimeout);
            state.eventBanner.classList.add("hidden");
            state.eventBanner.classList.remove("event-banner-in", "event-banner-out", "is-big");
            state.eventBanner.innerHTML = "";
        }

        // Elige frase final segun rendimiento, record o motivo de derrota.
        function getPerformanceMessage(reason) {
            const total = getTotalScore();
            const maxToppings = Math.max(...state.players.map((player) => player.toppingsCollected));

            if (reason === "score-limit") {
                return "Llegaste al final: el pancho exploto de gloria";
            }

            if (state.elapsedSeconds <= 8) {
                return "Duraste menos que pancho en recreo";
            }

            if (state.record && total >= state.record.totalScore) {
                return "Pancho historico: olor a record";
            }

            if (total >= 180) {
                return "Leyenda total del carrito";
            }

            if (total >= 100) {
                return "Maestro del aderezo";
            }

            if (maxToppings >= 8) {
                return "Mostaza en las venas";
            }

            if (total >= 40) {
                return "Buen pancho, buena mordida";
            }

            return "Pancho en entrenamiento";
        }

        function handleKeyDown(event) {
            // Controles de teclado y atajo de prueba: Shift + 0 suma 200 puntos.
            if (event.shiftKey && event.code === "Digit0") {
                event.preventDefault();
                addDebugPoints(200);
                return;
            }

            const control = KEY_MAP[event.code];

            if (!control) {
                return;
            }

            event.preventDefault();
            const playerIndex = state.mode === 1 ? 0 : control.player;
            setDirection(playerIndex, control.direction);
        }

        // Atajo de desarrollo para probar niveles sin jugar toda la partida.
        function addDebugPoints(points) {
            const player = state.players[0];

            if (!player || state.finished) {
                return;
            }

            player.score += points;
            checkLevelProgress();
            checkGameEnd();
            renderScore();
            renderMatchSummary();
            renderRecord();
            showEventMessage("Prueba", `+${points} puntos`, false);
        }

        // Activa controles de teclado una sola vez por partida.
        function attachKeyboardControls() {
            if (keydownAttached) {
                return;
            }

            window.addEventListener("keydown", handleKeyDown);
            keydownAttached = true;
        }

        // Quita controles de teclado al cerrar/reiniciar partida.
        function detachKeyboardControls() {
            if (!keydownAttached) {
                return;
            }

            window.removeEventListener("keydown", handleKeyDown);
            keydownAttached = false;
        }

        return {
            start,
            stop,
            reset,
            togglePause,
            setDirection,
            get paused() {
                return state.paused;
            }
        };
    }

    window.GameService = {
        createGame
    };
})();
