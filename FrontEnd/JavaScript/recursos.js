export async function recuperarNombreBaseDatos() {
    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    return segments[1]
}