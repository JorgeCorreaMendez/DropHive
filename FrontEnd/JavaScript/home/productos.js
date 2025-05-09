import {cargarDatosEnTabla} from "../home.js";
import { initPagination } from "../recursos/paginado.js";
import {openModal} from "../modals/abrirYCerrarModal.js";
import {agregarProducto} from "../createItem.js";


export async function recuperarProductos() {
    try {
        const response = await fetch(`http://127.0.0.1:4000/filter_products`);

        // Verifica que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // Espera la respuesta JSON
        const respuesta_json = await response.json();
        const productos = respuesta_json.productos
        const total = respuesta_json.total

        // Aquí puedes trabajar con los datos obtenidos de la API
        await cargarDatosEnTabla(productos);
        await initPagination(total);

        return respuesta_json.length;

    } catch (error) {
        console.error('Hubo un error al hacer la solicitud:', error);
    }
}

export async function addInformacionFilaProducto(item) {
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

    // A partir de aquí se muestran los elementos de las columnas
    const idCell = document.createElement('td');
    idCell.classList.add('p-2', 'rounded-[5px]');
    idCell.textContent = item.id;

    const nameCell = document.createElement('td');
    nameCell.classList.add('p-2', 'rounded-[5px]');
    nameCell.textContent = item.name;

    let category_name = await localizarCategoria(item.category_id);

    const categoryCell = document.createElement('td');
    categoryCell.classList.add('p-2', 'rounded-[5px]');
    categoryCell.textContent = category_name;

    const sellCell = document.createElement('td');
    sellCell.classList.add('p-2', 'rounded-[5px]');
    sellCell.textContent = item.price + " €";

    const discountCell = document.createElement('td');
    discountCell.classList.add('p-2', 'rounded-[5px]');
    discountCell.textContent = item.discount + "%";

    const discountedCell = document.createElement('td');
    discountedCell.classList.add('p-2', 'rounded-[5px]');
    discountedCell.textContent = (item.price*(1-(item.discount/100))) + " €";

    const quantityCell = document.createElement('td');
    quantityCell.classList.add('p-2', 'rounded-[5px]');
    quantityCell.textContent = item.quantity;

    //Agregamos las celdas a la fila
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(categoryCell);
    row.appendChild(sellCell);
    row.appendChild(discountCell);
    row.appendChild(discountedCell);
    row.appendChild(quantityCell);

    return row;
}

export async function localizarCategoria(id) {
    try {
        const response = await fetch(`http://127.0.0.1:4000/get_category?id=${id}`)

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        return data.name
    } catch (e) {
        console.error(e)
    }
}

export async function modificarCabeceraTablaProductos() {
    const cabeceras = ["ID", "Name", "Category", "Selling Price", "Discount", "Discounted Price", "Quantity"];
    const filaCabecera = document.getElementById("cabecera-tabla");

    filaCabecera.innerHTML = '';

    cabeceras.forEach(texto => {
      const th = document.createElement("th");
      th.textContent = texto;
      th.className = "p-2 rounded-[5px]"; // Tailwind classes
      filaCabecera.appendChild(th);
    });
}

export async function cargarModalCrearProducto() {
    const response = await fetch(`/createItem`);
    const html = await response.text();
    openModal(html);
    setTimeout(() => {
      document.getElementById("save-changes-btn")?.addEventListener("click", agregarProducto);
    }, 50);
}