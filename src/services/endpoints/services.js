import {fastApi} from "../../api/fastApi";

export const getAllServices = (params = {}) => fastApi.getAll('/servicios_emergencia/', params);

export const getServiceById = (id) => fastApi.getById('/servicios_emergencia', id);

export const createService = (serviceData) => fastApi.postData('/servicios_emergencia/', serviceData);

export const updateService = (id, serviceData) => fastApi.putData('/servicios_emergencia', id, serviceData);

export const deleteService = (id) => fastApi.deleteData('/servicios_emergencia', id);
