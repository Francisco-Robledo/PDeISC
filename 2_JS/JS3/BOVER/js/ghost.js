// Representa una copa enemiga del laberinto.
class Ghost {
    // Crea una copa con posicion, sprite y comportamiento.
    constructor(col, row, color, label, imgKey, aiType) {
        // Guarda la columna inicial de spawn.
        this.spawnCol = col;
        // Guarda la fila inicial de spawn.
        this.spawnRow = row;
        // Convierte la columna a posicion X de canvas.
        this.x = col * TILE_SIZE + TILE_SIZE / 2;
        // Convierte la fila a posicion Y de canvas.
        this.y = row * TILE_SIZE + TILE_SIZE / 2;
        // Guarda el color de respaldo si no carga el sprite.
        this.color = color;
        // Guarda una etiqueta corta para identificar la copa.
        this.label = label;
        // Guarda la clave del sprite dentro de assets.
        this.imgKey = imgKey;
        // Guarda el tipo de inteligencia artificial.
        this.aiType = aiType;
        // Define la velocidad normal.
        this.speed = 1.5;
        // Define la direccion horizontal inicial.
        this.dirX = 1;
        // Define la direccion vertical inicial.
        this.dirY = 0;
        // Define el radio usado para choques.
        this.radius = 8;
        // Indica si la copa esta debil.
        this.isScared = false;
        // Guarda cuanto falta para que termine la debilidad.
        this.scaredTimer = 0;
        // Indica si la copa vuelve al spawn como pelota.
        this.returningHome = false;
        // Guarda el camino de celdas que debe seguir la pelota hasta el spawn.
        this.returnPath = [];
        // Guarda que punto del camino esta siguiendo la pelota.
        this.returnPathIndex = 0;
    }

    // Activa el retorno al spawn despues de que el jugador come la copa.
    startReturnHome(map, tileSize) {
        // Apaga el estado debil.
        this.isScared = false;
        // Limpia el contador de debilidad.
        this.scaredTimer = 0;
        // Calcula el camino por pasillos hasta el spawn.
        this.returnPath = this.findPathToSpawn(map, tileSize);
        // Empieza siguiendo el primer punto del camino.
        this.returnPathIndex = 0;
        // Enciende el estado de retorno.
        this.returningHome = true;
    }

    // Convierte una posicion de canvas a una celda valida del mapa.
    getNearestOpenCell(map, tileSize, x, y) {
        // Calcula la columna mas cercana.
        const startCol = Math.max(0, Math.min(map[0].length - 1, Math.floor(x / tileSize)));
        // Calcula la fila mas cercana.
        const startRow = Math.max(0, Math.min(map.length - 1, Math.floor(y / tileSize)));
        // Si esa celda no es pared, ya sirve.
        if (map[startRow][startCol] !== 1) return { col: startCol, row: startRow };
        // Prepara una cola para buscar una celda cercana caminable.
        const queue = [{ col: startCol, row: startRow }];
        // Guarda celdas visitadas para no repetir.
        const visited = new Set([`${startCol},${startRow}`]);
        // Define movimientos cardinales.
        const directions = [{ dc: 0, dr: -1 }, { dc: 0, dr: 1 }, { dc: -1, dr: 0 }, { dc: 1, dr: 0 }];
        // Busca alrededor hasta encontrar pasillo.
        while (queue.length > 0) {
            // Toma la siguiente celda de la cola.
            const cell = queue.shift();
            // Revisa sus vecinos.
            for (const direction of directions) {
                // Calcula columna vecina.
                const nextCol = cell.col + direction.dc;
                // Calcula fila vecina.
                const nextRow = cell.row + direction.dr;
                // Ignora celdas fuera del mapa.
                if (nextCol < 0 || nextCol >= map[0].length || nextRow < 0 || nextRow >= map.length) continue;
                // Arma clave unica de la celda.
                const key = `${nextCol},${nextRow}`;
                // Ignora celdas ya visitadas.
                if (visited.has(key)) continue;
                // Si es pasillo, la devuelve.
                if (map[nextRow][nextCol] !== 1) return { col: nextCol, row: nextRow };
                // Marca pared visitada para seguir expandiendo.
                visited.add(key);
                // Agrega la celda a la cola.
                queue.push({ col: nextCol, row: nextRow });
            }
        }
        // Si todo falla, devuelve la celda original.
        return { col: startCol, row: startRow };
    }

