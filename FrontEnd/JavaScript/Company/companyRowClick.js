import { openModal, closeModal } from "../modals/abrirYCerrarModal.js";
import { agregarEmpresa } from "./AddAndModifyCompany.js";

export function initializeRowClickHandlerCompany() {
  const tableBody = document.getElementById("table-body");
  if (!tableBody) {
    console.error("Could not find tbody with ID table-body");
    return;
  }

  tableBody.addEventListener("click", async (event) => {
    const clickedRow = event.target.closest("tr[data-company-id]");
    if (!clickedRow) return;

    const id_company = clickedRow.getAttribute("data-company-id");
    if (!id_company) return;

    try {
      // Fetch company data from the backend
      let response = await fetch(`get_company?id=${id_company}`);
      if (!response.ok) throw new Error("Failed to fetch company data");
      const companyData = await response.json();

      // Load the read-only company view
      response = await fetch(`readCompany`);
      if (!response.ok) throw new Error("Failed to load company view");
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      // Open modal with the read-only view
      openModal(bodyContent);

      // Wait for the modal to render
      setTimeout(() => {
        // Populate modal fields (read-only)
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

        // Configure the MODIFY button
        let modifyBtn = document.getElementById("modify-company-btn");
        if (modifyBtn) {
          modifyBtn.replaceWith(modifyBtn.cloneNode(true));
          modifyBtn = document.getElementById("modify-company-btn");
          modifyBtn.addEventListener("click", async () => {
            try {
              const modResponse = await fetch(`/addAndModifyCompany`);
              if (!modResponse.ok)
                throw new Error("Failed to load modification form");
              const modHtml = await modResponse.text();

              const modDoc = new DOMParser().parseFromString(modHtml, "text/html");
              const modBody = modDoc.body.innerHTML;
              openModal(modBody);

              setTimeout(() => {
                const form = document.getElementById("company-form");
                if (!form) {
                  console.error("Company form not found in modal");
                  return;
                }

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
                  agregarEmpresa({ isEdit: true, originalId: companyData.id });
                });
              }, 200);
            } catch (modErr) {
              console.error("Error modifying company:", modErr);
              Swal.fire(
                "Error",
                modErr.message || "An error occurred while loading the modification form.",
                "error"
              );
            }
          });
        }

        // Configure the DELETE button
        let deleteBtn = document.getElementById("delete-company-btn");
        if (deleteBtn) {
          deleteBtn.replaceWith(deleteBtn.cloneNode(true));
          deleteBtn = document.getElementById("delete-company-btn");
          deleteBtn.addEventListener("click", async () => {
            Swal.fire({
              title: "Are you sure?",
              text: "This action will permanently delete the company.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#8DC96A",
              confirmButtonText: "Yes, delete it"
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
                    Swal.fire("Deleted", "The company has been deleted.", "success");
                    const rowToRemove = document.querySelector(`tr[data-company-id="${id_company}"]`);
                    if (rowToRemove) {
                      rowToRemove.remove();
                    }
                    closeModal();
                  } else {
                    const errorText = await delResponse.text();
                    throw new Error(errorText || "Failed to delete the company");
                  }
                } catch (err) {
                  Swal.fire("Error", err.message || "An error occurred while deleting the company", "error");
                }
              }
            });
          });
        }
      }, 200);
    } catch (err) {
      console.error("Error loading modal:", err);
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
