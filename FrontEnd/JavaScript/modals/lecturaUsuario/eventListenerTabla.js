import { openModal } from "../abrirYCerrarModal.js";
import {cargarDatosUsuario} from "../../mi-perfil/viewEmployee.js";

export function initializeRowClickHandler() {
  const tableBody = document.getElementById("table-body");

  if (!tableBody) {
    console.error("No se encontró el tbody con ID table-body");
    return;
  }

  tableBody.addEventListener("click", async (event) => {
    const clickedRow = event.target.closest("tr[data-account-id]");
    if (!clickedRow) return;

    const id_account = clickedRow.getAttribute("data-account-id");
    if (!id_account) return;

    try {

      let response = await fetch(`filter_account_by_id?id=${id_account}`);
      const object = await response.json();

      response = await fetch(`viewEmployeeAction`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);
      await cargarDatosUsuario(object[0]);
    } catch (err) {
      console.error("Error al cargar el modal:", err);
      Swal.fire({
        icon: 'error',
        title: "Error al cargar el modal",
        html: err.message || "Ocurrió un error inesperado.",
        timer: 2500,
        showConfirmButton: false
      });
    }
  });
}
