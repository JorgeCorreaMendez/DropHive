import {openModal} from "../modals/abrirYCerrarModal.js";

export function initializeRowClickHandlerCompany() {
  const tableBody = document.getElementById("table-body");

  if (!tableBody) {
    console.error("No se encontró el tbody con ID table-body");
    return;
  }

  tableBody.addEventListener("click", async (event) => {
    const clickedRow = event.target.closest("tr[data-company-id]");
    if (!clickedRow) return;


    const id_company= clickedRow.getAttribute("data-company-id");
    console.log("Se ha clicado", id_company)

    if (!id_company) return;

    try {
      let response = await fetch(`get_company?id=${id_company}`);
      const object = await response.json();

      console.log(object)

      response = await fetch(`readCompany`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);
      const modifyBtn = document.getElementById("btnModifyCompany");
      if(modifyBtn){
        modifyBtn.addEventListener("click", async () => {
          response = await fetch(`/modifyCompany`);
          const html = await response.text();

          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const bodyContent = doc.body.innerHTML;
          openModal(bodyContent);
          setTimeout(() => {
            const modalForm = document.getElementById("company-form");
            if (!modalForm) return;

            const nameInput = modalForm.querySelector("#company-name");
            const descInput = modalForm.querySelector("#comapny-description");

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
