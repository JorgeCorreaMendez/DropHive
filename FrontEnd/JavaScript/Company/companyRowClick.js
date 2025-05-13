import {closeModal, openModal} from "../modals/abrirYCerrarModal.js";

function rellenarModalConDatos(company) {
  document.getElementById("company-name").textContent = company.name || '';
  document.getElementById("company-description").innerHTML = (company.description || '').replace(/\n/g, '<br>');
}

let currentCompanyId = null;
let deleteHandlerAttached = false;

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
    currentCompanyId = id_company;
    console.log("Se ha clicado", id_company);

    if (!id_company) return;

    try {
      let response = await fetch(`get_company?id=${id_company}`);
      const object = await response.json();

      response = await fetch(`readCompany`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);

      setTimeout(() => {
        rellenarModalConDatos(object);
      }, 0);

      if (!deleteHandlerAttached) {
        document.addEventListener("click", async (event) => {
          if (event.target && event.target.id === "delete-company-btn") {
            Swal.fire({
              title: 'Are you sure?',
              text: "This will delete the company permanently.",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#8DC96A',
              confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
              if (result.isConfirmed) {
  try {
    const users = object.users || [];
    const idsToExclude = users.length > 0 ? [users[0].id] : [];

    // Cambié el método de POST a DELETE y pasé el ID en la URL
    const response = await fetch(`/delete_company?id=${currentCompanyId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exclude_user_ids: idsToExclude
      })
    });

    if (response.status === 204) {
      Swal.fire('Deleted!', 'The company has been deleted.', 'success');
      closeModal();
      location.reload();
    } else {
      const resultData = await response.json();
      throw new Error(resultData.message || "Error eliminando la empresa");
    }
  } catch (err) {
    Swal.fire('Error', err.message || 'Something went wrong.', 'error');
  }
}

            });
          }
        });

        deleteHandlerAttached = true;
      }

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
