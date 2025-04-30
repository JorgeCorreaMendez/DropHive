export async function cargarDatosUsuario(data) {
    document.getElementById('id').textContent = data.id;
    document.getElementById('mail').textContent = data.mail;

    const response = await fetch(`get_privilege?id=${data.privilege_id}`);
    const object = await response.json();

    document.getElementById('role').textContent = object.name;

    document.getElementById('delete-btn').addEventListener("click", () => {
        eliminarCuenta(data.id)
    })
}

function eliminarCuenta(userId) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará la cuenta permanentemente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/delete_account?id=${userId}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) throw new Error("Error al borrar");
          return response.json();
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Cuenta eliminada',
            text: 'Se ha borrado la cuenta correctamente',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            window.location.reload();
          });
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha habido un problema, no se ha podido borrar la cuenta',
            confirmButtonColor: '#d33'
          });
        });
    }
  });
}