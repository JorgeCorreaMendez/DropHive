// categoryModalHandler.js

import { openModal, closeModal } from "../modals/abrirYCerrarModal.js";
import { cargarDatosCategoria } from "./cargarDatosArticulo.js";
import { agregarCategoria } from "./AddAndModifyCategory.js";

export function initializeRowClickHandlerCategory() {
  const tableBody = document.getElementById("table-body");
  if (!tableBody) {
    console.error("The tbody with ID table-body was not found");
    return;
  }

  tableBody.addEventListener("click", async (event) => {
    const clickedRow = event.target.closest("tr[data-category-id]");
    if (!clickedRow) return;

    const id_category = clickedRow.getAttribute("data-category-id");
    if (!id_category) return;

    try {
      // 1) Obtener datos de la categoría desde el backend
      let response = await fetch(`search_category_by_id?id=${id_category}`);
      if (!response.ok) throw new Error("Failed to fetch category data");
      const categoryData = await response.json();

      // 2) Cargar la vista del modal (por ejemplo, "readCategory")
      response = await fetch(`readCategory`);
      if (!response.ok) throw new Error("Failed to load category view");
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;
      openModal(bodyContent);

      // 3) Rellenar el modal con los datos de la categoría
      await cargarDatosCategoria(categoryData);

      // 4) Configurar los botones dentro del modal tras renderizar el contenido
      setTimeout(async () => {
        // Botón de ELIMINAR
        let deleteBtn = document.getElementById("btnDeleteCategory");
        if (deleteBtn) {
          deleteBtn.replaceWith(deleteBtn.cloneNode(true));
          deleteBtn = document.getElementById("btnDeleteCategory");
          deleteBtn.addEventListener("click", async () => {
            const categoryId = document.getElementById("categoria-id")?.textContent.trim();
            if (!categoryId) return;
            Swal.fire({
              title: "Are you sure?",
              text: "This action will permanently delete this category.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#8DC96A",
              confirmButtonText: "Yes, delete it"
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  const delResponse = await fetch(`/delete_category?id=${categoryId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                  });
                  if (delResponse.ok) {
                    Swal.fire({
                      icon: "success",
                      title: "Category deleted",
                      timer: 1500,
                      showConfirmButton: false
                    });
                    const rowToRemove = document.querySelector(`tr[data-category-id="${categoryId}"]`);
                    if (rowToRemove) rowToRemove.remove();
                    closeModal();
                  } else {
                    const errorText = await delResponse.text();
                    throw new Error(errorText || "Failed to delete the category");
                  }
                } catch (err) {
                  Swal.fire("Error", err.message || "An error occurred while deleting the category", "error");
                }
              }
            });
          });
        }

        // Botón de MODIFICAR
        let modifyBtn = document.getElementById("btnModifyCategory");
        if (modifyBtn) {
          modifyBtn.replaceWith(modifyBtn.cloneNode(true));
          modifyBtn = document.getElementById("btnModifyCategory");
          modifyBtn.addEventListener("click", async () => {
            try {
              // Cargar el formulario de modificación
              response = await fetch(`/addAndModifyCategory`);
              if (!response.ok) throw new Error("Failed to load modification form");
              const modHtml = await response.text();
              const modParser = new DOMParser();
              const modDoc = modParser.parseFromString(modHtml, "text/html");
              const modBody = modDoc.body.innerHTML;
              openModal(modBody);
              setTimeout(() => {
                const modalForm = document.getElementById("category-form");
                if (!modalForm) {
                  console.error("Category form not found in modal");
                  return;
                }
                const idInput = document.getElementById("category-id");
                const nameInput = document.getElementById("category-name");
                const descInput = document.getElementById("category-description");

                if (idInput) idInput.value = categoryData.id || "";
                if (nameInput) {
                  nameInput.value = categoryData.name || "";
                  // Permitir editar el nombre, por lo que se elimina la línea "nameInput.disabled = true"
                }
                if (descInput) {
                  descInput.value = categoryData.description || "";
                }

                // Usamos { once: true } para evitar múltiples registros del listener
                modalForm.addEventListener("submit", (event) => {
                  event.preventDefault();
                  const newName = nameInput?.value.trim();
                  const newDescription = descInput?.value.trim();
                  if (!newName) {
                    return Swal.fire({
                      icon: "error",
                      title: "Field required",
                      text: "Name cannot be empty.",
                      confirmButtonColor: "#d33"
                    });
                  }
                  if (!newDescription) {
                    return Swal.fire({
                      icon: "error",
                      title: "Field required",
                      text: "Description cannot be empty.",
                      confirmButtonColor: "#d33"
                    });
                  }
                  // Llamar a la función agregando el modo de edición, incluyendo nombre y descripción modificados
                  agregarCategoria({ isEdit: true, originalId: categoryData.id });
                }, { once: true });
              }, 100);
            } catch (modErr) {
              console.error("Error modifying category:", modErr);
              Swal.fire("Error", modErr.message || "An error occurred while loading the modification form.", "error");
            }
          });
        }
      }, 50);
    } catch (err) {
      console.error("Error while loading modal:", err);
      Swal.fire({
        icon: "error",
        title: "Error loading modal",
        html: err.message || "An unexpected error occurred.",
        timer: 2500,
        showConfirmButton: false
      });
    }
  });
}
