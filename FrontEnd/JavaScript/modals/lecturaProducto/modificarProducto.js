import { openModal } from "../abrirYCerrarModal.js";
import { agregarProducto } from "../../createItem.js";

export function modificarArticulo(datos_articulo) {
  const btn = document.getElementById("modify-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      // 1) Cargar el HTML del formulario de añadir
      const res  = await fetch("/createItem");
      const html = await res.text();

      // 2) Parsear en documento virtual y prefill categoría y tallas
      const parser = new DOMParser();
      const doc    = parser.parseFromString(html, "text/html");
      const form   = doc.getElementById("createProductForm");
      if (!form) throw new Error("Formulario no encontrado");

      // Prefill categoría en el parser-doc
      const catSelPre  = form.querySelector("#primary-category");
      const catNamePre = datos_articulo.category?.name || "";
      if (catNamePre && ![...catSelPre.options].some(o => o.value === catNamePre)) {
        catSelPre.insertAdjacentHTML("beforeend",
            `<option value="${catNamePre}">${catNamePre}</option>`
        );
      }
      catSelPre.value = catNamePre;

      // Prefill tallas dinámicas en el parser-doc
      const addBtnPre = form.querySelector("#add-size-b");
      datos_articulo.sizes?.forEach((s, i) => {
        if (i > 0) addBtnPre.click();
        const sizeElsPre = form.querySelectorAll("input[name='newSize[]']");
        const qtyElsPre  = form.querySelectorAll("input[name='newQuantity[]']");
        sizeElsPre[i].value = s.name     || "";
        qtyElsPre[i].value  = s.quantity || 0;
      });

      // 3) Inyectar el HTML completo ya pre–rellenado
      openModal(doc.body.innerHTML);
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

        // --- Pre–llenado de tallas y cantidades ---
        if (datos_articulo.size && Array.isArray(datos_articulo.size)) {
          // Primero, obtenemos los inputs existentes ya creados en el formulario.
          let existingSizeInputs = modalForm.querySelectorAll("input[name='newSize[]']");
          let existingQtyInputs  = modalForm.querySelectorAll("input[name='newQuantity[]']");

          datos_articulo.size.forEach((s, index) => {
            if (index < existingSizeInputs.length) {
              // Si ya existe el input para ese índice, lo rellenamos
              existingSizeInputs[index].value = s.name || "";
              existingQtyInputs[index].value  = s.quantity || 0;
              console.log(`Asignando tamaño en índice ${index}:`, s);
            } else {
              // Si no existe, creamos nuevos inputs dinámicamente
              // Crear input para talla:
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

              // Crear input para cantidad:
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

        // Pre‑llenado de la categoría
        const catSelect = modalForm.querySelector("#primary-category");
        // Si el objeto trae la propiedad category.name, la usamos; en caso contrario, si hay category_id usamos el mapeo
        let catValue = "";
        if (datos_articulo.category && datos_articulo.category.name) {
          catValue = datos_articulo.category.name;
        } else if (datos_articulo.category_id) {
          // Usamos el mapa creado por loadCategories para encontrar el nombre correspondiente
          catValue = window.categoriesMapping && window.categoriesMapping[datos_articulo.category_id]
              ? window.categoriesMapping[datos_articulo.category_id]
              : "";
        }
        if (catValue) {
          if (![...catSelect.options].some(opt => opt.value === catValue)) {
            const option = document.createElement("option");
            option.value = catValue;
            option.textContent = catValue;
            catSelect.appendChild(option);
            console.warn("Opción de categoría no encontrada, se agregó una opción temporal.");
          }
          catSelect.value = catValue;
          console.log("Categoría asignada:", catSelect.value);
        } else {
          console.warn("No se encontró valor para la categoría.");
        }
      }, 0);


      // 5) Configurar botón guardar para modo edición
      setTimeout(() => {
        const oldSave = document.getElementById("save-changes-btn");
        const newSave = oldSave.cloneNode(true);
        oldSave.replaceWith(newSave);
        newSave.addEventListener("click", () =>
            agregarProducto({ isEdit: true, originalId: datos_articulo.id })
        );
      }, 0);

    } catch (err) {
      console.error("Error al abrir modal de edición:", err);
    }
  });
}
