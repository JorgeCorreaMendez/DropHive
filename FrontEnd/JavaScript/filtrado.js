import {recuperarNombreBaseDatos} from "./recursos.js";
import {cargarDatosEnTabla} from "./home.js";
import {debounce} from "./recursos/retrasarEjecucion.js";
import {obtenerValorPrecio} from "./recursos/recursosParaNumeros.js";

const filtros = {
    limite: document.getElementById("items-per-page"),
    categoria: document.getElementById("select-categoria"),
    // proveedor: document.getElementById("select-proveedor"),
    min_precio: document.getElementById("min-price"),
    max_precio: document.getElementById("max-price"),
    cantidad: document.getElementById("max-quantity")
};

Object.values(filtros).forEach((elemento) => {
    const eventType = elemento.tagName === 'SELECT' ? 'change' : 'input';

    // Usamos el debounce para aplicar la función con un retraso de 1 segundo
    elemento.addEventListener(eventType, debounce(async () => {
        const vistaActual = document.body.dataset.vista;
        await aplicarFiltros(vistaActual);
    }, 750)); // 1000 ms = 1 segundo
});



export async function aplicarFiltros(tipo) {
    const params = new URLSearchParams();
    const numero_de_pagina = parseInt(document.getElementById("page-number").textContent);

    let offset = parseInt(filtros.limite.value) * (numero_de_pagina - 1);

    params.set("offset", offset.toString());

    if(filtros.limite.value) params.set("limit", filtros.limite.value);

    if(tipo === "productos") {
        if(filtros.categoria.value !== "all") params.set("category", filtros.categoria.value);
        if(filtros.min_precio.value) params.set("min_price", obtenerValorPrecio(filtros.min_precio.value)); // Aparece un error pero no hay problema
        if(filtros.max_precio.value) params.set("max_price", obtenerValorPrecio(filtros.max_precio.value)); // ya que no puede devolver un valor null
        if(filtros.cantidad.value) params.set("max_quantity", filtros.cantidad.value);

        const url = `http://127.0.0.1:4000/filter_products?${params.toString()}`

        fetch(url)
            .then(res => res.json())
            .then(data => {
                cargarDatosEnTabla(data.productos);
            })
            .catch(err => console.error("Error cargando productos", err))
    } else {
        const url = `http://127.0.0.1:4000/filter_category?${params.toString()}`

        fetch(url)
            .then(res => res.json())
            .then(data => {
                cargarDatosEnTabla(data);
            })
            .catch(err => console.error("Error cargando productos", err))
    }

}