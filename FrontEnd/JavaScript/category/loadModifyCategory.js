import {openModal} from "../modals/abrirYCerrarModal.js";
import {addOrModifyCategory} from "./addAndModifyCategory.js";

export async function loadModifyCategory(categoryData) {
    try {
        const response = await fetch(`/addAndModifyCategory`);
        if (!response.ok) return console.error("Failed to load modification form");
        const html = await response.text();
        openModal(html);
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
        }
        if (descInput) {
            descInput.value = categoryData.description || "";
        }
        const saveButton = document.getElementById("save-btn1");
        if (saveButton) {
            saveButton.onclick = async (event) => {
                event.preventDefault();
                await addOrModifyCategory({
                    isEdit: true,
                    originalId: categoryData.id,
                });
            };
        }
    } catch (modErr) {
        console.error("Error modifying category:", modErr);
    }
}