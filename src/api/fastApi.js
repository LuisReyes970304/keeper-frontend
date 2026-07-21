import { createApiClient, createCrudService, createApiClient2 } from "./client";

// Exporta la instancia del cliente de la API y el servicio CRUD para FastAPI
const api = createApiClient2("https://proyecto-keeper-deploy.onrender.com");
export const fastApi = createCrudService(api);

const api2 = createApiClient2("https://proyecto-keeper-deploy.onrender.com");
export const fastApi2 = createCrudService(api2);
