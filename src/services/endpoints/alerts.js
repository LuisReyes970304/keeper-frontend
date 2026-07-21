import {fastApi} from "../../api/fastApi";

export const getAllAlerts = (params = {}) => fastApi.getAll('/alertas/', params);

export const getAlertById = (id) => fastApi.getById('/alertas', id);

export const createAlert = (alertData) => fastApi.postData('/alertas/', alertData);