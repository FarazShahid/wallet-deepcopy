import axios from "axios";

export default {
    registerUser: function (userData) {
        return axios.post(process.env.REACT_APP_API+"/api/user/register", userData);
    },
    loginUser: function (userData) {
        return axios.post(process.env.REACT_APP_API+"/api/user/login", userData);
    },
    passwordLessLogin: function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/user/passwordLessLogin",userData)
    },
    forgot : function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/user/forgot",userData)
    },
    getCurrencies:function(userData){
        return axios.get(process.env.REACT_APP_API+"/api/user/getCurrencies")
    },
    changePassword : function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/user/changePassword",userData)
    },
    verifyEmail : function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/user/verifyEmail",userData)
    },
    sendVerificationEmail:function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/user/sendVerificationEmail",userData)
    },
    loadWallet:function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/user/loadWallet",userData)
    },
    getProducts:function(){
        return axios.get(process.env.REACT_APP_API+"/api/products")
    },
    placeOrder:function(orderData){
        return axios.post(process.env.REACT_APP_API+"/api/order/create",orderData)
    },
    getOrders:function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/order",userData)
    },
    refundOrder:function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/order/refund",userData)
    },
    getCustomers:function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/user",userData)
    },
    getWallet:function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/user/getWallet",userData)
    },
    deleteUser:function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/user/delete",userData)
    },
    addBalance:function(userData){
        return axios.post(process.env.REACT_APP_API+"/api/deposit/balance",userData)
    },
}
