
    export const agregarProducto = async () => {
        const product_id = document.getElementById("product-id").value;
        const name = document.getElementById("product-name").value;
        const description = document.getElementById("description").value;
        const price = parseFloat(document.getElementById("price").value);
        const sizeName = document.getElementById("new-size").value;
        const discount = parseFloat(document.getElementById("discount").value);
        const quantity = parseInt(document.getElementById("new-quantity").value, 10);
        const category_id = parseInt(
            document.getElementById("new-category").value,
            10
        );

        try {
            // Recuperar el nombre de la base de datos


            // Hacer la solicitud POST a la ruta dinámica
            const response = await fetch(`/add_product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id,
                    name,
                    description,
                    price,
                    discount,
                    category_id,
                    sizes: [
                        { name: sizeName, quantity }
                    ]
                }),
            });

            // Verificar si la respuesta es correcta
            if (response.ok) {
                console.log("Producto añadido correctamente");
                window.location.href = `/home`;  // Asegurarse de que usamos db_name
            } else {
                const errorMessage = await response.text(); // Obtener mensaje de error del servidor
                console.error("Error en la respuesta del servidor:", errorMessage);
                alert(`Error al añadir el producto: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            alert("Ocurrió un error inesperado. Ver consola para detalles.");
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

