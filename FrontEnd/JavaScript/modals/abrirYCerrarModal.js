const modalContainer = document.getElementById("modal-container");
const modalContent = document.getElementById("modal-content");

export function openModal(htmlContent) {
  modalContent.innerHTML = `
    <button id="close-modal" class="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black">&times;</button>
    ${htmlContent}
  `;

  modalContainer.classList.remove("hidden");
  void modalContent.offsetWidth;
  modalContent.classList.remove("scale-95", "opacity-0");
  modalContent.classList.add("scale-100", "opacity-100");

  modalContent.querySelector("#close-modal").addEventListener("click", closeModal);
}

export function closeModal() {
  const modalContainer = document.getElementById("modal-container");
  const modalContent = document.getElementById("modal-content");

  modalContent.classList.remove("scale-100", "opacity-100");
  modalContent.classList.add("scale-95", "opacity-0");

  setTimeout(() => {
    modalContainer.classList.add("hidden");
  }, 300);
}

export function initializeModalEvents() {
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      closeModal();
    }
  });
}