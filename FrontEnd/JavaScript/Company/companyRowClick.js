import {openModal} from "../modals/abrirYCerrarModal.js";
import {loadModifyCompany} from "./loadModifyCompany.js";
import {deleteCompany} from "./deleteCompany.js";

export function initializeRowClickHandlerCompany() {
    const tableBody = document.getElementById("table-body");
    if (!tableBody) return;
    tableBody.addEventListener("click", async (event) => {
        const clickedRow = event.target.closest("tr[data-company-id]");
        if (!clickedRow) return console.error("Failed to get clicked row")
        const id_company = clickedRow.getAttribute("data-company-id");
        if (!id_company) return;
        try {
            let response = await fetch(`get_company?id=${id_company}`);
            if (!response.ok) return console.error("Failed to fetch company data");
            const companyData = await response.json();
            response = await fetch(`readCompany`);
            if (!response.ok) return console.error("Failed to load company view");
            const html = await response.text();
            openModal(html);
            setTimeout(() => {
                const nameEl = document.getElementById("company-name");
                const descEl = document.getElementById("company-description");
                if (nameEl) nameEl.textContent = companyData.name || "";
                if (descEl) {
                    if (descEl.tagName === "INPUT" || descEl.tagName === "TEXTAREA") {
                        descEl.value = companyData.description || "";
                    } else {
                        descEl.innerHTML = (companyData.description || "").replace(/\n/g, "<br>");
                    }
                }

                let modifyBtn = document.getElementById("modify-company-btn");
                if (modifyBtn) {
                    modifyBtn.replaceWith(modifyBtn.cloneNode(true));
                    modifyBtn = document.getElementById("modify-company-btn");
                    modifyBtn.addEventListener("click", async () => {
                        return await loadModifyCompany(companyData);
                    });
                }
                let deleteBtn = document.getElementById("delete-company-btn");
                if (deleteBtn) {
                    deleteBtn.replaceWith(deleteBtn.cloneNode(true));
                    deleteBtn = document.getElementById("delete-company-btn");
                    deleteBtn.addEventListener("click", async () => {
                        deleteCompany(id_company);
                    });
                }
            }, 200);
        } catch (err) {
            console.error(err.message || "An unexpected error occurred.")
        }
    });
}
