export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout); // Limpiamos el timeout anterior
        timeout = setTimeout(() => func.apply(this, args), wait); // Espera de 'wait' milisegundos
    };
}
