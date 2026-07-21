// Servicio de evidencia local de reportes
//
// El backend (tabla `evidencia`) no está integrado todavía en este flujo,
// así que -tal como se pidió- guardamos la evidencia fotográfica (en base64)
// en el localStorage del navegador, asociada al id del reporte y al usuario
// que la subió. Esto permite que, al iniciar sesión, cada usuario pueda ver
// localmente las fotos de los reportes que él mismo creó.

const STORAGE_KEY = "kp_reportes_evidencia";

function leerAlmacen() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
        console.error("No se pudo leer la evidencia local:", e);
        return {};
    }
}

function guardarAlmacen(almacen) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(almacen));
    } catch (e) {
        // Puede fallar si el localStorage está lleno (los base64 pesan bastante)
        console.error("No se pudo guardar la evidencia local:", e);
    }
}

export function archivoABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Convierte a base64 y guarda en localStorage las imágenes (fotos) asociadas
 * a un reporte recién creado. Los videos u otros archivos se ignoran, ya que
 * solo se pidió guardar imágenes.
 */
export async function guardarEvidenciaReporte(idReporte, idUsuario, archivos = []) {
    if (!idReporte) return [];

    const soloImagenes = (archivos || []).filter(
        (f) => f && typeof f.type === "string" && f.type.startsWith("image/"),
    );
    if (!soloImagenes.length) return [];

    const base64s = await Promise.all(soloImagenes.map(archivoABase64));

    const almacen = leerAlmacen();
    almacen[idReporte] = {
        id_usuario: idUsuario,
        imagenes: base64s,
        guardadoEn: new Date().toISOString(),
    };
    guardarAlmacen(almacen);

    return base64s;
}

/** Devuelve las imágenes (base64) guardadas localmente para un reporte. */
export function obtenerEvidenciaReporte(idReporte) {
    const almacen = leerAlmacen();
    return almacen[idReporte]?.imagenes || [];
}

/** Devuelve los ids de reporte cuya evidencia fue guardada por un usuario. */
export function obtenerReportesConEvidenciaDelUsuario(idUsuario) {
    const almacen = leerAlmacen();
    return Object.keys(almacen).filter(
        (id) => almacen[id]?.id_usuario === idUsuario,
    );
}
