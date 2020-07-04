import axios from "axios";
import Util from "./util.js";
import store from "@/store/index";
var Request = {
  get(
    vueInstance,
    action,
    params,
    successCallback = function() {},
    errorCallback = function() {},
  ) {
    Util.loading();
    axios
      .get(store().state.baseUrl + action, {
        params: params
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
  },
  getAsync(vueInstance, action,params){
    Util.loading();
    return new Promise((resolve, reject) => {
      axios
      .get(store().state.baseUrl + action, {
        params: params
      })
      .then(res => {
        if (isError(res)) throw new Error(res.data.data);
        resolve(res.data)
      })
      .catch(error => {
        vueInstance.$notify({
          title: "錯誤",
          message: error,
          type: "warning"
        });
        reject(error)
      })
      .finally(() => {
        Util.loading().close();
      });
    });
    
  },
  post(
    vueInstance,
    action,
    body,
    successCallback = function() {},
    errorCallback = function() {}
  ) {
    Util.loading();
    const headers = {
      'Content-Type': 'application/json',
    }
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
  },
  uploadFile(
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
};

function isError(res) {
  try {
    return res.data.code != 200;
  } catch (error) {
    return true;
  }
}
export default Request;
