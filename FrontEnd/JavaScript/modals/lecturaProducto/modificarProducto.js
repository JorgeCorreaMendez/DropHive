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

      // 2) Parsear y rellenar en documento virtual
      const parser = new DOMParser();
      const doc    = parser.parseFromString(html, "text/html");
      const form   = doc.getElementById("createProductForm");
      if (!form) throw new Error("Formulario no encontrado en addItem.html");

      // Categoría
      const catSel  = form.querySelector("#primary-category");
      const catName = datos_articulo.category?.name || "";
      if (catName && ![...catSel.options].some(o => o.value === catName)) {
        catSel.insertAdjacentHTML("beforeend",
            `<option value="${catName}">${catName}</option>`);
      }
      catSel.value = catName;

      // Tallas dinámicas
      const addBtn = form.querySelector("#add-size-b");
      datos_articulo.sizes?.forEach((s, i) => {
        if (i > 0) addBtn.click();
        const sizeEls = form.querySelectorAll("input[name='newSize[]']");
        const qtyEls  = form.querySelectorAll("input[name='newQuantity[]']");
        sizeEls[i].value = s.name     || "";
        qtyEls[i].value  = s.quantity || 0;
      });

      // 3) Inyectar el HTML completo ya rellenado
      openModal(doc.body.innerHTML);
      setTimeout(() => {
        const modalForm = document.getElementById("createProductForm");
        if (!modalForm) return;
        modalForm.querySelector("#product-id").value    = datos_articulo.id;
        modalForm.querySelector("#product-name").value  = datos_articulo.name;
        modalForm.querySelector("#description").value   = datos_articulo.description;
        modalForm.querySelector("#price").value         = datos_articulo.price;
        modalForm.querySelector("#discount").value      = datos_articulo.discount;

        const catSel  = modalForm.querySelector("#primary-category");
        const catName = datos_articulo.category?.name || "";
        if (catName && ![...catSel.options].some(o => o.value === catName)) {
          catSel.insertAdjacentHTML("beforeend",
              `<option value="${catName}">${catName}</option>`);
        }
        catSel.value = catName;
      }, 0);

      // 4) Configurar botón guardar para modo edición
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
