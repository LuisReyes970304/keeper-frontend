import { createApiClient, createCrudService } from "./client.js";

// Exporta la instancia del cliente de la API y el servicio CRUD para Nominatim
const apiClient = createApiClient("https://nominatim.openstreetmap.org", 75000);
export const nominatimService = createCrudService(apiClient);