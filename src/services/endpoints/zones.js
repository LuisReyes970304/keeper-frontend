import {fastApi} from "../../api/fastApi";

export const getAllZones = (params = {}) => fastApi.getAll('/zonas/', params);

export const getZoneById = (id) => fastApi.getById('/zonas', id);

export const createZone = (zoneData) => fastApi.postData('/zonas/', zoneData);

export const updateZone = (id, zoneData) => fastApi.putData('/zonas', id, zoneData);

export const deleteZone = (id) => fastApi.deleteData('/zonas', id);
