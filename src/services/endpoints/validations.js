import {fastApi} from "../../api/fastApi";

export const validationReportData = (reportData) => fastApi.postData('/validaciones/', reportData);

export const getValidation = (id) => fastApi.getById('/validaciones/reporte', id);
