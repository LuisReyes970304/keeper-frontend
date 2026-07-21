import {fastApi} from "../../api/fastApi";

export const getAllNotifications = (params = {}) => fastApi.getAll('/notificaciones/', params);

export const createNotification = (notificationData) => fastApi.postData('/notificaciones/', notificationData);

export const tickNotification = (id) => fastApi.putData('/notificaciones', `${id}/leida`, {});
