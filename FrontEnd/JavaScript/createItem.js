// ========================================================================
// Helper para obtener el valor de un elemento por su id

export const agregarProducto = async ({ isEdit = false, originalId = null } = {}) => {
    // 1) Leer valores básicos y convertir a número donde haga falta
    const id          = document.getElementById("product-id").value.trim();
    const name        = document.getElementById("product-name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price       = parseFloat(document.getElementById("price").value)    || 0;
    const discount    = parseFloat(document.getElementById("discount").value) || 0;
    const categoryId  = parseInt(document.getElementById("primary-category").value, 10);
    const companyId = parseInt(document.getElementById("primary-company").value, 10);

    // 2) Recoger secundarios como números
    const secEls = Array.from(document.querySelectorAll("select[name='secondary-category[]']"));
    const secondary_categories = secEls
        .map(el => {
            // el.value es el ID, pero el texto de la opción es el name que busca el backend
            const txt = el.options[el.selectedIndex]?.text.trim();
            return txt;
        })
        .filter(name => name);  // descartamos selects vacíos

    // 3) Recoger tallas
    const sizeEls = Array.from(document.querySelectorAll("input[name='newSize[]']"));
    const qtyEls  = Array.from(document.querySelectorAll("input[name='newQuantity[]']"));
    const sizes   = sizeEls.map((el, i) => ({
        name:     el.value.trim(),
        quantity: parseInt(qtyEls[i].value, 10) || 0
    })).filter(s => s.name);

    // 4) Validaciones básicas
    if (!id)     return Swal.fire("Error", "El ID es obligatorio.", "error");
    if (!name)   return Swal.fire("Error", "El nombre es obligatorio.", "error");
    if (price < 0 || isNaN(price))       return Swal.fire("Error", "Precio inválido.", "error");
    if (discount < 0 || isNaN(discount)) return Swal.fire("Error", "Descuento inválido.", "error");
    if (isNaN(categoryId))               return Swal.fire("Error", "Debe seleccionar categoría.", "error");

    // 5) Construir payload
    const payload = {
        id,
        name,
        description,
        price,
        discount,
        category: { id: categoryId },
        company: { id: companyId },
        secondary_categories,  // [2, 5, 8]
        sizes                  // [{ name:"S",quantity:10 },…]
    };

    const url    = isEdit ? `/modify_product/${originalId}` : "/add_product";
    const method = isEdit ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload)
        });

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: isEdit ? "Producto modificado" : "Producto añadido",
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

    select.innerHTML = `<option value="" disabled selected>Selecciona una categoría</option>`;
    try {
        const res = await fetch("/categories");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const cats = await res.json();
        if (!Array.isArray(cats)) {
            console.warn("La respuesta no es un array de categorías:", cats);
            window.allCategories = [];
            return;
        }

        // Guardar todas las categorías para secundarios
        window.allCategories = cats.filter(c => c.id && c.name);

        // Poblamos el select primario
        window.allCategories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.id;
            opt.textContent = cat.name;
            select.append(opt);
        });
    } catch (e) {
        console.error("No se pudieron cargar las categorías:", e);
        window.allCategories = [];
    }
}

// ========================================================================

export async function loadCompanies() {
    const select = document.getElementById("primary-company");
    if (!select) {
        console.error('No se encontró el elemento con id "select-company" en el DOM.');
        return;
    }

    select.innerHTML = `<option value="" disabled selected>Selecciona una compañia</option>`;
    try {
        const res = await fetch("/companies");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const companies = await res.json();
        if (!Array.isArray(companies)) {
            console.warn("La respuesta no es un array de compañías:", companies);
            return;
        }

        companies.filter(c => c.id && c.name).forEach(company => {
            const opt = document.createElement("option");
            opt.value = company.id;
            opt.textContent = company.name;
            select.append(opt);
        });
    } catch (e) {
        console.error("No se pudieron cargar las compañías:", e);
    }
}


// ========================================================================
// Función para manejar clic en Secondary Category
function handleSecondaryClick() {
    const container = document.getElementById("added-categories");
    if (!container) {
        console.error("#added-categories no encontrado");
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("flex", "items-center", "gap-2", "mt-1");

    const select = document.createElement("select");
    select.name = "secondary-category[]";
    select.required = true;
    select.classList.add("category-input", "border", "border-gray-300", "rounded", "px-2", "py-1");

    const ph = document.createElement("option");
    ph.value = "";
    ph.disabled = true;
    ph.selected = true;
    ph.textContent = "Selecciona subcategoría";
    select.appendChild(ph);

    (window.allCategories || []).forEach(cat => {
        const o = document.createElement("option");
        o.value = cat.id;
        o.textContent = cat.name;
        select.appendChild(o);
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "×";
    removeBtn.classList.add("text-red-500", "font-bold", "px-2");
    removeBtn.addEventListener("click", () => wrapper.remove());

    wrapper.appendChild(select);
    wrapper.appendChild(removeBtn);
    container.appendChild(wrapper);
}

// ========================================================================
// Delegado para manejar el clic en el botón de añadir inputs para Size y Quantity
function handleModalDelegatedClick(event) {
    if (event.target && event.target.matches("#add-size-b")) {
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
            "w-40",
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
            "w-40",
            "bg-gray-100",
            "rounded-full",
            "outline-none",
            "px-2",
            "py-1",
            "text-sm"
        );
        wrapperQuantity.appendChild(inputQuantity);
        divQuantity.appendChild(wrapperQuantity);
    }
}

// ========================================================================
// ========================================================================
// Document Ready: Configuración de eventos cuando el DOM está listo
// ========================================================================
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🟢 DOM listo — el script se está ejecutando");

    // 1) Cargar categorías
    await loadCategories();
    await loadCompanies();

    // 2) Delegated listener para el botón secundarias (funciona aunque el botón se inserte dinámicamente)
    document.body.addEventListener("click", event => {
        if (event.target && event.target.matches("#secondary-category-btn")) {
            console.log("🔽 Click delegado en Secondary Category detectado");
            handleSecondaryClick();
        }
    });

    // 3) Delegar evento para tallas y cantidades
    const modalContent = document.getElementById("modal-content");
    console.log("Modal content encontrado:", modalContent);
    if (modalContent) modalContent.addEventListener("click", handleModalDelegatedClick);
});
