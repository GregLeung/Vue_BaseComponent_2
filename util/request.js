import axios from "axios";
import Util from "./util.js";
import store from "@/store/index";
axios.defaults.headers.common['API_KEY'] = store().state.api_key || "";
axios.defaults.headers.common['token'] = store().getters.token || "";
class Request {
  static getFile(vueInstance,
    action,
    params,
    fileName,
    successCallback = function() {},
    errorCallback = function() {}){
    axios({
      url: store().state.baseUrl + action,
      method: 'GET',
      responseType: 'blob',
      params: params,
      headers: {token: store().getters.token}
    }).then((res) => {
       const url = window.URL.createObjectURL(new Blob([res.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', fileName); //or any other extension
       document.body.appendChild(link);
       link.click();
       successCallback(res)
    }).catch(error => {
      vueInstance.$notify({
        title: "錯誤",
        message: error,
        type: "warning"
      });
      errorCallback(error);
    })
    .finally(() => {
      Util.loading().close();
    });;
  }
  static get(
    vueInstance,
    action,
    params,
    successCallback = function() {},
    errorCallback = function() {}
  ) {
    Util.loading();
    get(vueInstance, action, params, successCallback, errorCallback);
  }
  static getAsync(vueInstance, action, params) {
    Util.loading();
    return new Promise((resolve, reject) => {
      get(vueInstance, action, params, resolve, reject);
    });
  }
  static post(
    vueInstance,
    action,
    body,
    successCallback = function() {},
    errorCallback = function() {}
  ) {
    Util.loading();
    const headers = {
      "Content-Type": "application/json"
    };
    axios
      .post(store().state.baseUrl + action, body, {
        headers: headers
      })
      .then(res => {
        if (isError(res)) throw new Error(res.data.data);
        successCallback(res.data);
      })
      .catch(error => {
        vueInstance.$notify({
          title: "錯誤",
          message: error,
          type: "warning"
        });
        errorCallback(error);
      })
      .finally(() => {
        Util.loading().close();
      });
  }
  static uploadFile(
    file,
    url,
    successCallback = function() {},
    errorCallback = function() {}
  ) {
    Util.loading();
    let formData = new FormData();
    formData.append("file", file);
    axios
      .post(store().state.baseUrl + url, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        if (res.data.code != 200) throw res.data.data;
        successCallback(res.data);
      })
      .catch(error => {
        this.$notify({
          title: "Error",
          message: error,
          type: "warning"
        });
        errorCallback(error);
      })
      .finally(() => {
        Util.loading().close();
      });
  }
}

function get(vueInstance, action, params, successCallback, errorCallback) {
  axios
    .get(store().state.baseUrl + action, {
      params: params
    })
    .then(res => {
      if (isError(res)) throw new Error(res.data.data);
      res.data = jsonParse(res.data)
      successCallback(res.data);
    })
    .catch(error => {
      vueInstance.$notify({
        title: "錯誤",
        message: error,
        type: "warning"
      });
      errorCallback(error);
    })
    .finally(() => {
      Util.loading().close();
    });
}
function isError(res) {
  try {
    return res.data.code != 200;
  } catch (error) {
    return true;
  }
}

function jsonParse(parameter){
    var result = {}
      if(IsJsonString(parameter)){
        result = jsonParse(JSON.parse(parameter))
      }else if(Array.isArray(parameter)){
        result = parameter.map(f => jsonParse(f))
      }else if(parameter instanceof Object){
        for (const property in parameter) {
          result[property] = jsonParse(parameter[property])
        }     
      }
      else{
        result = parameter
      }
    
    return result
}

function IsJsonString(str) {
  try {
      var json = JSON.parse(str);
      return (typeof json === 'object' && json != null);
  } catch (e) {
      return false;
  }
}

export default Request;
