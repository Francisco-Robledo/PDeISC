# BOVER - mapa de archivos

- `index.html`: estructura principal de la app; contiene las pantallas de menu, preparacion, ranking, creditos, juego, modal y game over.

- `server.js`: servidor local Node.js; sirve archivos estaticos, maneja `/api/history` y corre el juego en `http://127.0.0.1:4180/`.
- `history.json`: historial de partidas; guarda puntajes, fecha, modo, jugadores y duracion.

- `css/styles.css`: estilos visuales; define layout arcade, botones, HUD, controles tactiles para celular, ranking, creditos y adaptacion responsive.

- `js/game-config.js`: configuracion global del juego; guarda tamanos, nivel maximo 6, tiempos, chances de aparicion y desbloqueos.

- `js/assets-audio.js`: carga imagenes, sprites, efectos y musica; tambien prepara el audio y expone funciones para dibujar imagenes y reproducir sonidos.

- `js/player.js`: clase del jugador; controla posicion, direccion, equipo, movimiento, colisiones con paredes y dibujo.

- `js/ghost.js`: clase de copa/fantasma; controla IA, estado debil, parpadeo y retorno al spawn como pelota siguiendo los pasillos.

- `js/game.js`: motor de partida; inicializa juego, crea jugadores/copas, actualiza puntos, niveles hasta 6, resetea escudos al subir de nivel, vidas, enemigo especial, HUD y game over.

- `js/game-render.js`: dibujo del gameplay; pinta laberinto, items, jugadores, copas, avisos y contador del enemigo especial.

- `js/main.js`: navegacion de pantallas; conecta botones del menu, setup, ranking, creditos, pausa, pantalla completa, deteccion PC/celular, modal y reinicio.

- `js/storage.js`: persistencia del historial; lee, guarda y borra partidas desde la API del servidor.

- `js/validation.js`: validaciones auxiliares; conserva reglas de entrada si se necesitan en formularios.

- `assets/img/LOGO.png`: logo usado en el menu principal.

- `assets/img/PELOTA.png`: sprite que aparece cuando una copa comida vuelve al spawn por los pasillos del mapa.

- `assets/img/FANTASMA1.png`: sprite de la copa enemiga 1.
- `assets/img/FANTASMA2.png`: sprite de la copa enemiga 2.
- `assets/img/FANTASMA3.png`: sprite de la copa enemiga 3.
- `assets/img/FANTASMA4.png`: sprite de la copa enemiga 4.
- `assets/img/DIMARIA.png`: sprite del enemigo especial del nivel 1.
- `assets/img/CHIQUI.png`: sprite del enemigo especial del nivel 2.
- `assets/img/INFANTINO.png`: sprite del enemigo especial del nivel 3.
- `assets/img/PENAL.jpg`: sprite del item penal.
- `assets/img/arbitro.png`: sprite del item arbitro.
- `assets/img/credits-rivas.jpg`: foto del desarrollador Rivas en creditos.
- `assets/img/credits-robledo.jpg`: foto del desarrollador Robledo en creditos.
- `assets/sounds/menu.mp3`: musica del menu.
- `assets/sounds/play.mp3`: musica de la partida.
- `assets/sounds/click.wav`: efecto de botones.
- `assets/sounds/recoger.wav`: efecto al juntar puntos o items.
- `assets/sounds/choque.wav`: efecto al chocar, morir o comer una copa.
- `assets/sounds/gameover.wav`: efecto de fin de partida.
- `assets/sounds/nuevonivel.wav`: efecto al subir de nivel.
