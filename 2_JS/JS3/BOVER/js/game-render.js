// Dibuja las paredes verdes del laberinto.
function drawMaze() {
    // Recorre cada fila del mapa.
    for (let r = 0; r < ROWS; r++) {
        // Recorre cada columna del mapa.
        for (let c = 0; c < COLS; c++) {
            // Solo dibuja las celdas marcadas como pared.
            if (mapLayout[r][c] === 1) {
                // Pinta primero el borde blanco de la pared.
                ctx.fillStyle = "#ffffff";
                // Ubica el borde segun columna y fila.
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                // Pinta el centro verde estilo cancha.
                ctx.fillStyle = "#1b5e20";
                // Deja un pixel de borde para que la pared se lea mejor.
                ctx.fillRect(c * TILE_SIZE + 1, r * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            }
        }
    }
}

// Dibuja puntos, jugadores, copas y avisos de la partida.
function drawGameClean() {
    // Limpia todo el canvas antes de pintar el siguiente frame.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibuja el laberinto de fondo.
    drawMaze();

    // Recorre todos los puntos e items comibles.
    dots.forEach(dot => {
        // Si el punto es penal, usa sprite especial.
        if (dot.isPenal) {
            // Dibuja el penal si la imagen ya cargo.
            if (assets.penal.complete && assets.penal.naturalWidth !== 0) {
                // Centra el sprite en la posicion del item.
                drawCenteredImage(ctx, assets.penal, dot.x, dot.y, ITEM_SPRITE_SIZE, ITEM_SPRITE_SIZE);
            } else {
                // Usa circulo dorado como respaldo.
                ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                // Pinta el respaldo del penal.
                ctx.fillStyle = '#fecb00'; ctx.fill(); ctx.closePath();
            }
        // Si el punto es arbitro, usa sprite de arbitro.
        } else if (dot.isArbitro) {
            // Dibuja el arbitro si la imagen ya cargo.
            if (assets.arbitro.complete && assets.arbitro.naturalWidth !== 0) {
                // Centra el sprite en la posicion del item.
                drawCenteredImage(ctx, assets.arbitro, dot.x, dot.y, ARBITRO_SPRITE_SIZE, ARBITRO_SPRITE_SIZE);
            } else {
                // Usa circulo negro como respaldo.
                ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                // Pinta el respaldo del arbitro.
                ctx.fillStyle = '#000000'; ctx.fill(); ctx.closePath();
            }
        // Si es un punto normal, lo dibuja blanco.
        } else {
            // Abre el trazo del punto normal.
            ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            // Pinta el punto normal.
            ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.closePath();
        }
        // Limpia brillo por si algun item lo habia usado.
        ctx.shadowBlur = 0;
    });

    // Dibuja todos los jugadores vivos.
    players.forEach(p => p.draw(ctx));
    // Dibuja todas las copas normales, debiles o regresando como pelota.
    ghosts.forEach(g => g.draw(ctx));

    // Muestra aviso previo cuando el enemigo especial esta por entrar.
    if (!diMariaGhost && specialSpawnWarningTimer > 0) {
        // Lee la configuracion del enemigo especial del nivel actual.
        const specialEnemy = getSpecialEnemyConfig();
        // Pinta fondo oscuro para que el aviso no tape el juego de golpe.
        ctx.fillStyle = "rgba(0, 0, 0, 0.76)";
        // Ubica la placa del aviso arriba del tablero.
        ctx.fillRect(canvas.width / 2 - 135, 5, 270, 30);
        // Usa rojo para advertencia.
        ctx.fillStyle = "#ed1c24";
        // Mantiene fuente pixel del juego.
        ctx.font = "bold 8px 'Press Start 2P'";
        // Centra el texto.
        ctx.textAlign = "center";
        // Escribe el aviso de entrada.
        ctx.fillText(`${specialEnemy.label} ESTA POR ENTRAR`, canvas.width / 2, 24);
    }

    // Muestra el aviso activo del enemigo especial.
    if (diMariaGhost) {
        // Lee la configuracion del enemigo especial del nivel actual.
        const specialEnemy = getSpecialEnemyConfig();
        // Dibuja al enemigo especial.
        diMariaGhost.draw(ctx);
        // Pinta placa oscura para el contador.
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        // Ubica la placa del contador.
        ctx.fillRect(canvas.width / 2 - 120, 5, 240, 30);
        // Usa amarillo para destacar tiempo activo.
        ctx.fillStyle = "#fecb00";
        // Mantiene fuente pixel del juego.
        ctx.font = "bold 8px 'Press Start 2P'";
        // Centra el texto.
        ctx.textAlign = "center";
        // Escribe mensaje y segundos restantes.
        ctx.fillText(`${specialEnemy.message} ${Math.ceil(diMariaTimer / 60)}s`, canvas.width / 2, 24);
    }
}
