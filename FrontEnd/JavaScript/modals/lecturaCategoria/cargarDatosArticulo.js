export function cargarDatosCategoria(datos_categoria) {
    const id= document.getElementById("categoria-id");
    const nombre= document.getElementById("categoria-nombre");
    const descripcion= document.getElementById("categoria-descripcion");

    console.log(datos_categoria);

    id.textContent = datos_categoria.id;
    nombre.textContent = datos_categoria.name;
    descripcion.textContent = datos_categoria.description;
}