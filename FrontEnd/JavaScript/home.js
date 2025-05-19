// Función asincrónica que se ejecuta cuando el DOM está listo
import {recuperarNombreBaseDatos} from "./recursos.js";
import {aplicarFiltros} from "./filtrado.js";
import {recuperarProductos, addInformacionFilaProducto, modificarCabeceraTablaProductos} from "./home/productos.js";
import {addInformacionFilaCategoria} from "./home/categorias.js";
import { initPagination } from "./recursos/paginado.js";
import { actualizarOpcionesCategoria } from "./desplegables/desplegable.categorias.js";
import {addInformacionFilaCompany} from "./home/company.js";

export async function cargarDatosEnTabla(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = '';
    const vistaActual = document.body.dataset.vista;

    for (const item of data) {
        let row;
        if (vistaActual === "productos") {
            row = await addInformacionFilaProducto(item);
        } else if (vistaActual === "categorias") {
            row = await addInformacionFilaCategoria(item);
        } else if (vistaActual === "company") {
            row = await addInformacionFilaCompany(item);
        }
        tableBody.appendChild(row);
    }
}

async function inicializarVista() {
    let total_productos = await recuperarProductos();
    await modificarCabeceraTablaProductos();
    await actualizarOpcionesCategoria();
}

function registrarEventos() {
    const logBtn = document.getElementById("log-btn");
    logBtn.addEventListener("click", redirigirALog);

    const prevBtn = document.getElementById("prev-button");
    const nextBtn = document.getElementById("next-button");

    prevBtn.addEventListener("click", manejarCambioPagina);
    nextBtn.addEventListener("click", manejarCambioPagina);
}

async function redirigirALog() {
    const dbName = await recuperarNombreBaseDatos();
    window.location.href = `http://127.0.0.1:4000/log`;
}

async function manejarCambioPagina() {
    const vistaActual = document.body.dataset.vista;
    await aplicarFiltros(vistaActual);
}

// Llamamos a la función cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', async () => {
    await inicializarVista();
    registrarEventos();
});