    // Busca un camino por pasillos desde la posicion actual hasta el spawn.
    findPathToSpawn(map, tileSize) {
        // Busca la celda caminable mas cercana a la pelota.
        const start = this.getNearestOpenCell(map, tileSize, this.x, this.y);
        // Define la celda de destino como el spawn de la copa.
        const goal = { col: this.spawnCol, row: this.spawnRow };
        // Prepara cola para busqueda en anchura.
        const queue = [start];
        // Guarda desde que celda llego cada paso.
        const cameFrom = new Map();
        // Guarda clave inicial como visitada.
        cameFrom.set(`${start.col},${start.row}`, null);
        // Define movimientos cardinales.
        const directions = [{ dc: 0, dr: -1 }, { dc: 0, dr: 1 }, { dc: -1, dr: 0 }, { dc: 1, dr: 0 }];
        // Recorre pasillos hasta encontrar el spawn.
        while (queue.length > 0) {
            // Toma la celda mas antigua de la cola.
            const current = queue.shift();
            // Si llego al objetivo, corta la busqueda.
            if (current.col === goal.col && current.row === goal.row) break;
            // Prueba las cuatro direcciones.
            for (const direction of directions) {
                // Calcula columna siguiente.
                let nextCol = current.col + direction.dc;
                // Calcula fila siguiente.
                const nextRow = current.row + direction.dr;
                // Permite tunel horizontal por izquierda.
                if (nextCol < 0) nextCol = map[0].length - 1;
                // Permite tunel horizontal por derecha.
                if (nextCol >= map[0].length) nextCol = 0;
                // Ignora filas fuera del mapa.
                if (nextRow < 0 || nextRow >= map.length) continue;
                // Ignora paredes.
                if (map[nextRow][nextCol] === 1) continue;
                // Arma clave unica de la celda siguiente.
                const nextKey = `${nextCol},${nextRow}`;
                // Ignora celdas ya visitadas.
                if (cameFrom.has(nextKey)) continue;
                // Guarda de donde viene esta celda.
                cameFrom.set(nextKey, current);
                // Agrega siguiente celda a la cola.
                queue.push({ col: nextCol, row: nextRow });
            }
        }
        // Arma clave del objetivo.
        const goalKey = `${goal.col},${goal.row}`;
        // Si no hay camino, vuelve al centro del spawn como respaldo.
        if (!cameFrom.has(goalKey)) return [goal];
        // Prepara el camino reconstruido.
        const path = [];
        // Empieza desde el objetivo.
        let current = goal;
        // Retrocede hasta el inicio.
        while (current) {
            // Agrega la celda actual al camino.
            path.push(current);
            // Busca la celda anterior.
            current = cameFrom.get(`${current.col},${current.row}`);
        }
        // Invierte para que vaya desde inicio hasta spawn.
        path.reverse();
        // Evita repetir la celda actual si ya esta parado ahi.
        return path.slice(1);
    }

