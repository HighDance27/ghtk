// import axios from "axios";
import axios from './axios.customize';

const fetchAllProductAPI = () => {
    const URL_BACKEND = "/v1/api/products/all";
    return axios.get(URL_BACKEND);
}
const fetchProductByIdAPI = (id) => {
    const URL_BACKEND = `/v1/api/products/${id}`;
    return axios.get(URL_BACKEND);
}
const createOrderAPI = (note, return_name, return_address, return_province,
    return_district, return_ward, return_street, return_tel, return_email) => {
    const URL_BACKEND = `/v1/api/orders`;
    const data = {
        return_name: return_name,
        return_address: return_address,
        return_province: return_province,
        return_district: return_district,
        return_ward: return_ward,
        return_street: return_street,
        return_tel: return_tel,
        return_email: return_email,
        note: note
    }
    return axios.post(URL_BACKEND, data);
}
const updateBookAPI = (_id, thumbnail, mainText, author, price, quantity, category,) => {
    const URL_BACKEND = `/api/v1/book`;
    const data = {
        _id: _id,
        thumbnail: thumbnail,
        mainText: mainText,
        author: author,
        price: price,
        quantity: quantity,
        category: category
    }
    return axios.put(URL_BACKEND, data);
}
const deleteBookAPI = (id) => {
    const URL_BACKEND = `/api/v1/book/${id}`;
    return axios.delete(URL_BACKEND);
}
export {
    fetchAllProductAPI, createOrderAPI,
    updateBookAPI, deleteBookAPI, fetchProductByIdAPI
}