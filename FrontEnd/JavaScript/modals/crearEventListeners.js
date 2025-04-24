import { recuperarNombreBaseDatos } from "../recursos.js";
import { openModal } from "./abrirYCerrarModal.js";
import { agregarProducto } from "../createItem.js";

export function setupEventListeners() {
  document.getElementById("add-item-btn")?.addEventListener("click", async () => {
    const db_name = await recuperarNombreBaseDatos();
    const response = await fetch(`/${db_name}/createItem`);
    const html = await response.text();
    openModal(html);
    setTimeout(() => {
      document.getElementById("save-changes-btn")?.addEventListener("click", agregarProducto);
    }, 50);
  });

  document.getElementById("add-company-btn")?.addEventListener("click", async () => {
    const db_name = await recuperarNombreBaseDatos();
    const response = await fetch(`/${db_name}/addAndModifyCompany`);
    const html = await response.text();
    openModal(html);
  });

  document.getElementById("notification-btn")?.addEventListener("click", async () => {
    const db_name = await recuperarNombreBaseDatos();
    const response = await fetch(`/${db_name}/notifications`);
    const html = await response.text();
    openModal(html);
  });
}
