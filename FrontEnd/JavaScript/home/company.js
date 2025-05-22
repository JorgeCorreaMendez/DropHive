import {openModal} from "../modals/abrirYCerrarModal.js";
import {addCompany} from "../company/AddAndModifyCompany.js";

export async function addInformacionFilaCompany(item) {
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
    row.setAttribute('data-company-id', item.id);

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

export async function modificarCabeceraTablaCompany() {
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


export async function cargarModalCrearCompany() {
    try {
        const response = await fetch(`/addAndModifyCompany`);
        const html = await response.text();
        openModal(html);

        // Esperamos a que el modal se haya insertado en el DOM.
        setTimeout(() => {
            const form = document.getElementById("company-form");
            if (form) {
                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    addCompany(); // Llama a la función importada
                });
            } else {
                console.error("Error: No se encontró el formulario con id 'company-form'");
            }
        }, 300); // Ajusta este timeout según sea necesario.
    } catch (error) {
        console.error("Error al cargar el modal:", error);
    }
}
