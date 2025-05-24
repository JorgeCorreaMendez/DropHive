export const addOrModifyCategory = async ({isEdit = false, originalId = null} = {}) => {
    const name = document.getElementById("category-name")?.value.trim();
    const description = document.getElementById("category-description")?.value.trim();
    const alertError = document.getElementById("alert-error");
    const successfulModal = document.getElementById("success-modal");

    if (!name) {
        return alertError.show("Name is required.", 2000);
    }
    const payload = isEdit
        ? {id: originalId, name, description}
        : {name, description};

    const url = isEdit ? `/modify_category` : "/add_category";
    const method = isEdit ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            successfulModal.show(isEdit ? "Category modified" : "Category created")
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            const msg = await res.json();
            alertError.show(msg.error, 2000);
        }
    } catch (err) {
        alertError.show(err.message, 2000);
    }
};