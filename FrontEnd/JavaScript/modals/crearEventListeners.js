import { recuperarNombreBaseDatos } from "../recursos.js";
import { openModal } from "./abrirYCerrarModal.js";
import { addProduct } from "../createProduct.js";
import { initializeRowClickHandler } from "./lecturaProducto/productRowClick.js"
import { cargarModalCrearProducto } from "../home/productos.js";
import {initializeRowClickHandlerCategory} from "../category/productRowClickCategory.js";
import {initializeRowClickHandlerCompany} from "../Company/companyRowClick.js";

export function setupEventListeners() {
  document.getElementById("add-item-btn")?.addEventListener("click", cargarModalCrearProducto);

  document.getElementById("add-company-btn")?.addEventListener("click", async () => {
    const response = await fetch(`/addAndModifyCompany`);
    const html = await response.text();
    openModal(html);
  });

  document.getElementById("notification-btn")?.addEventListener("click", async () => {
    const response = await fetch(`/notifications`);
    const html = await response.text();
    openModal(html);
  });

  initializeRowClickHandler();
  initializeRowClickHandlerCategory();
  initializeRowClickHandlerCompany();
}
