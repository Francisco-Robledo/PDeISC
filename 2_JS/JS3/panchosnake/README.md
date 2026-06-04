# Pancho Snake - Lista De Archivos

- `index.html`: estructura principal de la pagina. Contiene las pantallas de menu, jugar, partida, ranking, creditos, modal final y aviso para girar el dispositivo.

- `css/styles.css`: estilos visuales completos del proyecto. Define colores, fuentes, menu, tablero, botones, responsive, modo horizontal, tarjetas de creditos, ranking, historial, animaciones y cartel de orientacion.

- `js/audio-service.js`: maneja musica y efectos de sonido. Carga los audios de `assets/sounds`, desbloquea sonido despues del primer click, reproduce musica de menu/partida y efectos como click, choque, recoger aderezo, evento, nivel, record y game over.

- `js/game-config.js`: configuracion general del juego. Guarda tamano del tablero, velocidades por nivel, puntajes, tiempos de aparicion, limite final, rutas de sprites, direcciones, teclas y datos fijos usados por el motor.

- `js/game-events.js`: catalogo de eventos aleatorios. Elige que evento aparece y define si necesita cuenta regresiva antes de activarse.

- `js/game-utils.js`: funciones auxiliares reutilizables. Sirve para cargar imagenes, comparar casillas, buscar posiciones libres, revisar vecinos, clonar el cuerpo del pancho, suavizar movimiento y formatear duracion.

- `js/game.js`: motor principal de la partida. Controla estado del juego, movimiento, colisiones, crecimiento, items, revive, obstaculos, eventos, niveles, final de partida, renderizado en canvas y controles de teclado.

- `js/main.js`: conecta la interfaz con el motor. Cambia pantallas, valida formulario, inicia partidas, reinicia, pausa, vuelve al menu, genera controles tactiles, muestra modal final, ranking, historial y creditos.

- `js/player.js`: servicio de jugadores. Crea jugadores, arma el pancho inicial de 3 casillas, reinicia datos y revive al jugador con cuerpo completo.

- `js/storage.js`: guardado local. Usa LocalStorage para guardar historial, record, recuperar partidas y borrar datos.

- `js/validation.js`: validacion del formulario. Limpia nombres, revisa longitud minima y evita nombres repetidos en modo 2 jugadores.

- `server.js`: servidor local simple de Node. Sirve los archivos del proyecto en `http://127.0.0.1:5000/`.

- `ASSETS-INSTRUCCIONES.txt`: instrucciones para reemplazar o agregar assets visuales y de audio.

- `.vscode/settings.json`: configuracion local de Visual Studio Code.

- `assets/img/cola.png`: sprite de cola del pancho.

- `assets/img/cola copy.png`: sprite usado como cabeza del pancho.

- `assets/img/cuerpo1.png`: sprite de cuerpo horizontal.

- `assets/img/cuerpo2.png`: sprite de cuerpo vertical.

- `assets/img/cuerpo3.png`: sprite de curva del cuerpo.

- `assets/img/cuerpo4.png`: sprite de curva del cuerpo.

- `assets/img/cuerpo5.png`: sprite de curva del cuerpo.

- `assets/img/cuerpo6.png`: sprite de curva del cuerpo.

- `assets/img/credits-robledo.jpg`: foto de Francisco Robledo en la pantalla de creditos.

- `assets/img/credits-rivas.jpg`: foto de Matias Rivas en la pantalla de creditos.

- `assets/img/Gemini_Generated_Image_dsw5usdsw5usdsw5.png`: imagen decorativa/importada para el proyecto.

- `assets/img/pancho-floating.png`: pancho decorativo para menu o fondo.

- `assets/img/pancho-pixel.png`: sprite decorativo de pancho pixel art.

- `assets/img/sprites/topping-normal.png`: sprite del aderezo normal.

- `assets/img/sprites/topping-golden.png`: sprite del aderezo dorado.

- `assets/img/sprites/topping-revive.png`: sprite de la salsa especial de revive.

- `assets/img/sprites/obstacle-sauce.png`: sprite del obstaculo.

- `assets/sounds/choque.wav`: sonido de choque o muerte.

- `assets/sounds/click.wav`: sonido de botones.

- `assets/sounds/eventoloco.wav`: sonido al comenzar un evento.

- `assets/sounds/gameover.wav`: sonido de fin de partida.

- `assets/sounds/menu.mp3`: musica del menu y pantallas fuera de partida.

- `assets/sounds/nuevonivel.wav`: sonido al subir de nivel.

- `assets/sounds/play.mp3`: musica durante la partida.

- `assets/sounds/recoger(especial).wav`: sonido para aderezo especial, revive o dorado.

- `assets/sounds/recoger.wav`: sonido al agarrar aderezo normal.

- `assets/sounds/record.wav`: sonido al lograr nuevo record.
