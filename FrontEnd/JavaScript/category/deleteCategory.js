

export function deleteCategory(categoryId) {
    if (!categoryId) return;
    const alertError = document.getElementById("alert-error");
    const successfulModal = document.getElementById("success-modal");
    const modal = document.getElementById("confirmation-modal");
    modal.show("Are you sure you want to delete this category?")
        .then(async () => {
            try {
                const delResponse = await fetch(`/delete_category?id=${categoryId}`, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"}
                });
                if (delResponse.ok) {
                    successfulModal.show("Category deleted");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    const errorText = await delResponse.text();
                    alertError.show(errorText || "Failed to delete the category", 2500);
                }
            } catch (err) {
                alertError.show(err.message || "An error occurred while deleting the category", 2500);
            }
        });
}