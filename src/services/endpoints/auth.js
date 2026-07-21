import {fastApi} from "../../api/fastApi";
import {fastApi2} from "../../api/fastApi";

export const authenticateLogin = (loginData) => fastApi.postData('/auth/login', loginData);

export const authenticateRegister = (registerData) => fastApi.postData('/auth/register', registerData);

export const authenticateLogout = () => fastApi.postData('/auth/logout/', {});