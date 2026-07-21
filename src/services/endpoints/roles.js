import {fastApi} from "../../api/fastApi";

export const getAllRoles = (params = {}) => fastApi.getAll('/roles/', params);

export const getRoleById = (id) => fastApi.getById('/roles', id);

export const createRole = (roleData) => fastApi.postData('/roles/', roleData);

export const updateRole = (id, roleData) => fastApi.putData('/roles', id, roleData);

export const deleteRole = (id) => fastApi.deleteData('/roles', id);
