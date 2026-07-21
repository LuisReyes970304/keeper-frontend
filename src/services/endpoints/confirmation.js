import {fastApi} from "../../api/fastApi";


export const confirmReport = (reportData) => fastApi.postData('/confirmaciones/', reportData);

export const getConfirmation = (id) => fastApi.getById('/confirmaciones/reporte', id);