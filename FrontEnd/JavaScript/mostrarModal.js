import { recuperarNombreBaseDatos } from "./recursos.js";

document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.getElementById("modal-container");
  const modalContent = document.getElementById("modal-content");

  const openModal = (htmlContent) => {
    // Insertar el contenido en el modal
    modalContent.innerHTML = `
      <button id="close-modal" class="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black">&times;</button>
      ${htmlContent}
    `;

    // Mostrar el contenedor
    modalContainer.classList.remove("hidden");

    // Forzar reflow para activar transición
    void modalContent.offsetWidth;

    // Aplicar clases de entrada
    modalContent.classList.remove("scale-95", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");

    // Botón de cerrar
    modalContent.querySelector("#close-modal").addEventListener("click", closeModal);
  };

  const closeModal = () => {
    // Aplicar animación de salida
    modalContent.classList.remove("scale-100", "opacity-100");
    modalContent.classList.add("scale-95", "opacity-0");

    // Ocultar el modal después de la animación
    setTimeout(() => {
      modalContainer.classList.add("hidden");
    }, 300);
  };

  // Cierre al hacer clic fuera del contenido del modal
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      closeModal();
    }
  });

  // Evento de abrir modal
  document.getElementById("add-item-btn").addEventListener("click", async () => {
    try {
      const db_name = await recuperarNombreBaseDatos();

      const response = await fetch(`/${db_name}/createItem`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);
    } catch (err) {
      console.error("Error al cargar el modal:", err);
    }
  });
});
