import {openModal} from "../abrirYCerrarModal.js";
import {addProduct} from "../../createProduct.js";

export function modificarArticulo(datos_articulo) {
    const btn = document.getElementById("modify-btn");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        try {
            // 1) Cargar el HTML del formulario de añadir
            const res = await fetch("/createItem");
            const html = await res.text();

            // 2) Parsear en documento virtual y prefill categoría y tallas
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const form = doc.getElementById("createProductForm");
            if (!form) throw new Error("Formulario no encontrado");

            // Prefill categoría en el parser-doc
            const catSelPre = form.querySelector("#primary-category");
            const catNamePre = datos_articulo.category?.name || "";
            if (catNamePre && ![...catSelPre.options].some(o => o.value === catNamePre)) {
                catSelPre.insertAdjacentHTML("beforeend",
                    `<option value="${catNamePre}">${catNamePre}</option>`
                );
            }
            catSelPre.value = catNamePre;

            // Prefill compañia en el parser-doc
            const compSelPre = form.querySelector("#primary-company");
            const compNamePre = datos_articulo.company?.name || "";
            if (compNamePre && ![...compSelPre.options].some(o => o.value === compNamePre)) {
                compSelPre.insertAdjacentHTML("beforeend",
                    `<option value="${compNamePre}">${compNamePre}</option>`
                );
            }
            compSelPre.value = compNamePre;

            // Prefill tallas dinámicas en el parser-doc
            const addBtnPre = form.querySelector("#add-size-b");
            datos_articulo.sizes?.forEach((s, i) => {
                if (i > 0) addBtnPre.click();
                const sizeElsPre = form.querySelectorAll("input[name='newSize[]']");
                const qtyElsPre = form.querySelectorAll("input[name='newQuantity[]']");
                sizeElsPre[i].value = s.name || "";
                qtyElsPre[i].value = s.quantity || 0;
            });

            // 3) Inyectar el HTML completo ya pre–rellenado
            openModal(doc.body.innerHTML);

// Esperamos un poco más para asegurarnos de que el modal se haya renderizado completamente
            setTimeout(() => {
                const modalForm = document.getElementById("createProductForm");
                if (!modalForm) return;

                // --- Campos básicos ---
                const idInput = modalForm.querySelector("#product-id");
                idInput.value = datos_articulo.id;
                idInput.disabled = true;

                modalForm.querySelector("#product-name").value = datos_articulo.name;
                modalForm.querySelector("#description").value = datos_articulo.description;
                modalForm.querySelector("#price").value = datos_articulo.price;
                modalForm.querySelector("#discount").value = datos_articulo.discount;

                // --- Pre–llenado de tallas y cantidades (NO TOCAR) ---
                if (datos_articulo.size && Array.isArray(datos_articulo.size)) {
                    let existingSizeInputs = modalForm.querySelectorAll("input[name='newSize[]']");
                    let existingQtyInputs = modalForm.querySelectorAll("input[name='newQuantity[]']");

                    datos_articulo.size.forEach((s, index) => {
                        if (index < existingSizeInputs.length) {
                            existingSizeInputs[index].value = s.name || "";
                            existingQtyInputs[index].value = s.quantity || 0;
                            console.log(`Asignando tamaño en índice ${index}:`, s);
                        } else {
                            const divSizes = modalForm.querySelector("#div-sizes");
                            const sizeWrapper = document.createElement("div");
                            sizeWrapper.classList.add("flex", "items-center", "gap-2", "mt-2");
                            const newSizeInput = document.createElement("input");
                            newSizeInput.type = "text";
                            newSizeInput.name = "newSize[]";
                            newSizeInput.placeholder = "Ej: S, M, L";
                            newSizeInput.classList.add("w-40", "bg-gray-100", "rounded-full", "outline-none", "px-2", "py-1", "text-sm");
                            newSizeInput.value = s.name || "";
                            sizeWrapper.appendChild(newSizeInput);
                            divSizes.appendChild(sizeWrapper);

                            const divQuantities = modalForm.querySelector("#div-quantity");
                            const qtyWrapper = document.createElement("div");
                            qtyWrapper.classList.add("flex", "items-center", "gap-2", "mt-2");
                            const newQtyInput = document.createElement("input");
                            newQtyInput.type = "number";
                            newQtyInput.name = "newQuantity[]";
                            newQtyInput.placeholder = "Ej: 10";
                            newQtyInput.min = "0";
                            newQtyInput.classList.add("w-40", "bg-gray-100", "rounded-full", "outline-none", "px-2", "py-1", "text-sm");
                            newQtyInput.value = s.quantity || 0;
                            qtyWrapper.appendChild(newQtyInput);
                            divQuantities.appendChild(qtyWrapper);

                            console.log(`Creado y asignado input para talla en índice ${index}:`, s);
                        }
                    });
                } else {
                    console.warn("No se encontraron datos en el array 'size'.");
                }

                // --- Pre‑llenado de la categoría principal ---
                const catSelect = modalForm.querySelector("#primary-category");
                // Buscamos en window.allCategories el objeto cuya id coincida con datos_articulo.category_id.
                let catObj = (window.allCategories && Array.isArray(window.allCategories))
                    ? window.allCategories.find(c => c.id == datos_articulo.category_id)
                    : null;
                let catName = (catObj && catObj.name) ? catObj.name : "";

                if (catName) {
                    // Si no existe una opción con ese nombre, la agregamos.
                    if (![...catSelect.options].some(opt => opt.textContent === catName)) {
                        const option = document.createElement("option");
                        option.value = datos_articulo.category_id;
                        option.textContent = catName;
                        catSelect.appendChild(option);
                        console.warn("Opción de categoría no encontrada, se agregó una opción temporal.");
                    }
                    // Asignamos el select usando el valor (id) para que se muestre la opción cuyo texto es el nombre de la categoría.
                    catSelect.value = datos_articulo.category_id;
                    console.log("Categoría primaria asignada. ID:", catSelect.value, "Nombre:", catName);
                } else {
                    console.warn("No se encontró valor para la categoría primaria.");
                }

                // --- Pre‑llenado de la compañia principal ---
                const compSelect = document.querySelector("#primary-company");
                console.log("datos_articulo:", datos_articulo);
                console.log("datos_articulo.company_id:", datos_articulo.company.id);

                console.log("Elemento select de compañía:", compSelect);

                console.log("window.allCompanies:", window.allCompanies);

                let compObj = (window.allCompanies && Array.isArray(window.allCompanies))
                    ? window.allCompanies.find(c => c.id == datos_articulo.company.id)
                    : null;
                console.log("Resultado de búsqueda en allCompanies por ID:", compObj);

                let compName = (compObj && compObj.name) ? compObj.name : "";
                console.log("Nombre de la compañía encontrada:", compName);

                if (compName) {
                    const yaExiste = [...compSelect.options].some(opt => opt.textContent === compName);
                    console.log("¿La opción ya existía en el select?", yaExiste);

                    if (!yaExiste) {
                        const option = document.createElement("option");
                        option.value = datos_articulo.company.id;
                        option.textContent = compName;
                        compSelect.appendChild(option);
                        console.warn("Opción de compañía no encontrada, se agregó una opción temporal.");
                    }

                    compSelect.value = datos_articulo.company.id;
                    console.log("Compañía primaria asignada. ID:", compSelect.value, "Nombre:", compName);
                } else {
                    console.warn("No se encontró valor para la compañía primaria. ID buscada:", datos_articulo.company_id);
                }


                // --- Prellenado de categorías secundarias con desplegable ---
                const secCatContainer = modalForm.querySelector("#added-categories");
                secCatContainer.innerHTML = "";
                if (datos_articulo.secondary_categories && Array.isArray(datos_articulo.secondary_categories)) {
                    datos_articulo.secondary_categories.forEach(secCat => {
                        const select = document.createElement("select");
                        select.name = "secondary-category[]";
                        select.classList.add("category-input", "border", "border-gray-300", "rounded", "px-2", "py-1");

                        // Llenamos el select con las mismas opciones que tiene window.allCategories
                        if (window.allCategories && Array.isArray(window.allCategories)) {
                            window.allCategories.forEach(cat => {
                                const option = document.createElement("option");
                                option.value = cat.id;
                                option.textContent = cat.name;
                                select.appendChild(option);
                            });
                        } else {
                            console.warn("No se han cargado correctamente las categorías globales.");
                        }

                        // Establecemos el valor del select de acuerdo a la categoría secundaria.
                        select.value = secCat.id;
                        secCatContainer.appendChild(select);
                    });
                } else {
                    console.warn("No se encontraron categorías secundarias.");
                }
            }, 200);  // Usamos un retraso mayor para asegurarnos de que el modal esté renderizado


            // 5) Configurar botón guardar para modo edición
            setTimeout(() => {
                const oldSave = document.getElementById("save-changes-btn");
                const newSave = oldSave.cloneNode(true);
                oldSave.replaceWith(newSave);
                newSave.addEventListener("click", () =>
                    addProduct({isEdit: true, originalId: datos_articulo.id})
                );
            }, 0);

        } catch (err) {
            console.error("Error al abrir modal de edición:", err);
        }
    });
}
