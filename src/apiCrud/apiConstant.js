import { GetAxiosAnonym } from "./crud";

// const baseUrl = 'https://api.detambilgislem.biz.tr';
const baseUrl = 'http://192.168.1.131:45463';
 
export  const apiConstant = {
    IMAGEBASEURL: baseUrl + '/root/uploadedImages',
    SEARCH: baseUrl + '/api/Search/search', 
    GET_PRODUCT_BY_COMPANYID: baseUrl + '/api/Product/getProductByCompanyId',
    BaseUrl: baseUrl 

     
} 


 