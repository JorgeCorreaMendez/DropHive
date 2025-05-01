// ========================================================================
// Helper para obtener el valor de un elemento por su id
const getInputValue = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : "";
};

// ========================================================================
// Función para agregar un producto
export const agregarProducto = async () => {
    // Se obtienen los valores de cada campo del formulario
    const product_id = getInputValue("product-id");
    const name = getInputValue("product-name");
    const description = getInputValue("description");
    const price = parseFloat(getInputValue("price"));
    const sizeName = getInputValue("new-size");
    const discount = parseFloat(getInputValue("discount"));
    const quantity = parseInt(getInputValue("new-quantity"), 10);

    // Obtenemos el select de categoría
    const categoryEl = document.getElementById("primary-category");
    if (!categoryEl) {
        console.error("Error: No se encontró el elemento con id 'primary-category' al agregar el producto.");
    } else {
        console.log("Elemento 'primary-category' encontrado:", categoryEl);
    }
    const category = { name: categoryEl ? categoryEl.value : "" };

    try {
        const response = await fetch("/add_product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_id,
                name,
                description,
                price,
                discount,
                category,
                sizes: [{ name: sizeName, quantity }]
            }),
        });

        if (response.ok) {
            console.log("Producto añadido correctamente");
            window.location.href = "/home";
        } else {
            const errorMessage = await response.text();
            console.error("Error en la respuesta del servidor:", errorMessage);
            alert(`Error al añadir el producto: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error al enviar datos:", error);
        alert("Ocurrió un error inesperado. Ver consola para detalles.");
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
const handleModalDelegatedClick = (event) => {
    if (event.target && event.target.matches("#add-size-b")) {
        console.log("Botón pulsado (delegación) para añadir inputs de Size y Quantity");

        const modalContent = document.getElementById("modal-content");
        if (!modalContent) {
            console.error("Elemento con id 'modal-content' no encontrado en el DOM.");
            return;
        }

        const divSizes = modalContent.querySelector("#div-sizes");
        const divQuantity = modalContent.querySelector("#div-quantity");

        if (!divSizes || !divQuantity) {
            console.error("Contenedores en modal no encontrados");
            return;
        }

        // Creación del input para Size
        const wrapperSize = document.createElement("div");
        wrapperSize.classList.add("flex", "items-center", "gap-2", "mt-2");
        const inputSize = document.createElement("input");
        inputSize.type = "text";
        inputSize.placeholder = "Ej: S, M, L";
        inputSize.classList.add("w-40", "bg-gray-100", "rounded-full", "outline-none", "px-2", "py-1", "text-sm", "text-left");
        wrapperSize.appendChild(inputSize);
        divSizes.appendChild(wrapperSize);

        // Creación del input para Quantity
        const wrapperQuantity = document.createElement("div");
        wrapperQuantity.classList.add("flex", "items-center", "gap-2", "mt-2");
        const inputQuantity = document.createElement("input");
        inputQuantity.type = "text";
        inputQuantity.placeholder = "Ej: 10";
        inputQuantity.classList.add("w-40", "bg-gray-100", "rounded-full", "outline-none", "px-2", "py-1", "text-sm");
        wrapperQuantity.appendChild(inputQuantity);
        divQuantity.appendChild(wrapperQuantity);

        console.log("Nuevos inputs añadidos en Size y Quantity");
    }
};

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
