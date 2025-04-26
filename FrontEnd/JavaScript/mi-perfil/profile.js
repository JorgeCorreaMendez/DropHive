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
    }
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', async () => {
    await recuperarCuentas()

});
