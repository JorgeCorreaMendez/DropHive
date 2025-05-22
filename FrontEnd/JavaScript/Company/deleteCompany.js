import {closeModal} from "../modals/abrirYCerrarModal.js";

export function deleteCompany(id_company) {
    const alertError = document.getElementById("alert-error");
    const successfulModal = document.getElementById("success-modal");
    const confirmation = document.getElementById("confirmation-modal");
    confirmation.show("Are you sure you want to delete this company?")
        .then(async () => {
            try {
                const delResponse = await fetch(`/delete_company?id=${id_company}`, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                });

                if (delResponse.ok) {
                    successfulModal.show("The company has been deleted");
                    const rowToRemove = document.querySelector(`tr[data-company-id="${id_company}"]`);
                    if (rowToRemove) {
                        rowToRemove.remove();
                    }
                    setTimeout(() => {
                        successfulModal.hide();
                        closeModal();
                    }, 1500);
                } else {
                    const errorText = await delResponse.text();
                    alertError.show(errorText || "Failed to delete the company");
                }
            } catch (err) {
                alertError.show(err.message || "An error occurred while deleting the company");
            }
        });
}