import {openModal} from "../modals/abrirYCerrarModal.js";

export async function addInformacionFilaCategoria(item) {
    const row = document.createElement('tr');
    row.classList.add(
        'bg-[#D9D9D9]',
        'gap-[5px]',
        'text-center',
        'modal-trigger',
        'cursor-pointer',
        'hover:bg-[#bfbfbf]', // un tono más oscuro que #D9D9D9
        'transition-colors',
        'duration-200',
    );


    row.id = "list-article"
    row.setAttribute('data-product-id', item.id);

    console.log(item)
    // A partir de aquí se muestran los elementos de las columnas
    const idCell = document.createElement('td');
    idCell.classList.add('p-2', 'rounded-[5px]');
    idCell.textContent = item.id;

    const nameCell = document.createElement('td');
    nameCell.classList.add('p-2', 'rounded-[5px]');
    nameCell.textContent = item.name;

    const descriptionCell = document.createElement('td');
    descriptionCell.classList.add('p-2', 'rounded-[5px]');
    descriptionCell.textContent = item.description;

    //Agregamos las celdas a la fila
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(descriptionCell);

    return row;
}

export async function modificarCabeceraTablaCategoria() {
    const cabeceras = ["ID", "Name", "Description"];
    const filaCabecera = document.getElementById("cabecera-tabla");

    filaCabecera.innerHTML = '';

    cabeceras.forEach(texto => {
      const th = document.createElement("th");
      th.textContent = texto;
      th.className = "p-2 rounded-[5px]"; // Tailwind classes
      filaCabecera.appendChild(th);
    });
}

export async function cargarModalCrearCategoria() {
    const response = await fetch(`/addAndModifyCategory`);
    const html = await response.text();
    openModal(html);
}