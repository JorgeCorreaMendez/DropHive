// Función asincrónica que se ejecuta cuando el DOM está listo
import {recuperarNombreBaseDatos} from "./recursos.js";
import {aplicarFiltros} from "./filtrado.js";
import {recuperarProductos, addInformacionFilaProducto, modificarCabeceraTablaProductos} from "./home/productos.js";
import {addInformacionFilaCategoria} from "./home/categorias.js";
import { initPagination } from "./recursos/paginado.js";

export async function cargarDatosEnTabla(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = '';
    const vistaActual = document.body.dataset.vista;

    console.log(`Vista actual: ${vistaActual}`);
    console.log("Datos recibidos:", data);

    for (const item of data) {
        let row;
        if (vistaActual === "productos") {
            row = await addInformacionFilaProducto(item);
        } else {
            row = await addInformacionFilaCategoria(item);
        }
        tableBody.appendChild(row);
    }
}

async function actualizarOpcionesCategoria() {
    const select = document.getElementById('select-categoria');

    select.innerHTML = '<option value="all">All</option>';

    try {
        const response = await fetch(`http://127.0.0.1:4000/categories`);

        if(!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json()

        console.log(data);

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

async function inicializarVista() {
    let total_productos = await recuperarProductos();
    await modificarCabeceraTablaProductos();
    await actualizarOpcionesCategoria();
    await initPagination(total_productos); // Ejecuta la paginación después de obtener los datos de la API
}

function registrarEventos() {
    const supplierBtn = document.getElementById("supplier-btn");
    supplierBtn.addEventListener("click", redirigirASupply);

    const prevBtn = document.getElementById("prev-button");
    const nextBtn = document.getElementById("next-button");

    prevBtn.addEventListener("click", manejarCambioPagina);
    nextBtn.addEventListener("click", manejarCambioPagina);
}

async function redirigirASupply() {
    const dbName = await recuperarNombreBaseDatos();
    window.location.href = `http://127.0.0.1:4000/${dbName}/supply`;
}

async function manejarCambioPagina() {
    const vistaActual = document.body.dataset.vista;
    console.log("En manejar Cambio Pagina:", vistaActual);
    await aplicarFiltros(vistaActual);
}

// Llamamos a la función cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', async () => {
    await inicializarVista();
    registrarEventos();
});