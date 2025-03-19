// import axios from "axios";
import axios from './axios.customize';
import axiosStandard from 'axios';

const fetchAllProductAPI = () => {
    const URL_BACKEND = "/v1/api/products/all";
    return axios.get(URL_BACKEND);
}
const fetchProductByIdAPI = (id) => {
    const URL_BACKEND = `/v1/api/products/${id}`;
    return axios.get(URL_BACKEND);
}
// const createOrderAPI = (note, return_name, return_address, return_province,
//     return_district, return_ward, return_street, return_tel, return_email) => {
//     const URL_BACKEND = `/v1/api/orders`;
//     const data = {
//         return_name: return_name,
//         return_address: return_address,
//         return_province: return_province,
//         return_district: return_district,
//         return_ward: return_ward,
//         return_street: return_street,
//         return_tel: return_tel,
//         return_email: return_email,
//         note: note
//     }
//     return axios.post(URL_BACKEND, data);
// }
const createInvoiceAPI = () => {
    const URL_BACKEND = "/v1/api/invoices";
    return axios.post(URL_BACKEND, {});
};

const addProductToInvoiceAPI = (invoiceId, productId, quantity, price) => {
    const URL_BACKEND = `/v1/api/invoices/add-product/${invoiceId}`;
    const data = {
        product_id: productId,
        quantity: quantity,
        price: price
    };
    return axios.post(URL_BACKEND, data);
};


const createOrderAPI = (orderData) => {
    const URL_BACKEND = `/v1/api/orders`;
    return axios.post(URL_BACKEND, orderData);
}
const createVNPayPaymentAPI = (amount) => {
    return axios.get(`/api/vnpay/create-payment?amount=${amount}`);
};

const fetchProvincesAPI = (searchText = '') => {
    //Dùng axiosStandard để gọi api bên ngoài nha An
    return axiosStandard.get('https://open.oapi.vn/location/provinces', {
        params: {
            page: 0,
            size: 63,
            query: searchText
        }
    });
};

const fetchDistrictsAPI = (provinceId, searchText = '') => {
    return axiosStandard.get(`https://open.oapi.vn/location/districts/${provinceId}`, {
        params: {
            page: 0,
            size: 30,
            query: searchText
        }
    });
};

const fetchWardsAPI = (districtId, searchText = '') => {
    return axiosStandard.get(`https://open.oapi.vn/location/wards/${districtId}`, {
        params: {
            page: 0,
            size: 30,
            query: searchText
        }
    });
};

export {
    fetchAllProductAPI, createOrderAPI,
    createInvoiceAPI,
    addProductToInvoiceAPI,
    fetchProductByIdAPI,
    createVNPayPaymentAPI,
    fetchProvincesAPI,
    fetchDistrictsAPI,
    fetchWardsAPI
}