import {fastApi} from "../../api/fastApi";


export const getAllStatus = (params = {}) => fastApi.getAll('/estados_reporte/', params);

export const getStatusById = (id) => fastApi.getById('/estados_reporte', id);

export const createStatus = (statusData) => fastApi.postData('/estados_reporte/', statusData);

export const updateStatus = (id, statusData) => fastApi.putData('/estados_reporte', id, statusData);

export const deleteStatus = (id) => fastApi.deleteData('/estados_reporte', id);
