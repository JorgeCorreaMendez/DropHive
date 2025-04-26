import {addInformacionFilaEmpleado, recuperarCuentas} from "./cargarDatosTabla.js";

export async function cargarDatosEnTablaPerfil(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = '';
    const vistaActual = document.body.dataset.vista;

    console.log(`Vista actual: ${vistaActual}`);
    console.log("Datos recibidos:", data);

    for (const item of data) {
        const row = await addInformacionFilaEmpleado(item);
        await tableBody.appendChild(row);
        cargarDatosEmpresa(item.name, item.description);
    }
}

function cargarDatosEmpresa(nombre, descripcion) {
    document.getElementById("store-name").textContent = nombre;
    document.getElementById("description").textContent = descripcion;
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', async () => {
    await recuperarCuentas()

});
