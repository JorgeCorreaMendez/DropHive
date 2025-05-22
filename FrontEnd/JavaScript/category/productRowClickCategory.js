import {openModal} from "../modals/abrirYCerrarModal.js";
import {cargarDatosCategoria} from "./cargarDatosArticulo.js";
import {deleteCategory} from "./deleteCategory.js";
import {loadModifyCategory} from "./loadModifyCategory.js";

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
            let response = await fetch(`search_category_by_id?id=${id_category}`);
            if (!response.ok) return console.error("Failed to fetch category data");
            const categoryData = await response.json();
            response = await fetch(`readCategory`);
            if (!response.ok) return console.error("Failed to load category view");
            const html = await response.text();
            openModal(html);
            await cargarDatosCategoria(categoryData);
            setTimeout(async () => {
                const categoryId = document.getElementById("categoria-id")?.textContent.trim();
                let deleteBtn = document.getElementById("btnDeleteCategory");
                if (deleteBtn) {
                    deleteBtn.addEventListener("click", async () => {
                        deleteCategory(categoryId);
                    });
                }
                let modifyBtn = document.getElementById("btnModifyCategory");
                if (modifyBtn) {
                    modifyBtn.replaceWith(modifyBtn.cloneNode(true));
                    modifyBtn = document.getElementById("btnModifyCategory");
                    modifyBtn.addEventListener("click", async () => {
                        await loadModifyCategory(categoryData);
                    });
                }
            }, 50);
        } catch (err) {
            console.error("Error while loading modal:", err);
        }
    });
}
