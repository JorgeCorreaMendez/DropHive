export const agregarEmpresa = async ({ isEdit = false, originalId = null } = {}) => {
    // 1) Leer los valores básicos del formulario
    const name = document.getElementById("company-name")?.value.trim();
    const description = document.getElementById("company-description")?.value.trim();

    // 2) Validación: se requiere el nombre y la descripción
    if (!name) {
        return Swal.fire("Error", "El nombre es obligatorio.", "error");
    }
    if (!description) {
        return Swal.fire("Error", "La descripcion es obligatoria.", "error");
    }

    // 3) Construir el payload (incluyendo el id en modo edición)
    const payload = isEdit
        ? { id: originalId, name, description }
        : { name, description };

    // 4) Seleccionar URL y método HTTP según corresponda (sin el id en el query string)
    const url = isEdit ? `/modify_company` : "/add_company";
    const method = isEdit ? "PUT" : "POST";

    // 5) Enviar la solicitud al backend
    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: isEdit ? "Empresa modificada" : "Empresa agregada",
                timer: 1500,
                showConfirmButton: false
            }).then(() => window.location.reload());
        } else {
            const msg = await res.text();
            Swal.fire("Error", msg, "error");
        }
    } catch (err) {
        Swal.fire("Error inesperado", err.message, "error");
    }
};
