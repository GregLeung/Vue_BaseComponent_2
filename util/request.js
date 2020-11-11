import axios from "axios";
import Util from "./util.js";
import store from "@/store/index";
axios.defaults.headers.common['Apikey'] = store().state.api_key || "";
axios.defaults.headers.common['Token'] = store().getters.token || "";
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
      headers: {Token: store().getters.token}
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
    axios
      .post(store().state.baseUrl + action, body, {
        headers: {
          "Content-Type": "application/json",
          "Token": store().getters.token
        }
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
    vueInstance,
    url,
    file,
    limitSize,
    limitType,
    successCallback = function() {},
    errorCallback = function() {}
  ) {
    try{
      if(file.size/1024/1024 > limitSize) throw new Error(vueInstance.$t("File Size Too large"))
      if(!limitType.includes(file.type)) throw new Error(vueInstance.$t("Wrong File Type"))
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
          vueInstance.$notify({
            title: "Error",
            message: error,
            type: "warning"
          });
          errorCallback(error);
        })
        .finally(() => {
          Util.loading().close();
        });
    }catch(error){
      vueInstance.$notify({
        title: vueInstance.$t('Error'),
        message: error,
        type: "warning"
      });
    }
  }
}

function get(vueInstance, action, params, successCallback, errorCallback) {
  axios
    .get(store().state.baseUrl + action, {
      params: params,
      headers: {
        "Token": store().getters.token
      }
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
