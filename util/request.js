import axios from "axios";
import Util from "./util.js";
import store from "@/store/index";
axios.defaults.headers.common['Apikey'] = store().state.api_key || "";
axios.defaults.headers.common['Token'] = store().getters.token || "";
class Request {
  static defaultOptions(){
    return {
      showLoading: true,
      showErrorNotification: true
    }
  }
  static getFile(vueInstance,
    action,
    params,
    fileName,
    successCallback = function() {},
    errorCallback = function() {}, options = {}){
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
        title: "Error",
        message: error.data,
        type: "warning"
      });
      errorCallback(error);
    })
    .finally(() => {
      if(options.showLoading != false) Util.loading().close();
    });;
  }
  static get(
    vueInstance,
    action,
    params,
    successCallback = function() {},
    errorCallback = function() {},
    options = {},
  ) {
    get(vueInstance, action, params, successCallback, errorCallback, options);
  }
  static getAsync(vueInstance, action, params, options = Request.defaultOptions()) {
    return new Promise((resolve, reject) => {
      get(vueInstance, action, params, resolve, reject, options);
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
        if (isError(res)) throw new NetworkError(res.data.message, res.data.code, res.data.data)
        cleanCache()
        successCallback(res.data);
      })
      .catch(error => {
        networkErrorHandling(error)
        console.log(error);
        vueInstance.$notify({
          title: "Error",
          message: error.data,
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
          if (res.data.code != 200) throw new NetworkError(res.data.message, res.data.code, res.data.data)
          successCallback(res.data);
        })
        .catch(error => {
          vueInstance.$notify({
            title: "Error",
            message: error.data,
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
        message: error.data,
        type: "warning"
      });
    }
  }
  static async requestAll(asyncTasks){
    Util.loading()
    await Promise.all(asyncTasks);
    Util.loading().close()
  }
}

function getFromCache(key){ 
  if(store().state.cache == null)
    return null
  return store().state.cache.get(key);
}

function cleanCache(key){ 
  if(store().state.cache != null)
    store().state.cache.reset()
}


function get(vueInstance, action, params, successCallback, errorCallback, options) {
  options = assignOptions(options)
  if(getFromCache(store().state.baseUrl + action + "/" + JSON.stringify(params)) != null){
    successCallback(getFromCache(store().state.baseUrl + action + "/" + JSON.stringify(params)));
  }else{
    if(options.showLoading != false) Util.loading()
    axios.get(store().state.baseUrl + action, {
        params: params,
        headers: {
          "Token": store().getters.token
        }
      })
      .then(res => {
        if (isError(res)) throw new NetworkError(res.data.message, res.data.code, res.data.data);
        res.data = jsonParse(res.data)
        store().dispatch("setCache", {key: store().state.baseUrl + action + "/" + JSON.stringify(params), value: res.data});
        successCallback(res.data);
      })
      .catch(error => {
        networkErrorHandling(error)
        if(options.showErrorNotification == false)
          vueInstance.$notify({title: "Error",message: error.data,type: "warning"});
        errorCallback(error);
      })
      .finally(() => {
        if(options.showLoading != false) Util.loading().close();
      });
  }
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

function assignOptions(options){
  if(!"showLoading" in options) options.showLoading = true
  if(!"showErrorNotification" in options) options.showErrorNotification = true
  return options
}

function networkErrorHandling(error){
  if(error instanceof NetworkError){
    switch(error.code){
      case -2:
        store().dispatch('setToken', "")
        store().dispatch('setUser', null)
      break
    }
  }
}

function NetworkError(message, code, data) {
  this.message = message
  this.code = code
  this.data = data
}
NetworkError.prototype = new Error();
export default Request;
