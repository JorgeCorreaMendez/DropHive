import {openModal} from "../modals/abrirYCerrarModal.js";
import {addCompany} from "./AddAndModifyCompany.js";

export async function loadModifyCompany(companyData) {
    try {
        const modResponse = await fetch(`/addAndModifyCompany`);
        if (!modResponse.ok) return console.error("Failed to load modification form");
        const modHtml = await modResponse.text();
        openModal(modHtml);
        setTimeout(() => {
            const form = document.getElementById("company-form");
            if (!form) return console.error("company form not found in modal");
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
                addCompany({isEdit: true, originalId: companyData.id});
            });
        }, 200);
    } catch (modErr) {
        console.error("Error modifying company:", modErr);
    }
}