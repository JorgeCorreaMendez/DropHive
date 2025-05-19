// AddAndModifyCategory.js

export const agregarCategoria = async ({ isEdit = false, originalId = null } = {}) => {
    // 1) Leer los valores básicos del formulario
    const name = document.getElementById("category-name")?.value.trim();
    const description = document.getElementById("category-description")?.value.trim();

    // 2) Validación: El nombre y la descripción son obligatorios
    if (!name) {
        return Swal.fire("Error", "Name is required.", "error");
    }
    if (!description) {
        return Swal.fire("Error", "Description is required.", "error");
    }

    // 3) Construir el payload (incluyendo id en modo edición)
    const payload = isEdit
        ? { id: originalId, name, description }
        : { name, description };

    // 4) Definir la URL y el método HTTP según corresponda
    const url = isEdit ? `/modify_category` : "/add_category";
    const method = isEdit ? "PUT" : "POST";

    // 5) Enviar la solicitud al backend
    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        // Si se recibe respuesta exitosa
        if (res.ok) {
            console.log("Respuesta correcta recibida (isEdit:", isEdit, ")");
            Swal.fire({
                icon: "success",
                title: isEdit ? "Category modified" : "Category created",
                timer: 2500,
                showConfirmButton: false
            }).then(() => {
                // Retardo adicional de 300ms para asegurarnos que se vea el mensaje
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            });
        } else {
            const msg = await res.text();
            Swal.fire("Error", msg, "error");
        }
    } catch (err) {
        Swal.fire("Unexpected error", err.message, "error");
    }
};

// Asegúrate de que SOLO se registre AQUÍ el listener para el botón "save-btn1"
// (Elimina otros listeners delegados o directos que se hayan registrado en otros templates)
document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save-btn1");
    if (saveButton) {
        saveButton.addEventListener("click", async (e) => {
            e.preventDefault();
            // Aquí se llama a la función sin parámetros, usando los valores por defecto (isEdit: false)
            // Es decir, en el contexto de creación el campo oculto "category-id" debe estar vacío o ausente.
            console.log("Listener de save-btn1 activado.");
            await agregarCategoria({ isEdit: false });
        });
    } else {
        console.warn("Button not found");
    }
});
