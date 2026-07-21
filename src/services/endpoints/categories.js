import {fastApi} from "../../api/fastApi";


export const getAllCategories = (params = {}) => fastApi.getAll('/categorias/', params);

export const getCategoryById = (id) => fastApi.getById('/categorias', id);

export const createCategory = (categoryData) => fastApi.postData('/categorias/', categoryData);

export const updateCategory = (id, categoryData) => fastApi.putData('/categorias', id, categoryData);

export const deleteCategory = (id) => fastApi.deleteData('/categorias', id);