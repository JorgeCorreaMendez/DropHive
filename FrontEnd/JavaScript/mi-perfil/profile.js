import {addInformacionFilaEmpleado, recuperarCuentas} from "./cargarDatosTabla.js";
import {initializeRowClickHandler} from "../modals/lecturaUsuario/eventListenerTabla.js";
import {initializeModalEvents} from "../modals/abrirYCerrarModal.js";
import {addEventListenerAddEmployee} from "./addAndModifyEmployee.js";

export async function cargarDatosEnTablaPerfil(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = '';
    const vistaActual = document.body.dataset.vista;

    for (const item of data) {
        const row = await addInformacionFilaEmpleado(item);
        await tableBody.appendChild(row);
        cargarDatosEmpresa(item.mail);
    }
}

async function cargarDatosEmpresa(mail) {
    const response = await fetch(`http://127.0.0.1:4000/filter_account_by_mail?mail=${mail}`)
    const datos = await response.json()
    console.log("Hay que coger la compañia", datos.company);
    document.getElementById("store-name").textContent = datos[0].company.name;
    document.getElementById("user-name").textContent = datos[0].name;
    document.getElementById("user-mail").textContent = datos[0].mail;
    document.getElementById("user-privilege").textContent = datos[0].privileges.name;
    document.getElementById("user-phone").textContent = datos[0].phone ?? "Not declared";
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', async () => {
    await recuperarCuentas()
    initializeRowClickHandler();
    initializeModalEvents();
    addEventListenerAddEmployee();
});