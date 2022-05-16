import axios from "axios";
import Util from "./util.js";
import store from "@/store/index";
// axios.defaults.headers.common['Apikey'] = store().state.api_key || "";
// axios.defaults.headers.common['Token'] = store().getters.token || "";
class Request {
    static defaultOptions() {
        return {
            showLoading: true,
            showErrorNotification: true
        }
    }
    static getBase64(vueInstance, url, params, successCallback = function(res) {}, errorCallback = function(error) {}, options = Request.defaultOptions()) {
        getBase64(vueInstance, url, params, successCallback, errorCallback, options)
    }
    static getBase64Async(vueInstance, url, params, options = Request.defaultOptions()) {
        return new Promise((resolve, reject) => {
            getBase64(vueInstance, url, params, resolve, reject, options);
        }).catch(error => {
            throw error
        });
    }
    static getFile(vueInstance,
        action,
        params,
        fileName,
        successCallback = function() {},
        errorCallback = function() {}, options = Request.defaultOptions()) {
        var headers = { Token: store().getters.token, Apikey: store().state.api_key }
        headers = (store().getters.hasOwnProperty("headers")) ? Object.assign(headers, store().getters.headers) : headers
        axios({
                url: store().state.baseUrl + action,
                method: 'GET',
                responseType: 'blob',
                params: params,
                headers: headers
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
                    message: getErrorMessage(error),
                    type: "warning"
                });
                errorCallback(error);
            })
            .finally(() => {
                if (options.showLoading != false) Util.loading().close();
            });;
    }
    static get(
        vueInstance,
        action,
        params,
        successCallback = function() {},
        errorCallback = function() {},
        options = Request.defaultOptions(),
    ) {
        get(vueInstance, action, params, successCallback, errorCallback, options);
    }
    static getAsync(vueInstance, action, params, options = Request.defaultOptions()) {
        return new Promise((resolve, reject) => {
            get(vueInstance, action, params, resolve, reject, options);
        }).catch(error => {
            throw error
        });
    }
    static post(
        vueInstance,
        action,
        body,
        successCallback = function() {},
        errorCallback = function() {},
        options = Request.defaultOptions()
    ) {
        if (options.showLoading != false) Util.loading();
        var headers = {
            "Content-Type": "application/json",
            "Token": store().getters.token == null ? "" : store().getters.token,
            Apikey: store().state.api_key
        }
        headers = (store().getters.hasOwnProperty("headers")) ? Object.assign(headers, store().getters.headers) : headers
        axios
            .post(store().state.baseUrl + action, body, {
                headers: headers
            })
            .then(res => {
                if (isError(res)) throw new NetworkError(res)
                cleanCache()
                successCallback(res.data);
            })
            .catch(error => {
                networkErrorHandling(vueInstance, error)
                console.log(error);
                vueInstance.$notify({
                    title: "Error",
                    message: getErrorMessage(error),
                    type: "warning"
                });
                errorCallback(error);
            })
            .finally(() => {
                if (options.showLoading != false) Util.loading().close();
            });
    }
    static postAsync(vueInstance, action, body, options = Request.defaultOptions()) {
        return new Promise((resolve, reject) => {
            Request.post(vueInstance, action, body, resolve, reject, options);
        }).catch(error => {
            throw error
        });
    }
    static uploadFile(
        vueInstance,
        url,
        file,
        limitSize,
        limitType,
        successCallback = function() {},
        errorCallback = function() {},
        options = Request.defaultOptions()
    ) {
        try {
            if (file.size / 1024 / 1024 > limitSize) throw new Error(vueInstance.$t("File Size Too large"))
            if (!limitType.includes(file.type)) throw new Error(vueInstance.$t("Wrong File Type"))
            if (options.showLoading != false) Util.loading();
            let formData = new FormData();
            formData.append("file", file);
            var headers = {
                "Content-Type": "multipart/form-data",
                Apikey: store().state.api_key
            }
            headers = (store().getters.hasOwnProperty("headers")) ? Object.assign(headers, store().getters.headers) : headers
            axios
                .post(store().state.baseUrl + url, formData, {
                    headers: headers
                })
                .then(res => {
                    if (res.data.code != 200) throw new NetworkError(res)
                    successCallback(res.data);
                })
                .catch(error => {
                    console.log(error)
                    vueInstance.$notify({
                        title: "Error",
                        message: getErrorMessage(error),
                        type: "warning"
                    });
                    errorCallback(error);
                })
                .finally(() => {
                    if (options.showLoading != false) Util.loading().close();
                });
        } catch (error) {
            errorCallback(error);
            vueInstance.$notify({
                title: vueInstance.$t('Error'),
                message: getErrorMessage(error),
                type: "warning"
            });
        }
    }
    static uploadFileAsync(vueInstance, url, file, limitSize, limitType, options = Request.defaultOptions()) {
        return new Promise((resolve, reject) => {
            this.uploadFile(vueInstance, url, file, limitSize, limitType, resolve, reject, options);
        }).catch(error => {
            console.log(error)
            throw error
        });
    }
    static async requestAll(asyncTasks) {
        Util.loading()
        await Promise.all(asyncTasks);
        Util.loading().close()
    }
}

