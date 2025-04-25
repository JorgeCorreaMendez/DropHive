import { recuperarNombreBaseDatos } from "../../recursos.js";
import { agregarProducto } from "../../createItem.js";
import { openModal } from "../abrirYCerrarModal.js"; // ajusta ruta si es necesario

export function modificarArticulo(datos_articulo) {
  document.getElementById("modify-btn")?.addEventListener("click", async () => {
    try {
      const db_name = await recuperarNombreBaseDatos();
      const response = await fetch(`/${db_name}/createItem`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;
      openModal(bodyContent);

      setTimeout(() => {
        const product_name = document.getElementById("product-name");
        const descripcion = document.getElementById("description");
        const product_id = document.getElementById("product-id");
        const price = document.getElementById("price");

        if (!product_name) return;

        product_name.value = datos_articulo.name;
        descripcion.textContent = datos_articulo.description;
        product_id.value = datos_articulo.product_id;
        price.value = datos_articulo.price;
      }, 50);

      document.getElementById("save-changes-btn")?.addEventListener("click", agregarProducto);
    } catch (err) {
      console.error("Error al cargar el modal:", err);
    }
  });
}
