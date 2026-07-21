import {fastApi} from "../../api/fastApi";

export const getAllSos = (params = {}) => fastApi.getAll('/sos/', params);

export const createSos = (sosData) => fastApi.postData('/sos/', sosData);

export const updateSos = (id, sosData) => fastApi.putData('/sos', id, sosData);
