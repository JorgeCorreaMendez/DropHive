export function eliminarArticulo() {
  document.getElementById("delete-btn")?.addEventListener("click", async () => {
    try {
        const id = document.getElementById("id").textContent;
        const modal = document.getElementById("confirmation-modal");
        modal.show('Are you sure you want to delete this product?')
            .then(async () => {
                await fetch(`http://127.0.0.1:4000/delete_product?id=${id}`, { method: 'DELETE' });
                location.reload();
            })
            .catch(error => {
                console.error("Error executing delete:", error);
            });
    } catch (err) {
      console.error("Error al cargar el modal:", err);
    }
  });
}
