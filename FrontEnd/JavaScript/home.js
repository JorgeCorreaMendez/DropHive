// Función asincrónica que se ejecuta cuando el DOM está listo
import {recuperarNombreBaseDatos} from "./recursos.js";
import {aplicarFiltros} from "./filtrado.js";
import {recuperarProductos, addInformacionFilaProducto, modificarCabeceraTablaProductos} from "./home/productos.js";
import {addInformacionFilaCategoria} from "./home/categorias.js";

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
}

/*
TODO:
 verificar para poder realizar el paginado.
 ya se puede mostrar x elementos pero es necesario que haya un indicador de que existen más elementos para poder hacer
 la llamada a la función que maneje el paginado.
 Se podría realizar modificando la función de filter_products para devolver el número de elementos totales de la tabla.
 */

export async function cargarDatosEnTabla(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ''; // Limpiar antes de agregar nuevos productos
    const db_name = await recuperarNombreBaseDatos();
    console.log(data)
    const vistaActual = document.body.dataset.vista;

    for (const item of data) {
        let row = "";
        if (vistaActual === "productos") {
            row = addInformacionFilaProducto(item, db_name);
        } else {
            row = addInformacionFilaCategoria(item, db_name);
        }

        //Agregamos al tablebody
        await tableBody.appendChild(await row);
    }
}

/*
No recuerdo que hace esto.
Revisar durante refactorización.
 */
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
    await modificarCabeceraTablaProductos();
    await actualizarOpcionesCategoria();
    await initPagination(total_productos); // Ejecuta la paginación después de obtener los datos de la API
    document.getElementById("supplier-btn").addEventListener("click", async () => {
        const db_name = await recuperarNombreBaseDatos();
        window.location.href = `http://127.0.0.1:4000/${db_name}/supply`;
    });
    document.getElementById("next-button").addEventListener("click", async () => {
        const vistaActual = document.body.dataset.vista;
        await aplicarFiltros(vistaActual);
    })
    document.getElementById("prev-button").addEventListener("click", async () => {
        const vistaActual = document.body.dataset.vista;
        await aplicarFiltros(vistaActual);
    })
});