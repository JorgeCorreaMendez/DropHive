import {cargarDatosEnTabla} from "../home.js";
import { initPagination } from "../recursos/paginado.js";


export async function recuperarProductos() {
    try {
        const response = await fetch(`http://127.0.0.1:4000/filter_products`);

        // Verifica que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // Espera la respuesta JSON
        const respuesta_json = await response.json();


        // Aquí puedes trabajar con los datos obtenidos de la API
        await cargarDatosEnTabla(respuesta_json);
        await initPagination(respuesta_json.length);

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
    row.setAttribute('data-product-id', item.product_id);

    // A partir de aquí se muestran los elementos de las columnas
    const idCell = document.createElement('td');
    idCell.classList.add('p-2', 'rounded-[5px]');
    idCell.textContent = item.product_id;

    const nameCell = document.createElement('td');
    nameCell.classList.add('p-2', 'rounded-[5px]');
    nameCell.textContent = item.name;

    let category_name = await localizarCategoria(item.category_id);

    const categoryCell = document.createElement('td');
    categoryCell.classList.add('p-2', 'rounded-[5px]');
    categoryCell.textContent = category_name;

    const purchaseCell = document.createElement('td');
    purchaseCell.classList.add('p-2', 'rounded-[5px]');
    purchaseCell.textContent = item.price + " €";

    const sellCell = document.createElement('td');
    sellCell.classList.add('p-2', 'rounded-[5px]');
    sellCell.textContent = item.price + " €";

    const quantityCell = document.createElement('td');
    quantityCell.classList.add('p-2', 'rounded-[5px]');
    quantityCell.textContent = item.quantity;

    //Agregamos las celdas a la fila
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(categoryCell);
    row.appendChild(purchaseCell);
    row.appendChild(sellCell);
    row.appendChild(quantityCell);

    return row;
}

export async function localizarCategoria(id) {
    try {
        const response = await fetch(`http://127.0.0.1:4000/get_category/${id}`)

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.name)
        return data.name
    } catch (e) {
        console.log(e)
    }
}

export async function modificarCabeceraTablaProductos() {
    const cabeceras = ["ID", "Name", "Category", "Buying Price", "Selling Price", "Quantity"];
    const filaCabecera = document.getElementById("cabecera-tabla");

    filaCabecera.innerHTML = '';

    cabeceras.forEach(texto => {
      const th = document.createElement("th");
      th.textContent = texto;
      th.className = "p-2 rounded-[5px]"; // Tailwind classes
      filaCabecera.appendChild(th);
    });
}