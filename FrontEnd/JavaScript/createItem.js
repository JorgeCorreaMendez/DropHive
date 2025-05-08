// ========================================================================
// Helper para obtener el valor de un elemento por su id


export const agregarProducto = async ({ isEdit = false, originalId = null } = {}) => {
    // Leer valores básicos
    const id          = document.getElementById("product-id").value.trim();
    const name        = document.getElementById("product-name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price       = parseFloat(document.getElementById("price").value)   || 0;
    const discount    = parseFloat(document.getElementById("discount").value)|| 0;
    const category    = { name: document.getElementById("primary-category").value.trim() };

    // Ahora recoge TODOS los inputs con name="newSize[]"
    const sizeEls    = Array.from(document.querySelectorAll("input[name='newSize[]']"));
    const qtyEls     = Array.from(document.querySelectorAll("input[name='newQuantity[]']"));
    const sizes      = sizeEls.map((el, i) => ({
        name:     el.value.trim(),
        quantity: parseInt(qtyEls[i].value, 10) || 0
    })).filter(s => s.name);

    // Validaciones
    if (!id)      return Swal.fire("Error", "El ID es obligatorio.", "error");
    if (!name)    return Swal.fire("Error", "El nombre es obligatorio.", "error");
    if (isNaN(price)   || price < 0)    return Swal.fire("Error", "Precio inválido.", "error");
    if (isNaN(discount)|| discount < 0) return Swal.fire("Error", "Descuento inválido.", "error");

    const url    = isEdit ? `/modify_product/${originalId}` : "/add_product";
    const method = isEdit ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ id, name, description, price, discount, category, sizes })
        });

        if (res.ok) {
            Swal.fire({
                icon: isEdit ? "success" : "success",
                title: isEdit ? "Producto modificado" : "Producto añadido",
                timer: 1500, showConfirmButton: false
            }).then(() => window.location.reload());
        } else {
            const msg = await res.text();
            Swal.fire("Error", msg, "error");
        }
    } catch (err) {
        Swal.fire("Error inesperado", err.message, "error");
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

    // Reiniciar contenido y agregar placeholder
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

        // Creamos (o reiniciamos) el mapa global
        window.categoriesMapping = {};

        cats.forEach((cat) => {
            if (!cat.name) {
                console.warn("La categoría no tiene propiedad 'name':", cat);
                return;
            }
            const opt = document.createElement("option");
            // Usamos el nombre como value (esto es lo que se muestra en el select)
            opt.value = cat.name;
            opt.textContent = cat.name;
            select.append(opt);

            // Creamos el mapeo id => name
            window.categoriesMapping[cat.id] = cat.name;
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
