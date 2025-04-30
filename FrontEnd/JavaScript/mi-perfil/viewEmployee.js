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
    title: 'Are You Sure?',
    text: "This Action Will Delete The Account Permanently.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/delete_account?id=${userId}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) throw new Error("Error While Deleting");
          return response.json();
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Account Deleted',
            text: 'The Account Has Been Deleted Succesfully',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            window.location.reload();
          });
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An Error Ocurred While Deleting The Account.',
            confirmButtonColor: '#d33'
          });
        });
    }
  });
}