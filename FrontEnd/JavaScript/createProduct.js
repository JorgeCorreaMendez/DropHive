import {openModal} from "./modals/abrirYCerrarModal.js";
import {addOrModifyCategory} from "./category/addAndModifyCategory.js";

const alertError = document.getElementById('alert-error');
const successModal = document.getElementById('success-modal');
export const addProduct = async ({ isEdit = false, originalId = null } = {}) => {
    const id          = document.getElementById("product-id").value.trim();
    const name        = document.getElementById("product-name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price       = parseFloat(document.getElementById("price").value)    || 0;
    const discount    = parseFloat(document.getElementById("discount").value) || 0;
    const categoryId  = parseInt(document.getElementById("primary-category").value, 10);
    const companyId = parseInt(document.getElementById("primary-company").value, 10);
    const secEls = Array.from(document.querySelectorAll("select[name='secondary-category[]']"));
    const secondary_categories = secEls
        .map(el => {
            return el.options[el.selectedIndex]?.text.trim();
        })
        .filter(name => name);
    const sizeEls = Array.from(document.querySelectorAll("input[name='newSize[]']"));
    const qtyEls  = Array.from(document.querySelectorAll("input[name='newQuantity[]']"));
    const sizes   = sizeEls.map((el, i) => ({
        name:     el.value.trim(),
        quantity: parseInt(qtyEls[i].value, 10) || 0
    })).filter(s => s.name);

    if (!id)     return alertError.show("Error, ID is required.", 2000);
    if (!name)   return alertError.show("Error, Name is required.", 2000);
    if (price < 0 || isNaN(price))       return alertError.show("Error, Invalid price.", 2000);
    if (discount < 0 || isNaN(discount)) return alertError.show("Error, Invalid discount.", 2000);
    if (isNaN(categoryId))               return alertError.show("Error, You must select a category.", 2000);
    if (isNaN(companyId))                return alertError.show("Error, You must select a company.", 2000);

    const payload = {
        id,
        name,
        description,
        price,
        discount,
        category: { id: categoryId },
        company: { id: companyId },
        secondary_categories,
        sizes
    };
    const url = isEdit ? `/modify_product?id=${originalId}` : "/add_product";
    const method = isEdit ? "PUT" : "POST";
    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload)
        });

        if (res.ok) {
            successModal.show(isEdit ? "Product modified" : "Product added", "success");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            const msg = await res.text();
            alertError.show(`${msg}`, 2000)
        }
    } catch (err) {
        alertError.show(`Error, ${error.message}`, 2000)
    }
};

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
// Function to load categories into the dropdown
export async function loadCategories() {
    const select = document.getElementById("primary-category");
    if (!select) {
        return;
    }

    select.innerHTML = `<option value="" disabled selected>Select a category</option>`;
    try {
        const res = await fetch("/categories");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const cats = await res.json();
        if (!Array.isArray(cats)) {
            console.warn("Response is not a category array:", cats);
            window.allCategories = [];
            return;
        }

        // Store all categories for secondary use
        window.allCategories = cats.filter(c => c.id && c.name);

        // Populate primary select
        window.allCategories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.id;
            opt.textContent = cat.name;
            select.append(opt);
        });
        $(select).select2({
            placeholder: "Selecciona una categoría",
            allowClear: true,
            width: "100%"
        });

    } catch (e) {
        console.error("Failed to load categories:", e);
        window.allCategories = [];
    }
}

// ========================================================================
export async function loadCompanies() {
    const select = document.getElementById("primary-company");
    if (!select) {
        return;
    }

    select.innerHTML = `<option value="" disabled selected>Select a company</option>`;
    try {
        const res = await fetch("/companies");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const companies = await res.json();
        if (!Array.isArray(companies)) {
            console.warn("The response is not an array of companies:", companies);
            return;
        }

        companies
            .filter(c => c.id && c.name)
            .forEach(company => {
                if(company.id !== 1) {
                    const opt = document.createElement("option");
                    opt.value = company.id;
                    opt.textContent = company.name;
                    select.append(opt);
                }
            });
        $(select).select2({
            placeholder: "Selecciona una empresa",
            allowClear: true,
            width: "100%"
        });
    } catch (e) {
        console.error("Failed to load companies:", e);
    }
}



// ========================================================================
// Function to handle click on Secondary Category button
function handleSecondaryClick() {
    const container = document.getElementById("added-categories");
    if (!container) {
        console.error("#added-categories not found");
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
    ph.textContent = "Select subcategory";
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

    // ✅ Activar Select2 en este select secundario
    $(select).select2({
        placeholder: "Selecciona una subcategoría",
        allowClear: true,
        width: "100%"
    });
}

// ========================================================================
// Delegated handler to add Size and Quantity inputs dynamically
function handleModalDelegatedClick(event) {
    if (event.target && event.target.matches("#add-size-b")) {
        const modalContent = document.getElementById("modal-content");
        if (!modalContent) {
            console.error("Element with id 'modal-content' not found.");
            return;
        }

        const divSizes = modalContent.querySelector("#div-sizes");
        const divQuantity = modalContent.querySelector("#div-quantity");
        if (!divSizes || !divQuantity) {
            console.error("Size or quantity containers not found.");
            return;
        }

        // Create Size input
        const wrapperSize = document.createElement("div");
        wrapperSize.classList.add("flex", "items-center", "gap-2", "mt-2");
        const inputSize = document.createElement("input");
        inputSize.type = "text";
        inputSize.name = "newSize[]";
        inputSize.placeholder = "E.g. S, M, L";
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

        // Create Quantity input
        const wrapperQuantity = document.createElement("div");
        wrapperQuantity.classList.add("flex", "items-center", "gap-2", "mt-2");
        const inputQuantity = document.createElement("input");
        inputQuantity.type = "number";
        inputQuantity.name = "newQuantity[]";
        inputQuantity.placeholder = "E.g. 10";
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
// Document Ready: Set up events when the DOM is ready
// ========================================================================
document.addEventListener("DOMContentLoaded", async () => {
    // 1) Cargar categorías
    await loadCategories();
    await loadCompanies();

    // 2) Delegated listener for secondary category button
    document.body.addEventListener("click", event => {
        if (event.target && event.target.matches("#secondary-category-btn")) {
            handleSecondaryClick();
        }
    });

    // 3) Delegate event for size and quantity inputs
    const modalContent = document.getElementById("modal-content");
    if (modalContent) modalContent.addEventListener("click", handleModalDelegatedClick);
});

// Delegated listener for Add Category button
document.body.addEventListener("click", async (e) => {
    const btn = e.target.closest("#add-category-btn");
    if (btn) {
        e.preventDefault();

        try {
            const response = await fetch("/addAndModifyCategory");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlText = await response.text();
            const parser = new DOMParser();
            const parsedDoc = parser.parseFromString(htmlText, "text/html");
            const fragmento = parsedDoc.body.innerHTML;
            openModal(fragmento);
        } catch (error) {
            console.error("Error loading category content:", error);
        }
    }
});

document.getElementById("modal-container").addEventListener("click", async (e) => {
    const saveBtn = e.target.closest("#save-btn1");
    if (saveBtn) {
        e.preventDefault();
        await addOrModifyCategory();
    }
});

