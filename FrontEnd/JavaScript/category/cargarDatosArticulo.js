export function cargarDatosCategoria(datos_categoria) {
    const id= document.getElementById("categoria-id");
    const nombre= document.getElementById("categoria-nombre");
    const descripcion= document.getElementById("categoria-descripcion");

    id.textContent = datos_categoria.id;
    nombre.textContent = datos_categoria.name;
    descripcion.textContent = datos_categoria.description;

    cargarArticulos(datos_categoria.products);
}

function cargarArticulos(productos) {
    const contenedor = document.getElementById("lista-productos-categoria");

    contenedor.innerHTML = "";

     // Recorrer los productos de 3 en 3
     for (let i = 0; i < productos.length; i += 3) {
        // Crear fila
        const fila = document.createElement("div");
        fila.className = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full";

        // Añadir hasta 3 productos a la fila
        for (let j = i; j < i + 3 && j < productos.length; j++) {
          const producto = document.createElement("div");
            producto.className = `
                bg-white 
                p-3 
                rounded-lg 
                shadow-sm 
                text-center 
                text-sm 
                font-medium 
                min-h-[120px] 
                flex 
                items-center 
                justify-center
                w-full
            `;

          producto.textContent = `${productos[j].name} - ${productos[j].price} €`;
          fila.appendChild(producto);
        }

        // Añadir fila al contenedor
        contenedor.appendChild(fila);
     }
}