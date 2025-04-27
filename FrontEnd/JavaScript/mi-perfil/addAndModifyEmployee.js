import {openModal} from "../modals/abrirYCerrarModal.js";

async function cargarModalCrearCuenta() {
    const response = await fetch(`/addEmployee`);
    const html = await response.text();
    openModal(html);
}

export function addEventListenerAddEmployee() {
    document.getElementById("add-employee-btn").addEventListener("click", cargarModalCrearCuenta);
}