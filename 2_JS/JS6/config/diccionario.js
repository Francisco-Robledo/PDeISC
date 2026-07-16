import axios from 'axios';

// Base local amplia: permite jugar incluso si el servicio externo no responde.
// La API publica se consulta una sola vez al iniciar y sus resultados se suman aqui.
const PALABRAS_BASE = `
ABRIGO ABUELA ACEITUNA ACUARIO AEROPUERTO AGUILA AJEDREZ ALARMA ALBUM ALDEA
ALGODON ALIMENTOS ALPACA AMISTAD ANCLA ANDEN ANIMAL ANILLO ANTENA ARBOL ARENA
ARPA ARTE ASTRO ATOMO AULA AVENTURA AVION AZUCAR BAILAR BALCON BALON BANANA
BARCO BARRIO BATERIA BIBLIOTECA BICICLETA BLANCO BOSQUE BOTELLA BRUJULA BUFANDA
BURBUJA CABALLO CAFE CALENDARIO CALLE CAMARA CAMINO CAMPANA CANASTA CANGURO
CANTAR CAPITAN CARACOL CARTA CASTILLO CEBOLLA CEREBRO CEREZA CIELO CINE CIRCULO
CIUDAD CLASE CLAVEL COCINA COHETE COLEGIO COLLAR COLOR COMETA COMIDA COMPUTADORA
CONEJO CONSEJO CORAZON CORONA CORREDOR CUADRO CUENTO CUERDA CUERPO CUNA CUZCO
DADO DANZA DEPORTE DESIERTO DESTINO DIAMANTE DIBUJO DINOSAURIO DOCTOR DOMINO
DRAGON DUENDE EDIFICIO ELEFANTE ENERGIA ESCALERA ESCUDO ESCUELA ESPEJO ESTACION
ESTRELLA FARO FELINO FIESTA FIGURA FLOR FLORERO FOGATA FORTUNA FOTOGRAFIA FRUTA
FUEGO FUTBOL GALAXIA GALLINA GATO GIGANTE GIRASOL GLACIAR GLOBO GORILA GRANJA
GRILLO GUITARRA HAMACA HELADO HERMANO HIELO HISTORIA HOGAR HORMIGA HOSPITAL HOTEL
HUELLA HUMANO IDEA IGLESIA IMAGEN IMAN IMPRESORA ISLA JABON JARDIN JIRAFA JOYA
JUEGO JUGUETE JUGADOR JUNGLA LAGO LAPIZ LEON LIBRO LIMON LLAVE LOBEZNO LUCES LUNA
MAESTRO MALETA MANZANA MARIPOSA MARTILLO MEDALLA MEDICO MELODIA MENSAJE MERCADO
METEORO MICROFONO MIEL MONTANA MONEDA MONSTRUO MOTO MURALLA MUSICA NARANJA NIDO
NIEBLA NOCHE NUBE NUMERO OCEANO OFICINA OLIVO ORQUESTA OSO OTOÑO OVEJA PAILA
PALACIO PALOMA PANADERIA PANTALLA PAPEL PARQUE PASTEL PATO PELICULA PELOTA PERRO
PESCADO PIANO PIEDRA PIRATA PLANETA PLANTA PLATO PLAYA PLUMA POESIA POLICIA PONCHO
PORTAL PRADERA PRINCESA PRISMA PROFESOR PUENTE PUERTA QUESO QUIMICA RADIADOR
RADIO RAIZ RATON RELOJ REMOLINO RIO ROBOT ROCA RODILLA ROMPECABEZAS ROSA RUEDA
SALSA SATELITE SELVA SEMILLA SIRENA SOBRE SOL SOMBRERO SONRISA SUBMARINO SUEÑO
TAMBOR TAZA TEATRO TECHO TELEFONO TEMPERATURA TESORO TIGRE TIJERA TINTA TORMENTA
TORRE TORTUGA TREN TRIANGULO TRUENO TUNEL UNIVERSO VALLE VELA VENTANA VESTIDO
VIAJE VIENTO VIOLIN VOLCAN ZANAHORIA ZAPATO ZORRO
`.trim().split(/\s+/);

const PALABRA_VALIDA = /^[A-ZÑ]{3,30}$/u;

const normalizarPalabra = (valor) => String(valor)
    .trim()
    .toLocaleUpperCase('es-AR')
    .replace(/[ÁÀÄÂ]/g, 'A')
    .replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[ÚÙÜÛ]/g, 'U');

class Diccionario {
    constructor() {
        this.listaPalabras = [];
    }

    async inicializar() {
        let palabrasApi = [];

        try {
            // Unica llamada externa durante toda la ejecucion del servidor.
            const respuesta = await axios.get('https://random-word-api.herokuapp.com/word?lang=es&number=50', { timeout: 8000 });
            palabrasApi = Array.isArray(respuesta.data) ? respuesta.data : [];
        } catch (error) {
            console.error('[Diccionario] La API externa no respondio; se usa la base local.');
        }

        this.listaPalabras = [...new Set([...PALABRAS_BASE, ...palabrasApi]
            .map(normalizarPalabra)
            .filter((palabra) => PALABRA_VALIDA.test(palabra)))]
            .sort((primera, segunda) => primera.localeCompare(segunda, 'es'));

        console.log(`[Diccionario] ${this.listaPalabras.length} palabras disponibles en memoria.`);
    }

    obtenerPalabraAleatoria() {
        if (this.listaPalabras.length === 0) return 'AHORCADO';
        return this.listaPalabras[Math.floor(Math.random() * this.listaPalabras.length)];
    }

    obtenerPalabras() {
        return [...this.listaPalabras];
    }

    agregarPalabra(valor) {
        const palabra = normalizarPalabra(valor);

        if (!PALABRA_VALIDA.test(palabra)) {
            throw new Error('Ingresa una palabra de entre 3 y 30 letras, sin numeros ni simbolos.');
        }
        if (!/[AEIOU]/.test(palabra)) {
            throw new Error('La palabra debe contener al menos una vocal.');
        }
        if (/(.)\1\1/u.test(palabra)) {
            throw new Error('La palabra contiene demasiadas letras repetidas consecutivas.');
        }
        if (this.listaPalabras.includes(palabra)) {
            throw new Error('Esa palabra ya esta disponible en el diccionario.');
        }

        this.listaPalabras.push(palabra);
        this.listaPalabras.sort((primera, segunda) => primera.localeCompare(segunda, 'es'));
        return palabra;
    }
}

export default new Diccionario();
