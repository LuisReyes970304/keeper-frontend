import {fastApi} from "../../api/fastApi";

export const getAllContacts = (params = {}) => fastApi.getAll('/contactos/', params);

export const getContactById = (id) => fastApi.getById('/contactos', id); 

export const createContact = (contactData) => fastApi.postData('/contactos/', contactData); 

export const updateContact = (id, contactData) => fastApi.putData('/contactos', id, contactData); 

export const deleteContact = (id) => fastApi.deleteData('/contactos', id);
