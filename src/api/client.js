import axios from "axios";

// Tu creador de Axios
export const createApiClient = (url, time=45000) =>
    axios.create({
        baseURL: url,
        timeout: time,
        headers: { "Content-Type": "application/json" },
    });

export const createApiClient2 = (url, time=45000) =>
    axios.create({
        baseURL: url,
        timeout: time,
        headers: { "Content-Type": "application/json" },
        withCredentials: true
    });


// El generador del CRUD
export const createCrudService = (apiClient) => {
    return {
        /**
         * Obtiene todos los registros (GET)
         * @param {string} path - La ruta específica (ej. '/users')
         * @param {object} params - Query params opcionales (ej. { page: 1 })
         */
        getAll: async (path, params = {}) => {
            const response = await apiClient.get(path, { params });
            return response.data;
        },

        /**
         * Obtiene un registro por ID (GET)
         * @param {string} path - La ruta específica (ej. '/users')
         * @param {string|number} id - El identificador del registro
         */
        getById: async (path, id) => {
            const response = await apiClient.get(`${path}/${id}`);
            return response.data;
        },

        /**
         * Crea un nuevo registro (POST)
         * @param {string} path - La ruta específica
         * @param {object} data - Los datos a insertar
         */
        postData: async (path, data) => {
            const response = await apiClient.post(path, data);
            return response.data;
        },

        /**
         * Actualiza parcialmente un registro (PATCH)
         * @param {string} path - La ruta específica
         * @param {string|number} id - El identificador del registro
         * @param {object} data - Los datos a actualizar
         */
        patchData: async (path, id, data) => {
            const response = await apiClient.patch(`${path}/${id}`, data);
            return response.data;
        },

        /**
         * Actualiza un registro completamente (PUT)
         * @param {string} path - La ruta específica
         * @param {string|number} id - El identificador del registro
         * @param {object} data - Los datos a actualizar
         */
        putData: async (path, id, data) => {
            const response = await apiClient.put(`${path}/${id}`, data);
            return response.data;
        },

        /**
         * Elimina un registro (DELETE)
         * @param {string} path - La ruta específica
         * @param {string|number} id - El identificador del registro
         */
        deleteData: async (path, id) => {
            const response = await apiClient.delete(`${path}/${id}`);
            return response.data;
        },

        uploadFile: async (path, formData) => {

            const response = await apiClient.post(
                path,
                formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            );

            return response.data;
        }
    };
};
