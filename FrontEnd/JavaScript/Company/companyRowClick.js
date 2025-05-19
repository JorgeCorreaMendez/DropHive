import { openModal, closeModal } from "../modals/abrirYCerrarModal.js";
import { agregarEmpresa } from "./AddAndModifyCompany.js";

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
      // Obtener los datos de la empresa desde el backend.
      let response = await fetch(`get_company?id=${id_company}`);
      if (!response.ok) throw new Error("Error al obtener datos de la empresa");
      const companyData = await response.json();

      // Cargar la vista de la empresa (modo lectura)
      response = await fetch(`readCompany`);
      if (!response.ok) throw new Error("Error al cargar la vista de la empresa");
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      // Abrir el modal con la vista de lectura de la empresa
      openModal(bodyContent);

      // Espera a que el modal se renderice (idealmente se usaría una promesa en openModal)
      setTimeout(() => {
        // Actualización de la información en el modal (modo lectura)
        const nameEl = document.getElementById("company-name");
        const descEl = document.getElementById("company-description");

        if (nameEl) nameEl.textContent = companyData.name || "";
        if (descEl) {
          // Si es un input/textarea usamos value; de lo contrario, innerHTML.
          if (descEl.tagName === "INPUT" || descEl.tagName === "TEXTAREA") {
            descEl.value = companyData.description || "";
          } else {
            descEl.innerHTML = (companyData.description || "").replace(/\n/g, "<br>");
          }
        }

        // Configurar el botón de MODIFICAR
        let modifyBtn = document.getElementById("modify-company-btn");
        if (modifyBtn) {
          // Reemplazar para remover listeners anteriores
          modifyBtn.replaceWith(modifyBtn.cloneNode(true));
          modifyBtn = document.getElementById("modify-company-btn");
          modifyBtn.addEventListener("click", async () => {
            try {
              const modResponse = await fetch(`/addAndModifyCompany`);
              if (!modResponse.ok)
                throw new Error("Error al cargar el formulario de modificación");
              const modHtml = await modResponse.text();

              const modDoc = new DOMParser().parseFromString(modHtml, "text/html");
              const modBody = modDoc.body.innerHTML;
              openModal(modBody);

              setTimeout(() => {
                const form = document.getElementById("company-form");
                if (!form) {
                  console.error("No se encontró el formulario de empresa en el modal");
                  return;
                }

                // Prellenar el formulario con la información de la empresa
                const idInput = document.getElementById("company-id");
                const nameInput = document.getElementById("company-name");
                const descInput = document.getElementById("company-description");
                const imgPreview = document.getElementById("company-profile-picture-preview");

                if (idInput) idInput.value = companyData.id || "";
                if (nameInput) nameInput.value = companyData.name || "";
                if (descInput) descInput.value = companyData.description || "";
                if (imgPreview && companyData.profile_picture) {
                  imgPreview.src = companyData.profile_picture;
                }

                // Al enviar el formulario se invoca la función en modo edición
                form.addEventListener("submit", (event) => {
                  event.preventDefault();
                  agregarEmpresa({ isEdit: true, originalId: companyData.id });
                });
              }, 200);
            } catch (modErr) {
              console.error("Error al modificar la empresa:", modErr);
              Swal.fire(
                  "Error",
                  modErr.message || "Ocurrió un error al cargar el formulario de modificación.",
                  "error"
              );
            }
          });
        }

        // Configurar el botón de ELIMINAR
        let deleteBtn = document.getElementById("delete-company-btn");
        if (deleteBtn) {
          // Reemplazar para remover listeners anteriores
          deleteBtn.replaceWith(deleteBtn.cloneNode(true));
          deleteBtn = document.getElementById("delete-company-btn");
          deleteBtn.addEventListener("click", async () => {
            Swal.fire({
              title: "¿Estás seguro?",
              text: "Esta acción eliminará la empresa permanentemente.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#8DC96A",
              confirmButtonText: "Sí, eliminar"
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  const users = companyData.users || [];
                  const idsToExclude = users.length > 0 ? [users[0].id] : [];

                  const delResponse = await fetch(`/delete_company?id=${id_company}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ exclude_user_ids: idsToExclude })
                  });

                  if (delResponse.ok) {
                    Swal.fire("Eliminado", "La empresa ha sido eliminada.", "success");
                    // Buscar y eliminar la fila correspondiente sin recargar la página
                    const rowToRemove = document.querySelector(`tr[data-company-id="${id_company}"]`);
                    if (rowToRemove) {
                      rowToRemove.remove();
                    }
                    closeModal();
                  } else {
                    // Intentar leer texto de error, pero si no hay contenido se usa un mensaje por defecto
                    const errorText = await delResponse.text();
                    throw new Error(errorText || "Error al eliminar la empresa");
                  }
                } catch (err) {
                  Swal.fire("Error", err.message || "Ocurrió un error al eliminar la empresa", "error");
                }
              }
            });
          });
        }
      }, 200);
    } catch (err) {
      console.error("Error al cargar el modal:", err);
      Swal.fire({
        icon: "error",
        title: "Error al cargar el modal",
        html: err.message || "Ocurrió un error inesperado.",
        timer: 2500,
        showConfirmButton: false
      });
    }
  });
}
