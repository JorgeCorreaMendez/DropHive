export const agregarProducto = async () => {
    // 1. Leer y validar valores del formulario
    const product_id  = document.getElementById("product-id").value.trim();
    const name        = document.getElementById("product-name").value.trim();
    const description = document.getElementById("description").value.trim();
    const priceRaw    = document.getElementById("price").value;
    const discountRaw = document.getElementById("discount").value;
    const sizeName    = document.getElementById("new-size").value.trim();
    const quantityRaw = document.getElementById("new-quantity").value;
    const category_id = parseInt(
        document.getElementById("new-category").value,
        10
    );

    // Validaciones de cliente
    if (!product_id) {
        alert("🛑 Error: El campo Product ID está vacío.");
        return;
    }
    if (!name) {
        alert("🛑 Error: El campo Nombre del producto está vacío.");
        return;
    }
    const price = parseFloat(priceRaw);
    if (isNaN(price) || price < 0) {
        alert(`🛑 Error: Precio inválido (“${priceRaw}”). Debe ser un número positivo.`);
        return;
    }
    const discount = parseFloat(discountRaw);
    if (isNaN(discount) || discount < 0) {
        alert(`🛑 Error: Descuento inválido (“${discountRaw}”). Debe ser ≥ 0.`);
        return;
    }
    const quantity = parseInt(quantityRaw, 10);
    if (isNaN(quantity) || quantity < 0) {
        alert(`🛑 Error: Cantidad inválida (“${quantityRaw}”). Debe ser un entero ≥ 0.`);
        return;
    }
    if (isNaN(category_id)) {
        alert("🛑 Error: La categoría no es válida.");
        return;
    }
    if (!sizeName) {
        alert("🛑 Error: Debes indicar al menos un talle (size).");
        return;
    }

    // 2. Construir el payload
    const body = {
        id: product_id,
        name,
        description,
        price,
        discount,
        category_id,
        sizes: [{ name: sizeName, quantity }],
    };
    console.log("📤 Enviando payload:", body);

    // 3. Envío al servidor
    try {
        const response = await fetch("/add_product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        // 4. Manejo de la respuesta HTTP
        if (response.ok) {
            console.log("✅ Producto añadido correctamente");
            window.location.href = "/home";
        } else {
            let errorDetail;
            const ct = response.headers.get("Content-Type") || "";
            if (ct.includes("application/json")) {
                const errJson = await response.json();
                errorDetail = errJson.error || JSON.stringify(errJson);
            } else {
                errorDetail = await response.text();
            }
            console.error("🚨 Error del servidor:", errorDetail);
            alert(`❌ Error al añadir el producto:\n${errorDetail}`);
        }
    } catch (networkError) {
        console.error("🚧 Error de red o inesperado:", networkError);
        alert(`❌ Error de red o inesperado:\n${networkError.message || networkError}`);
    }
};

    document.addEventListener('change', e => {
          // Solo nos interesa cuando cambia un input de imagen
          if (!e.target.matches('.company-image-input')) return;

          const inputFile = e.target;
          const wrapper   = inputFile.closest('.image-upload-wrapper');
          if (!wrapper) return;

          const img = wrapper.querySelector('.image-container');
          const file = inputFile.files[0];
          if (!file) return;

          // Creamos una URL temporal y actualizamos el src
          const objectURL = URL.createObjectURL(file);
          img.src = objectURL;
          img.onload = () => URL.revokeObjectURL(objectURL);

          // Reiniciamos para permitir re-selección del mismo fichero
          inputFile.value = '';
    });



    // Asegúrate de que se ejecuta cuando el DOM está cargado
    document.addEventListener('DOMContentLoaded', () => {
        // Suponemos que el modalContent está definido de forma permanente en el HTML
        const modalContent = document.getElementById('modal-content');

        if (!modalContent) {
            console.error('Elemento modal-content no encontrado');
            return;
        }

        // Delegación de eventos en modalContent
        modalContent.addEventListener('click', (event) => {
            if (event.target && event.target.matches('#add-size-b')) {
                console.log('Botón pulsado (delegación)');
                // Aquí agregas la lógica para añadir inputs, por ejemplo:

                // Obtener los contenedores dentro del modal
                const divSizes = modalContent.querySelector('#div-sizes');
                const divQuantity = modalContent.querySelector('#div-quantity');

                if (!divSizes || !divQuantity) {
                    console.error('Contenedores en modal no encontrados');
                    return;
                }

                // Crear y añadir input para "Size"
                const wrapperSize = document.createElement('div');
                wrapperSize.classList.add('flex', 'items-center', 'gap-2', 'mt-2');

                const inputSize = document.createElement('input');
                inputSize.type = 'text';
                inputSize.placeholder = 'Ej: S, M, L';
                inputSize.classList.add(
                    'w-40', 'bg-gray-100', 'rounded-full', 'outline-none',
                    'px-2', 'py-1', 'text-sm', 'text-left'
                );

                wrapperSize.appendChild(inputSize);
                divSizes.appendChild(wrapperSize);

                // Crear y añadir input para "Quantity"
                const wrapperQuantity = document.createElement('div');
                wrapperQuantity.classList.add('flex', 'items-center', 'gap-2', 'mt-2');

                const inputQuantity = document.createElement('input');
                inputQuantity.type = 'text';
                inputQuantity.placeholder = 'Ej: 10';
                inputQuantity.classList.add(
                    'w-40', 'bg-gray-100', 'rounded-full', 'outline-none',
                    'px-2', 'py-1', 'text-sm'
                );

                wrapperQuantity.appendChild(inputQuantity);
                divQuantity.appendChild(wrapperQuantity);

                console.log('Nuevo input añadido en Size y Quantity');
            }
        });
    });

