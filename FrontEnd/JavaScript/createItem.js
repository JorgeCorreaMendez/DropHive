document.addEventListener("DOMContentLoaded", () => {
    // Listener para el botón de guardar cambios (crear producto)
    const saveBtn = document.querySelector(".save-btn");
    saveBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // Recoger datos de los campos del formulario
        const productId = document.getElementById("product-id").value.trim();
        const name = productId;
        const description = document.getElementById("description").value.trim();
        const information = document.getElementById("information").value.trim();
        // Concatenamos descripción e información en un solo campo (opcional)
        const fullDescription = description + "\n" + information;
        const price = parseFloat(document.getElementById("price").value) || 0.0;
        const discount = parseFloat(document.getElementById("discount").value) || 0.0;
        const size = document.getElementById("size").value.trim();
        const quantity = 1;
        const category_id = 1;

        // Construir objeto con los datos del producto
        const productData = {
            product_id: productId,
            name: name,
            description: fullDescription,
            price: price,
            discount: discount,
            size: size,
            quantity: quantity,
            category_id: category_id
        };

        try {
           //Conexion con la base de datos
            const dbName = "{{ db_name }}";
            const response = await fetch(`/${dbName}/add_product`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message || "Producto creado correctamente");
                // Redirigir al listado de productos o limpiar el formulario
                window.location.href = `/${dbName}/products`;
            } else {
                const error = await response.json();
                alert("Error: " + (error.error || "Error al crear el producto"));
            }
        } catch (err) {
            console.error("Error al crear producto:", err);
            alert("Error al enviar la solicitud de creación.");
        }
    });
});
