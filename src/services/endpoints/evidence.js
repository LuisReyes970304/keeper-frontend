import {fastApi} from "../../api/fastApi";

export const createEvidence = (formData) => fastApi.uploadFile("/evidencias/",formData);
