import { setupEventListeners } from "./crearEventListeners.js";
import {initializeModalEvents} from "./abrirYCerrarModal.js";

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  initializeModalEvents();
});
