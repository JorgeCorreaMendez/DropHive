import { openModal } from "../abrirYCerrarModal.js";
import {cargarDatosCategoria} from "./cargarDatosArticulo.js";

export function initializeRowClickHandlerCategory() {
  const tableBody = document.getElementById("table-body");

  if (!tableBody) {
    console.error("No se encontró el tbody con ID table-body");
    return;
  }

  tableBody.addEventListener("click", async (event) => {
    const clickedRow = event.target.closest("tr[data-category-id]");
    if (!clickedRow) return;

    const id_category = clickedRow.getAttribute("data-category-id");
    if (!id_category) return;

    try {
      let response = await fetch(`get_category?id=${id_category}`);
      const object = await response.json();

      console.log("El objeto es:", object[0])

      response = await fetch(`readCategory`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);
      await cargarDatosCategoria(object[0]);
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
