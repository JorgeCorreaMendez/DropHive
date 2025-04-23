// recursos.js o el archivo donde vayas a definir la función
import {recuperarNombreBaseDatos} from "./recursos.js";

export const agregarProducto = async () => {
    const product_id = document.getElementById("product-id").value;
    const name = document.getElementById("product-name").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    const size = document.getElementById("size").value;
    const discount = parseFloat(document.getElementById("discount").value);
    const category_id = 1; // Puedes ajustar esto dinámicamente si tienes múltiples categorías
    const quantity = 1;

    try {
        // Recuperar el nombre de la base de datos
        const db_name = await recuperarNombreBaseDatos();
        console.log("Nombre de la base de datos:", db_name); // Depuración

        // Hacer la solicitud POST a la ruta dinámica
        const response = await fetch(`/${db_name}/add_product`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_id,
                name,
                description,
                price,
                discount,
                size,
                quantity,
                category_id,
            }),
        });

        // Verificar si la respuesta es correcta
        if (response.ok) {
            console.log("Producto añadido correctamente");
            window.location.href = `/${db_name}/home`;  // Asegurarse de que usamos db_name
        } else {
            const errorMessage = await response.text(); // Obtener mensaje de error del servidor
            console.error("Error en la respuesta del servidor:", errorMessage);
            alert(`Error al añadir el producto: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error al enviar datos:", error);
        alert("Ocurrió un error inesperado. Ver consola para detalles.");
    }

};
document.addEventListener('change', e => {
      // Solo nos interesa cuando cambia un input de imagen
      if (!e.target.matches('.company-image-input')) return;

      const inputFile = e.target;
      const wrapper   = inputFile.closest('.image-upload-wrapper');
      if (!wrapper) return;

      const img = wrapper.querySelector('.image-container');
      const file = inputFile.files[0];
      if (!file) return;

      // Creamos una URL temporal y actualizamos el src
      const objectURL = URL.createObjectURL(file);
      img.src = objectURL;
      img.onload = () => URL.revokeObjectURL(objectURL);

      // Reiniciamos para permitir re-selección del mismo fichero
      inputFile.value = '';
});
