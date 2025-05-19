export const agregarEmpresa = async ({ isEdit = false, originalId = null } = {}) => {
    // 1) Read basic form values
    const name = document.getElementById("company-name")?.value.trim();
    const description = document.getElementById("company-description")?.value.trim();

    // 2) Validation: name and description are required
    if (!name) {
        return Swal.fire("Error", "Name is required.", "error");
    }
    if (!description) {
        return Swal.fire("Error", "Description is required.", "error");
    }

    // 3) Build the payload (including id in edit mode)
    const payload = isEdit
        ? { id: originalId, name, description }
        : { name, description };

    // 4) Select the correct URL and HTTP method (without id in query string)
    const url = isEdit ? `/modify_company` : "/add_company";
    const method = isEdit ? "PUT" : "POST";

    // 5) Send request to backend
    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: isEdit ? "Company modified" : "Company added",
                timer: 1500,
                showConfirmButton: false
            }).then(() => window.location.reload());
        } else {
            const msg = await res.text();
            Swal.fire("Error", msg, "error");
        }
    } catch (err) {
        Swal.fire("Unexpected error", err.message, "error");
    }
};
