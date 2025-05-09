import {openModal} from "../modals/abrirYCerrarModal.js";
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

      response = await fetch(`readCategory`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);
      await cargarDatosCategoria(object);
      setTimeout(async () => {
        /// TODO.
        const deleteBtn = document.getElementById("btnDeleteCategory");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", () => {
            const categoryId = document.getElementById("categoria-id")?.textContent.trim();
            if (!categoryId) return;
            if (confirm("¿Estás seguro de que deseas borrar esta categoría?")) {
              fetch(`/delete_category?id=${categoryId}`, {method: "DELETE"})
                  .then(res => {
                    if (res.ok) {
                      alert("Categoría eliminada.");
                      window.location.href = "/home";
                    } else {
                      alert("Error al borrar.");
                    }
                  });
            }
          });
          const modifyBtn = document.getElementById("btnModifyCategory");
          if(modifyBtn){
            modifyBtn.addEventListener("click", async () => {
              response = await fetch(`/addAndModifyCategory`);
              const html = await response.text();

              const parser = new DOMParser();
              const doc = parser.parseFromString(html, "text/html");
              const bodyContent = doc.body.innerHTML;
              openModal(bodyContent);
              setTimeout(() => {
                const modalForm = document.getElementById("category-form");
                if (!modalForm) return;

                const nameInput = modalForm.querySelector("#category-name");
                const descInput = modalForm.querySelector("#category-description");

                if (nameInput) {
                  nameInput.value = object.name;
                  nameInput.disabled = true;
                }
                if (descInput) descInput.value = object.description;

                const form = document.getElementById("category-form");
                if (form) {
                  form.addEventListener("submit", (event) => {
                    event.preventDefault();

                    const description = descInput?.value.trim();
                    if (!description) {
                      alert("La descripción no puede estar vacía.");
                      return;
                    }

                    fetch("/modify_category", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: object.id,
                        name: object.name,
                        description: description
                      })
                    })
                    .then(res => {
                      if (res.ok) {
                        window.location.href = "/home";
                      } else {
                        alert("Error al modificar la categoría.");
                      }
                    });
                  });
                }
              }, 100);
            })
          }
        }

      }, 50);
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
