export const addCompany = async ({isEdit = false, originalId = null} = {}) => {
    const alertError = document.getElementById("alert-error");
    const successfulModal = document.getElementById("success-modal");
    const name = document.getElementById("company-name")?.value.trim();
    const description = document.getElementById("company-description")?.value.trim();
    if (!name) {
        return alertError.show("Name is required.", 2000);
    }
    const url = isEdit ? `/modify_company` : "/add_company";
    const method = isEdit ? "PUT" : "POST";
    const payload = isEdit
        ? {id: originalId, name, description}
        : {name, description};
    try {
        const res = await fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            successfulModal.show(isEdit ? "Company modified" : "Company added", "success");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            const msg = await res.text();
            alertError.show(msg, 2000);
        }
    } catch (err) {
        alertError.show(err.message || "Unexpected error", 2000);
    }
};
