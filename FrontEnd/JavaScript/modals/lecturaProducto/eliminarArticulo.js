import { recuperarNombreBaseDatos } from "../../recursos.js";
import { agregarProducto } from "../../createItem.js";
import { openModal } from "../abrirYCerrarModal.js"; // ajusta ruta si es necesario

export function eliminarArticulo() {
  document.getElementById("delete-btn")?.addEventListener("click", async () => {
    try {
        const id = document.getElementById("id").textContent;
        console.log(id);
        Swal.fire({
                title: 'Are you sure you want to delete this product? ',
                text: 'Changes cannot be rollbacked.',
                icon: 'warning',
                showCancelButton: true,  // Mostramos el botón "Cancelar"
                confirmButtonText: 'Yes, delete item',  // Texto del botón de confirmación
                cancelButtonText: 'No, cancelar',  // Texto del botón de cancelación
                reverseButtons: true  // Revertimos el orden de los botones
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`http://127.0.0.1:4000/delete_product?id=${id}`, {
                      method: 'DELETE',
                    });
                    location.reload();
                }
            });

    } catch (err) {
      console.error("Error al cargar el modal:", err);
    }
  });
}