    // Actualiza la posicion de la copa en cada frame.
    update(map, tileSize, targetPlayer) {
        // Si esta volviendo al spawn, sigue el camino por pasillos.
        if (this.returningHome) {
            // Si no tiene camino guardado, intenta calcularlo.
            if (this.returnPath.length === 0) this.returnPath = this.findPathToSpawn(map, tileSize);
            // Toma la celda objetivo actual.
            const targetCell = this.returnPath[this.returnPathIndex] || { col: this.spawnCol, row: this.spawnRow };
            // Calcula la posicion X de esa celda.
            const targetX = targetCell.col * tileSize + tileSize / 2;
            // Calcula la posicion Y de esa celda.
            const targetY = targetCell.row * tileSize + tileSize / 2;
            // Calcula la distancia horizontal al spawn.
            const dx = targetX - this.x;
            // Calcula la distancia vertical al spawn.
            const dy = targetY - this.y;
            // Calcula la distancia total al objetivo actual.
            const distance = Math.hypot(dx, dy);
            // Define la velocidad de regreso.
            const returnSpeed = 5;
            // Si ya llego a esta celda, avanza al proximo punto del camino.
            if (distance <= returnSpeed) {
                // Ajusta X exacta a la celda objetivo.
                this.x = targetX;
                // Ajusta Y exacta a la celda objetivo.
                this.y = targetY;
                // Pasa al siguiente punto del camino.
                this.returnPathIndex++;
                // Si ya recorrio todo el camino, restaura la copa normal.
                if (this.returnPathIndex >= this.returnPath.length) {
                    // Apaga retorno al spawn.
                    this.returningHome = false;
                    // Limpia camino anterior.
                    this.returnPath = [];
                    // Reinicia indice del camino.
                    this.returnPathIndex = 0;
                    // Restaura direccion base.
                    this.dirX = 1;
                    // Restaura direccion base vertical.
                    this.dirY = 0;
                }
                // Sale porque ya termino este frame.
                return;
            }
            // Avanza X hacia la siguiente celda del camino.
            this.x += (dx / distance) * returnSpeed;
            // Avanza Y hacia la siguiente celda del camino.
            this.y += (dy / distance) * returnSpeed;
            // Sale para evitar la IA normal mientras vuelve.
            return;
        }

        // Reduce el tiempo de debilidad si esta activa.
        if (this.isScared) {
            // Descuenta un frame del contador.
            this.scaredTimer--;
            // Apaga debilidad cuando llega a cero.
            if (this.scaredTimer <= 0) this.isScared = false;
        }

        // Baja velocidad cuando esta debil.
        let currentSpeed = this.isScared ? this.speed * 0.5 : this.speed;
        // Calcula posicion relativa X dentro de la celda.
        const modX = ((this.x % tileSize) + tileSize) % tileSize;
        // Calcula posicion relativa Y dentro de la celda.
        const modY = ((this.y % tileSize) + tileSize) % tileSize;
        // Indica si esta centrada en X.
        const isCenteredX = Math.abs(modX - tileSize / 2) < currentSpeed;
        // Indica si esta centrada en Y.
        const isCenteredY = Math.abs(modY - tileSize / 2) < currentSpeed;

        // Solo decide nueva direccion cuando esta centrada.
        if (isCenteredX && isCenteredY) {
            // Ajusta X al centro exacto de celda.
            this.x = Math.floor(this.x / tileSize) * tileSize + tileSize / 2;
            // Ajusta Y al centro exacto de celda.
            this.y = Math.floor(this.y / tileSize) * tileSize + tileSize / 2;
            // Calcula columna actual.
            const col = Math.floor(this.x / tileSize);
            // Calcula fila actual.
            const row = Math.floor(this.y / tileSize);
            // Guarda movimientos posibles sin filtrar.
            let allMoves = [];
            // Define las cuatro direcciones cardinales.
            const directions = [{dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0}];

            // Recorre cada direccion para ver si se puede mover.
            directions.forEach(d => {
                // Calcula columna siguiente.
                let nextC = col + d.dx;
                // Calcula fila siguiente.
                let nextR = row + d.dy;
                // Permite tunel horizontal por izquierda.
                if (nextC < 0) nextC = map[0].length - 1;
                // Permite tunel horizontal por derecha.
                if (nextC >= map[0].length) nextC = 0;
                // Bloquea salida vertical del mapa.
                if (nextR < 0 || nextR >= map.length) return;
                // Agrega la direccion si no hay pared.
                if (map[nextR][nextC] !== 1) allMoves.push(d);
            });

            // Evita volver hacia atras solo si existe otra salida real.
            let possibleMoves = allMoves.filter(d => !(d.dx === -this.dirX && d.dy === -this.dirY && (this.dirX !== 0 || this.dirY !== 0)));
            // Si la unica salida era volver, la permite para no trabarse.
            if (possibleMoves.length === 0) possibleMoves = allMoves;

            // Si hay movimientos posibles, elige uno.
            if (possibleMoves.length > 0) {
                // Usa el primero como valor base.
                let bestMove = possibleMoves[0];
                // Si esta debil o es aleatoria, elige al azar.
                if (this.isScared || this.aiType === "random") {
                    // Selecciona un movimiento aleatorio.
                    bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                } else {
                    // Usa al jugador como objetivo base.
                    let targetX = targetPlayer.x, targetY = targetPlayer.y;
                    // La copa emboscadora apunta hacia adelante del jugador.
                    if (this.aiType === "ambush") {
                        // Adelanta objetivo en X.
                        targetX += targetPlayer.dirX * TILE_SIZE * 3;
                        // Adelanta objetivo en Y.
                        targetY += targetPlayer.dirY * TILE_SIZE * 3;
                    } else if (this.aiType === "flank") {
                        // La copa flanqueadora usa una posicion espejada.
                        targetX = canvas.width - targetPlayer.x;
                        // Espeja tambien Y.
                        targetY = canvas.height - targetPlayer.y;
                    }
                    // Guarda la menor distancia encontrada.
                    let minDistance = Infinity;
                    // Evalua cada movimiento.
                    possibleMoves.forEach(move => {
                        // Calcula distancia desde la celda candidata al objetivo.
                        const dist = Math.hypot((col + move.dx) * tileSize - targetX, (row + move.dy) * tileSize - targetY);
                        // Si mejora, guarda esta direccion.
                        if (dist < minDistance) { minDistance = dist; bestMove = move; }
                    });
                }
                // Aplica direccion horizontal elegida.
                this.dirX = bestMove.dx;
                // Aplica direccion vertical elegida.
                this.dirY = bestMove.dy;
            } else {
                // Si no hay movimientos, invierte direccion horizontal.
                this.dirX = -this.dirX;
                // Si no hay movimientos, invierte direccion vertical.
                this.dirY = -this.dirY;
            }
        }
        // Avanza X segun direccion.
        this.x += this.dirX * currentSpeed;
        // Avanza Y segun direccion.
        this.y += this.dirY * currentSpeed;
        // Reaparece por derecha al salir por izquierda.
        if (this.x < -tileSize / 2) this.x = map[0].length * tileSize + tileSize / 2;
        // Reaparece por izquierda al salir por derecha.
        if (this.x > map[0].length * tileSize + tileSize / 2) this.x = -tileSize / 2;
    }

