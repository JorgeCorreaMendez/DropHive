// ========================================================================
// Helper para obtener el valor de un elemento por su id
const getInputValue = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : "";
};

// ========================================================================
// Función para agregar un producto
export const agregarProducto = async () => {
    // Leer campos estáticos
    const id  = getInputValue("product-id").trim();
    const name        = getInputValue("product-name").trim();
    const description = getInputValue("description").trim();
    const priceRaw    = getInputValue("price").trim();
    const discountRaw = getInputValue("discount").trim();

    // Validaciones básicas
    if (!id) {
        return Swal.fire({ icon: 'error', title: 'Error', text: 'El ID es obligatorio.' });
    }
    if (!name) {
        return Swal.fire({ icon: 'error', title: 'Error', text: 'El nombre del producto es obligatorio.' });
    }
    if (priceRaw === '') {
        return Swal.fire({ icon: 'error', title: 'Error', text: 'El precio es obligatorio.' });
    }
    const price    = parseFloat(priceRaw);
    const discount = parseFloat(discountRaw) || 0;
    if (isNaN(price) || price < 0) {
        return Swal.fire({ icon: 'error', title: 'Error', text: 'El precio debe ser un número positivo.' });
    }
    if (isNaN(discount) || discount < 0) {
        return Swal.fire({ icon: 'error', title: 'Error', text: 'El descuento debe ser un número positivo.' });
    }

    // Leer categoría
    const categoryEl = document.getElementById("primary-category");
    const category   = categoryEl ? { name: categoryEl.value.trim() } : { name: '' };

    // 1) Primer tamaño/cantidad
    const initialSize = getInputValue("new-size").trim();
    const initialQty  = parseInt(getInputValue("new-quantity"), 10);

    if (initialSize && (isNaN(initialQty) || initialQty < 0)) {
        return Swal.fire({ icon: 'error', title: 'Error', text: 'La cantidad inicial no es válida.' });
    }

    // 2) Inputs dinámicos
    const sizeInputs = Array.from(document.querySelectorAll("input[name='newSize[]']"));
    const qtyInputs  = Array.from(document.querySelectorAll("input[name='newQuantity[]']"));

    // 3) Construir array de tallas
    const sizes = [];
    if (initialSize) {
        sizes.push({ name: initialSize, quantity: initialQty || 0 });
    }
    sizeInputs.forEach((input, i) => {
        const name = input.value.trim();
        const qty  = parseInt(qtyInputs[i].value, 10);
        if (name && (!isNaN(qty) && qty >= 0)) {
            sizes.push({ name, quantity: qty });
        } else if (name) {
            // Nombre sí, pero cantidad inválida
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Cantidad no válida para la talla "${name}".`
            });
        }
    });

    try {
        const response = await fetch("/add_product", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ id, name, description, price, discount, category, sizes })
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Producto añadido correctamente.',
                confirmButtonText: 'Ir al inicio'
            }).then(() => {
                window.location.href = "/home";
            });
        } else {
            const msg = await response.text();
            console.error("Error servidor:", msg);
            Swal.fire({
                icon: 'error',
                title: 'Error al añadir',
                text: `Servidor respondió: ${msg}`
            });
        }
    } catch (err) {
        console.error("Error envío datos:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'No se pudo conectar con el servidor. Revisa tu conexión.'
        });
    }
};

// ========================================================================
// Manejador para actualizar la imagen cuando se seleccione un nuevo archivo
const handleImageInputChange = (e) => {
    if (!e.target.matches(".company-image-input")) return;

    const inputFile = e.target;
    const wrapper = inputFile.closest(".image-upload-wrapper");
    if (!wrapper) return;

    const img = wrapper.querySelector(".image-container");
    const file = inputFile.files[0];
    if (!file) return;

    // Creamos y asignamos una URL temporal para mostrar la imagen
    const objectURL = URL.createObjectURL(file);
    img.src = objectURL;
    img.onload = () => URL.revokeObjectURL(objectURL);
    inputFile.value = "";
};

document.addEventListener("change", handleImageInputChange);

// ========================================================================
// Función para cargar las categorías en el desplegable
export async function loadCategories() {
    const select = document.getElementById("primary-category");
    if (!select) {
        console.error('No se encontró el elemento con id "primary-category" en el DOM.');
        return;
    }

    // Se reinicia el contenido del select y se agrega el placeholder
    select.innerHTML = `<option value="" disabled selected>Selecciona una categoría</option>`;
    console.log("Select encontrado, placeholder agregado.");

    try {
        const res = await fetch("/categories");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const cats = await res.json();
        console.log("Datos recibidos del endpoint /categories:", cats);

        if (!Array.isArray(cats) || cats.length === 0) {
            console.warn("No se encontraron categorías en la respuesta.");
        }

        cats.forEach((cat) => {
            if (!cat.name) {
                console.warn("La categoría no tiene propiedad 'name':", cat);
                // Si lo prefieres, puedes asignar un valor predeterminado en lugar de omitirla:
                // cat.name = "Categoría sin nombre";
                return;
            }
            const opt = document.createElement("option");
            opt.value = cat.name; // O usa cat.id según necesites
            opt.textContent = cat.name;
            select.append(opt);
        });
        console.log("Categorías agregadas al desplegable.");
    } catch (e) {
        console.error("No se pudieron cargar las categorías:", e);
    }
}

// ========================================================================
// Delegado para manejar el clic en el botón de añadir inputs para Size y Quantity
function handleModalDelegatedClick(event) {
    if (event.target && event.target.matches("#add-size-b")) {
        console.log("Botón pulsado para añadir inputs de Size y Quantity");

        const modalContent = document.getElementById("modal-content");
        if (!modalContent) {
            console.error("Elemento con id 'modal-content' no encontrado.");
            return;
        }

        const divSizes = modalContent.querySelector("#div-sizes");
        const divQuantity = modalContent.querySelector("#div-quantity");
        if (!divSizes || !divQuantity) {
            console.error("Contenedores de tallas o cantidades no encontrados.");
            return;
        }

        // Crear input de Size dinámico
        const wrapperSize = document.createElement("div");
        wrapperSize.classList.add("flex", "items-center", "gap-2", "mt-2");
        const inputSize = document.createElement("input");
        inputSize.type = "text";
        inputSize.name = "newSize[]";
        inputSize.placeholder = "Ej: S, M, L";
        inputSize.classList.add(
            "w-40",               // mismo ancho
            "bg-gray-100",
            "rounded-full",
            "outline-none",
            "px-2",
            "py-1",
            "text-sm"
        );
        wrapperSize.appendChild(inputSize);
        divSizes.appendChild(wrapperSize);

        // Crear input de Quantity dinámico
        const wrapperQuantity = document.createElement("div");
        wrapperQuantity.classList.add("flex", "items-center", "gap-2", "mt-2");
        const inputQuantity = document.createElement("input");
        inputQuantity.type = "number";
        inputQuantity.name = "newQuantity[]";
        inputQuantity.placeholder = "Ej: 10";
        inputQuantity.min = "0";
        inputQuantity.classList.add(
            "w-40",               // aquí igualamos el ancho
            "bg-gray-100",
            "rounded-full",
            "outline-none",
            "px-2",
            "py-1",
            "text-sm"
        );
        wrapperQuantity.appendChild(inputQuantity);
        divQuantity.appendChild(wrapperQuantity);

        console.log("Nuevos inputs añadidos para tallas y cantidades");
    }
}

// ========================================================================
// Document Ready: Configuración de eventos cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    // Si el formulario de creación se muestra de forma estática, se cargan las categorías
    const select = document.getElementById("primary-category");
    if (select) {
        console.log("Formulario de creación detectado, cargando categorías...");
        loadCategories();
    } else {
        console.warn("El select 'primary-category' no se encontró en el DOM. Verifica la vista o si el formulario se carga dinámicamente.");
    }

    // Delegar el evento de clic para añadir inputs en el contenido del modal
    const modalContent = document.getElementById("modal-content");
    if (modalContent) {
        modalContent.addEventListener("click", handleModalDelegatedClick);
    } else {
        console.warn('Elemento con id "modal-content" no encontrado en el DOM.');
    }
});
