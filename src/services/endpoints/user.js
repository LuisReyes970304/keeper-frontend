import {fastApi} from "../../api/fastApi";

export const getAllUsers = (params = {}) => fastApi.getAll('/usuarios/', params);

export const getUserById = (id) => fastApi.getById('/usuarios', id);

export const createUser = (userData) => fastApi.postData('/usuarios/', userData);

export const updateUser = (id, userData) => fastApi.putData('/usuarios', id, userData);

export const deleteUser = (id) => fastApi.deleteData('/usuarios', id);
