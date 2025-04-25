import {recuperarNombreBaseDatos} from "../../recursos.js";
import {localizarCategoria} from "../../home/productos.js";

export async function cargarDatosArticulo(datos_articulo) {
  const db_name = await recuperarNombreBaseDatos();

  const id = document.getElementById("id");
  const product_name = document.getElementById("product-name");
  const img = document.getElementById("imagen");
  const main_category = document.getElementById("main-category");
  const price = document.getElementById("price");
  const descripcion = document.getElementById("descripcion");

  if (!product_name || !img) {
    console.log("No se ha encontrado algún elemento.");
    return;
  }

  id.textContent = datos_articulo.product_id;
  product_name.textContent = datos_articulo.name;
  img.alt = `imagen de ${datos_articulo.name}`;
  // img.src = datos_articulo.imagen;

  main_category.textContent = await localizarCategoria(datos_articulo.category_id);

  price.textContent = datos_articulo.price;
  descripcion.textContent = datos_articulo.description;
}
