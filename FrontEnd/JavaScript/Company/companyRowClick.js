import { openModal, closeModal } from "../modals/abrirYCerrarModal.js";
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

export async function mostrarReadCompany(id_company) {
  let response = await fetch(`get_company?id=${id_company}`);
      const companyData = await response.json();

      response = await fetch(`readCompany`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);

      setTimeout(() => {
        // Mostrar nombre y descripción
        const nameEl = document.getElementById("company-name");
        const descEl = document.getElementById("company-description");

        if (nameEl) nameEl.textContent = companyData.name || '';
        if (descEl) descEl.innerHTML = (companyData.description || '').replace(/\n/g, '<br>');

        // Botón MODIFICAR
        const modifyBtn = document.getElementById("modify-company-btn");
        if (modifyBtn) {
          modifyBtn.addEventListener("click", async () => {
            const modResponse = await fetch(`/addAndModifyCompany`);
            const modHtml = await modResponse.text();

            const doc = new DOMParser().parseFromString(modHtml, "text/html");
            const modBody = doc.body.innerHTML;

            openModal(modBody);

            setTimeout(() => {
              const form = document.getElementById("company-form");
              if (!form) return;

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

              form.addEventListener("submit", (event) => {
                event.preventDefault();
                agregarCompañia(event);
              });
            }, 100);
          });
        }

        // Botón ELIMINAR
        const deleteBtn = document.getElementById("delete-company-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", async () => {
            Swal.fire({
              title: '¿Estás seguro?',
              text: "Esta acción eliminará la empresa permanentemente.",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#8DC96A',
              confirmButtonText: 'Sí, eliminar'
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  const users = companyData.users || [];
                  const idsToExclude = users.length > 0 ? [users[0].id] : [];

                  const response = await fetch(`/delete_company?id=${id_company}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ exclude_user_ids: idsToExclude })
                  });

                  if (response.status === 204) {
                    Swal.fire('Eliminado', 'La empresa ha sido eliminada.', 'success');
                    closeModal();
                    location.reload();
                  } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error al eliminar la empresa");
                  }
                } catch (err) {
                  Swal.fire('Error', err.message || 'Ocurrió un error al eliminar la empresa', 'error');
                }
              }
            });
          });
        }
      }, 100);
}