import {openModal} from "../modals/abrirYCerrarModal.js";
import { agregarCompañia } from "./AddAndModifyCompany.js";

export function initializeRowClickHandlerCompany() {
  const tableBody = document.getElementById("table-body");

  if (!tableBody) {
    console.error("No se encontró el tbody con ID table-body");
    return;
  }

  tableBody.addEventListener("click", async (event) => {
    const clickedRow = event.target.closest("tr[data-company-id]");
    if (!clickedRow) return;

    const id_company = clickedRow.getAttribute("data-company-id");
    if (!id_company) return;

    try {
      // 1. Obtener datos de la compañía seleccionada
      let response = await fetch(`get_company?id=${id_company}`);
      const object = await response.json();

      // 2. Cargar HTML del modal de visualización
      response = await fetch(`readCompany`);
      const html = await response.text();

      // 3. Mostrar el modal de visualización
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;
      openModal(bodyContent);

      // 4. Esperar a que el modal esté montado para registrar evento en el botón "Modificar"
      setTimeout(() => {
        const modifyBtn = document.getElementById("modify-company-btn");
        if (modifyBtn) {
          modifyBtn.addEventListener("click", async () => {
            // 5. Cargar HTML del formulario de edición
            const modResponse = await fetch(`/addAndModifyCompany`);
            const modHtml = await modResponse.text();

            const doc = new DOMParser().parseFromString(modHtml, "text/html");
            const modBody = doc.body.innerHTML;
            openModal(modBody);

            // 6. Esperar al render del nuevo modal y rellenar campos
            setTimeout(() => {
              const form = document.getElementById("company-form");
              if (!form) return;

              const idInput = document.getElementById("company-id");
              const nameInput = document.getElementById("company-name");
              const descInput = document.getElementById("company-description");

              if (idInput) idInput.value = object.id || "";
              if (nameInput) nameInput.value = object.name || "";
              if (descInput) descInput.value = object.description || "";

              // Registrar evento submit con la función exportada
              form.addEventListener("submit", (event) => {
                event.preventDefault();
                agregarCompañia(); // Usa el mismo manejador para crear/modificar
              });
            }, 100);
          });
        }
      }, 100);
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
