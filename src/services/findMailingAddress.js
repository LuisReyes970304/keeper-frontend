import { nominatimService } from "../api/nominatim";

const NOMINATIM_EMAIL = "luis@gmail.com"; // Cambia esto por tu correo electrónico real para cumplir con la política de Nominatim

/**
 * Caché en memoria para evitar peticiones repetidas.
 */
const addressCache = new Map();

/**
 * Genera una clave basada en las coordenadas.
 */
const createCacheKey = (lat, lon) =>
    `${lat.toFixed(5)},${lon.toFixed(5)}`;

export async function findMailingAddress(lat, lon) {
    const cacheKey = createCacheKey(lat, lon);

    if (addressCache.has(cacheKey)) {
        return addressCache.get(cacheKey);
    }

    const maxRetries = 3; // Número máximo de reintentos adicionales

    for (let intento = 0; intento <= maxRetries; intento++) {
        try {
            const data = await nominatimService.getAll(
                "/reverse",
                {
                    format: "json",
                    lat,
                    lon,
                    email: NOMINATIM_EMAIL,
                },
                {
                    headers: {
                        Authorization: undefined,
                        "X-Requested-With": undefined,
                        "Content-Type": undefined,
                    },
                }
            );

            if (!data?.display_name) {
                return `Ubicación: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            }

            const address = data.display_name
                .split(",")
                .slice(0, 3)
                .join(",")
                .trim();

            addressCache.set(cacheKey, address);

            return address;

        } catch (error) {
            console.error(
                `Error en Geocodificación (Intento ${intento + 1}/${maxRetries + 1}):`,
                error
            );

            // Si ya agotamos los reintentos, retornamos el mensaje de error definitivo
            if (intento === maxRetries) {
                return "Error al obtener dirección";
            }
            
            // Esperar un breve momento antes de reintentar
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
