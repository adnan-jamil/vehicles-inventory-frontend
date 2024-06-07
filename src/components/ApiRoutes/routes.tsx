export const BASE_URL = 'http://127.0.0.1:3002';
type API_ENDPOINTS = {

    GetInventory: string
    GetBrands: string
    GetFIlterData: string
};

const API_ENDPOINTS: API_ENDPOINTS = {
    GetInventory: BASE_URL + "/api/inventory",
    GetBrands: BASE_URL + '/api/inventory/brands',
    GetFIlterData: BASE_URL + "/api/inventory/filter",


};

export default API_ENDPOINTS;