import url from 'url';

const direccion = new URL('http://localhost:3000/pagina?nombre=juan&edad=20');

console.log('Host:', direccion.host);
console.log('Path:', direccion.pathname);
console.log('Query:', direccion.query);
console.log('protocol:', direccion.protocol);