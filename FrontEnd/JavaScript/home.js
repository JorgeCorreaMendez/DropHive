// Función asincrónica que se ejecuta cuando el DOM está listo

/*TODO:
  Hay que revisar que los productos se actualicen bien cuando hay un gran número de elementos.
  Hay que actualizar el recuperarProductos para que muestre el número de productos según se dice en el selector.
 */
import {recuperarNombreBaseDatos} from "./recursos.js";
import {aplicarFiltros} from "./filtrado.js";

export async function initPagination(total_productos) {
    // Número total de artículos (esto debería ser el resultado de tu llamada a la API)
    const totalItems = total_productos; // Ejemplo: 100 artículos

    // Obtener el valor seleccionado en el select
    const itemsPerPageSelect = document.getElementById('items-per-page');
    let itemsPerPage = parseInt(itemsPerPageSelect.value, 10); // Obtener el valor seleccionado

    // Calcular el número de páginas
    let totalPages = Math.ceil(totalItems / itemsPerPage);

    // Mostrar el número total de páginas (puedes hacer algo con esto más tarde)
    console.log("Total de items: ", totalPages)


    // Inicializar la paginación con las páginas correctas
    let currentPage = 1; // Página actual

    // Elementos de la paginación
    const pageNumberElement = document.getElementById('page-number');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    // Mostrar la página inicial
    updatePage();

    // Función para actualizar la página mostrada
    function updatePage() {
        pageNumberElement.textContent = currentPage;

        // Deshabilitar botones si estamos en la primera o última página
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    // Botón de la página anterior
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });

    // Botón de la página siguiente
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    });

    // Cuando cambie el valor del select, recalcular y actualizar la paginación
    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
        totalPages = Math.ceil(totalItems / itemsPerPage); // Recálculo de páginas
        currentPage = 1; // Resetear a la primera página
        updatePage();
    });
}

/*
TODO:
 verificar para poder realizar el paginado.
 ya se puede mostrar x elementos pero es necesario que haya un indicador de que existen más elementos para poder hacer
 la llamada a la función que maneje el paginado.
 Se podría realizar modificando la función de filter_products para devolver el número de elementos totales de la tabla.
 */
async function recuperarProductos() {
  const db_name = await recuperarNombreBaseDatos();

  console.log(db_name);

  try {
        const response = await fetch(`http://127.0.0.1:4000/${db_name}/filter_products`);

        // Verifica que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // Espera la respuesta JSON
        const respuesta_json = await response.json();
        const data = await respuesta_json.productos

        // Aquí puedes trabajar con los datos obtenidos de la API
        console.log(data);

        await cargarDatosEnTabla(data);
        await initPagination(respuesta_json.total);

      return respuesta_json.total;

    } catch (error) {
        console.error('Hubo un error al hacer la solicitud:', error);
    }
}

export async function cargarDatosEnTabla(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ''; // Limpiar antes de agregar nuevos productos
    const db_name = await recuperarNombreBaseDatos();
    console.log(data)

    for (const item of data) {
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

        let category_name = await localizarCategoria(db_name, item.category_id);

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

        //Agregamos al tablebody
        tableBody.appendChild(row);
        requestAnimationFrame(() => {
          row.classList.remove('opacity-0'); // la vuelve visible gradualmente
        });
    }
}

export async function localizarCategoria(db_name, id) {
    try {
        const response = await fetch(`http://127.0.0.1:4000/${db_name}/get_category/${id}`)

        if(!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.name)
        return data.name
    } catch (e) {
        console.log(e)
    }
}

async function actualizarOpcionesCategoria() {
    const db_name = await recuperarNombreBaseDatos();

    const select = document.getElementById('select-categoria');

    select.innerHTML = '<option value="all">All</option>';

    try {
        const response = await fetch(`http://127.0.0.1:4000/${db_name}/categories`);

        if(!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json()

        for (let i = 0; i < data.length; i++) {
            const option = document.createElement('option');
            option.value = data[i].name; // O cambia por otro campo si necesitas otro valor
            option.textContent = data[i].name;
            select.appendChild(option);
        }

    } catch (e) {
        console.log(e);
    }
}

// Llamamos a la función cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', async () => {
    let total_productos = await recuperarProductos();
    await actualizarOpcionesCategoria();
    await initPagination(total_productos); // Ejecuta la paginación después de obtener los datos de la API
    document.getElementById("supplier-btn").addEventListener("click", async () => {
        const db_name = await recuperarNombreBaseDatos();
        window.location.href = `http://127.0.0.1:4000/${db_name}/supply`;
    });
    document.getElementById("next-button").addEventListener("click", async () => {
        await aplicarFiltros();
    })
    document.getElementById("prev-button").addEventListener("click", async () => {
        await aplicarFiltros();
    })
});