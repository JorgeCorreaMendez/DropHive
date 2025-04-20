import {recuperarNombreBaseDatos} from "./recursos.js";
import {cargarDatosEnTabla} from "./home.js";


const filtros = {
    limite: document.getElementById("items-per-page"),
    categoria: document.getElementById("select-categoria"),
    //proveedor: document.getElementById("select-proveedor"),
    min_precio: document.getElementById("min-price"),
    max_precio: document.getElementById("max-price"),
    cantidad: document.getElementById("max-quantity")
}

Object.values(filtros).forEach((elistener => {
    const eventType = elistener.tagName === 'SELECT' ? 'change' : 'input';
    elistener.addEventListener(eventType, aplicarFiltros);
}))

async function aplicarFiltros() {
    const params = new URLSearchParams();
    const db_name = await recuperarNombreBaseDatos();

    if(filtros.limite.value) params.set("limit", filtros.limite.value);
    if(filtros.categoria.value !== "all") params.set("category", filtros.categoria.value);
    if(filtros.min_precio.value) params.set("min_price", filtros.min_precio.value);
    if(filtros.max_precio.value) params.set("max_price", filtros.max_precio.value);
    if(filtros.cantidad.value) params.set("max_quantity", filtros.cantidad.value);


    const url = `http://127.0.0.1:4000/${db_name}/filter_products?${params.toString()}`

    console.log(url);

    fetch(url)
        .then(res => res.json())
        .then(data => cargarDatosEnTabla(data))
        .catch(err => console.error("Error cargando productos", err))
}