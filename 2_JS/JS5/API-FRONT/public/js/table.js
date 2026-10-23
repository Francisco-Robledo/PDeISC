export const renderAlumnosTable = (tableBody, alumnos) => {
  tableBody.innerHTML = alumnos.map((alumno) => `
    <tr>
      <th scope="row">${alumno.id}</th>
      <td>${alumno.nombre}</td>
      <td>${alumno.apellido}</td>
      <td>${alumno.edad}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-outline-primary" type="button" data-action="edit" data-id="${alumno.id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete" data-id="${alumno.id}">Borrar</button>
        </div>
      </td>
    </tr>
  `).join('');
};

export const formatTotal = (total) => `${total} ${total === 1 ? 'alumno' : 'alumnos'}`;
