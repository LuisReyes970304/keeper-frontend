import {fastApi} from "../../api/fastApi";

export const getAllReports = (params = {}) => fastApi.getAll('/reportes/', params);

export const getReportById = (id) => fastApi.getById('/reportes', id);

export const createReport = (reportData) => fastApi.postData('/reportes/', reportData);

export const updateReport = (id, reportData) => fastApi.putData('/reportes', id, reportData);

export const deleteReport = (id) => fastApi.deleteData('/reportes', id);