function getFromCache(key) {
    try {
        return store().state.cache.get(key);
    } catch (e) {
        return null
    }
}

function cleanCache(key) {
    if (store().state.cache != null)
        store().state.cache.reset()
}

function getBase64(vueInstance, url, params, successCallback, errorCallback, options) {
    options = assignOptions(options)
    axios.get(url, { params: params, responseType: "arraybuffer" }, ).then((res) => {
        successCallback("data:image/jpeg;base64," + Buffer.from(res.data, 'binary').toString('base64'))
    }).catch(e => {
        vueInstance.$notify({
            title: "Error",
            message: getErrorMessage(error),
            type: "warning"
        });
        errorCallback(error);
    }).finally(() => {
        if (options.showLoading != false) Util.loading().close();
    });
}

function get(vueInstance, action, params, successCallback, errorCallback, options) {
    options = assignOptions(options)
    if (getFromCache(store().state.baseUrl + action + "/" + JSON.stringify(params)) != null) {
        successCallback(getFromCache(store().state.baseUrl + action + "/" + JSON.stringify(params)));
    } else {
        if (options.showLoading != false) Util.loading()
        var headers = {
            "Token": store().getters.token == null ? "" : store().getters.token,
            Apikey: store().state.api_key
        }
        headers = (store().getters.hasOwnProperty("headers")) ? Object.assign(headers, store().getters.headers) : headers
        axios.get(store().state.baseUrl + action, {
                params: params,
                headers: headers
            })
            .then(res => {
                if (isError(res)) throw new NetworkError(res);
                res.data = jsonParse(res.data)
                store().dispatch("setCache", { key: store().state.baseUrl + action + "/" + JSON.stringify(params), value: res.data });
                // setPayloadToCache(res.data)
                successCallback(res.data);
            })
            .catch(error => {
                networkErrorHandling(vueInstance, error)
                if (options.showErrorNotification == false)
                    vueInstance.$notify({ title: "Error", message: getErrorMessage(error), type: "warning" });
                errorCallback(error);
            })
            .finally(() => {
                if (options.showLoading != false) Util.loading().close();
            });
    }
}

function setPayloadToCache(response) {
    if (response.hasOwnProperty("payload") && response.payload == true) {
        for (const [key, value] of Object.entries(response.data)) {
            var result = dataModelArrayToMap(value)
            var cacheData = getFromCache(key)
            if (cacheData == null) {
                store().dispatch("setCache", { key: key, value: result });
            } else {
                for (const key in Object.keys(result)) {
                    cacheData[key] = result[key]
                }
                store().dispatch("setCache", { key: key, value: cacheData });
            }
        }
    }
}

function getErrorMessage(error) {
    if (error.data != null)
        var message = error.data
    else
        message = error
    return message
}

function dataModelArrayToMap(data) {
    var result = {};
    if (Array.isArray(data)) {
        data.forEach(f => {
            result[f.ID] = f
        })
    } else
        result[data.ID] = data
    return result
}

function isError(res) {
    try {
        return res.data.code != 200;
    } catch (error) {
        return true;
    }
}

function jsonParse(parameter) {
    var result = {}
    if (IsJsonString(parameter)) {
        result = jsonParse(JSON.parse(parameter))
    } else if (Array.isArray(parameter)) {
        result = parameter.map(f => jsonParse(f))
    } else if (parameter instanceof Object) {
        for (const property in parameter) {
            result[property] = jsonParse(parameter[property])
        }
    } else {
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

function assignOptions(options) {
    if (!"showLoading" in options) options.showLoading = true
    if (!"showErrorNotification" in options) options.showErrorNotification = true
    return options
}

function networkErrorHandling(vueInstance, error) {
    if (error instanceof NetworkError) {
        switch (error.code) {
            case -2:
                store().dispatch('setToken', "")
                store().dispatch('setUser', null)
                break
            case -3:
                vueInstance.$router.push({ "path": "/Exception/no_permission" });
                Util.loading().close()
                break
        }
    }
}

function NetworkError(response) {
    if (Util.isJSONObject(response.data)) {
        this.message = response.data.message
        this.code = response.data.code
        this.data = response.data.data
    } else
        this.error = response.data
}
NetworkError.prototype = new Error();
export default Request;