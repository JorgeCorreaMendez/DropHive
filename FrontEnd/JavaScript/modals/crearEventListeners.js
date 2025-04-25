import { recuperarNombreBaseDatos } from "../recursos.js";
import { openModal } from "./abrirYCerrarModal.js";
import { agregarProducto } from "../createItem.js";

/// TODO: QUE HACE ESTO AQUI ?
export function setupEventListeners() {
  document.getElementById("add-item-btn")?.addEventListener("click", async () => {
    const response = await fetch(`/createItem`);
    const html = await response.text();
    openModal(html);
    setTimeout(() => {
      document.getElementById("save-changes-btn")?.addEventListener("click", agregarProducto);
    }, 50);
  });

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
}