    // Dibuja la copa segun su estado actual.
    draw(ctx) {
        // Si vuelve al spawn, se muestra como pelota.
        if (this.returningHome) {
            // Dibuja pelota si cargo el sprite.
            if (assets.pelota.complete && assets.pelota.naturalWidth !== 0) {
                // Dibuja la pelota centrada.
                drawCenteredImage(ctx, assets.pelota, this.x, this.y, RETURN_BALL_SIZE, RETURN_BALL_SIZE);
            }
            // Sale porque no debe dibujar copa.
            return;
        }

        // Busca el sprite normal de esta copa.
        const img = assets[this.imgKey];
        // Si esta debil, dibuja un estilo sobrio.
        if (this.isScared) {
            // Calcula si debe parpadear.
            const blinking = this.scaredTimer <= SCARED_BLINK_TIME && Math.floor(this.scaredTimer / 14) % 2 === 0;
            // Elige color de cuerpo.
            const bodyColor = blinking ? "#f7f7f7" : "#050816";
            // Elige color de borde.
            const strokeColor = blinking ? "#ed1c24" : "#67e8f9";
            // Elige color de ojos.
            const eyeColor = blinking ? "#ed1c24" : "#e8fbff";
            // Guarda estado del canvas.
            ctx.save();
            // Aplica brillo elegante.
            ctx.shadowBlur = blinking ? 10 : 12;
            // Aplica color del brillo.
            ctx.shadowColor = strokeColor;
            // Comienza silueta.
            ctx.beginPath();
            // Dibuja la cabeza redondeada.
            ctx.arc(this.x, this.y - 2, this.radius + 4, Math.PI, 0);
            // Dibuja lateral derecho.
            ctx.lineTo(this.x + this.radius + 4, this.y + this.radius + 4);
            // Dibuja onda inferior.
            ctx.lineTo(this.x + 5, this.y + this.radius + 1);
            // Dibuja centro inferior.
            ctx.lineTo(this.x, this.y + this.radius + 4);
            // Dibuja onda inferior izquierda.
            ctx.lineTo(this.x - 5, this.y + this.radius + 1);
            // Dibuja lateral izquierdo.
            ctx.lineTo(this.x - this.radius - 4, this.y + this.radius + 4);
            // Cierra la silueta.
            ctx.closePath();
            // Rellena cuerpo.
            ctx.fillStyle = bodyColor;
            // Aplica relleno.
            ctx.fill();
            // Define grosor de borde.
            ctx.lineWidth = 2;
            // Define color de borde.
            ctx.strokeStyle = strokeColor;
            // Dibuja borde.
            ctx.stroke();
            // Apaga brillo para detalles.
            ctx.shadowBlur = 0;
            // Define color de ojos.
            ctx.fillStyle = eyeColor;
            // Dibuja ojo izquierdo.
            ctx.beginPath(); ctx.arc(this.x - 6, this.y - 2, 2.4, 0, Math.PI * 2); ctx.fill();
            // Dibuja ojo derecho.
            ctx.beginPath(); ctx.arc(this.x + 6, this.y - 2, 2.4, 0, Math.PI * 2); ctx.fill();
            // Define color de boca.
            ctx.strokeStyle = strokeColor;
            // Define grosor de boca.
            ctx.lineWidth = 1.5;
            // Dibuja boca curva.
            ctx.beginPath(); ctx.arc(this.x, this.y + 6, 5, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
            // Restaura canvas.
            ctx.restore();
            // Sale porque ya dibujo estado debil.
            return;
        }

        // Si el sprite cargo, lo dibuja centrado.
        if (img.complete && img.naturalWidth !== 0) {
            // Ajusta tamano para enemigo especial o copa normal.
            const spriteSize = this.imgKey === 'di_maria' ? DI_MARIA_SPRITE_SIZE : GHOST_SPRITE_SIZE;
            // Dibuja sprite.
            drawCenteredImage(ctx, img, this.x, this.y, spriteSize, spriteSize);
        } else {
            // Dibuja forma fallback si falta el sprite.
            ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, Math.PI, 0);
            // Dibuja lado derecho fallback.
            ctx.lineTo(this.x + this.radius, this.y + this.radius);
            // Dibuja lado izquierdo fallback.
            ctx.lineTo(this.x - this.radius, this.y + this.radius);
            // Usa color fallback.
            ctx.fillStyle = this.color; ctx.fill(); ctx.closePath();
        }
    }
}
