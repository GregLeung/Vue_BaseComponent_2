import axios from "axios";
import store from "@/store/index";
import { Loading } from "element-ui";
const crypto = require('crypto');
const https = require('https');
const moment = require("moment")
import config from "@/static/config.json";

class Request {
    static rawPost(action, body) {
        return axios.post(config.baseUrl + action, body, {
            headers: Request.getDefaultHeader(),
            httpsAgent: Request.getAgent()
        })
    }
    static rawGet(action, params) {
        return axios.post(config.baseUrl + action, params, {
            headers: Request.getDefaultHeader(),
            httpsAgent: Request.getAgent()
        })
    }
    static rawPut(action, params) {
        return axios.put(config.baseUrl + action, params, {
            headers: Request.getDefaultHeader(),
            httpsAgent: Request.getAgent()
        })
    }
    static rawDelete(action, params) {
        return axios.put(config.baseUrl + action, params, {
            headers: Request.getDefaultHeader(),
            httpsAgent: Request.getAgent()
        })
    }
    static get(action, params, options) {
        if (options == null || options.showLoading == true)
            loading()
        return new Promise((resolve, reject) => {
            this.rawGet("get/"+ action, params).then(res => {
                if (isError(res)) throw new NetworkError(res)
                resolve(res.data)
            }).catch(error => {
                reject(getErrorMessage(error))
            }).finally(() => {
                if (options == null || options.showLoading == true)
                    loading().close()
            })
        })
    }
    static post(action, body, options) {
        if (options == null || options.showLoading == true)
            loading()
        return new Promise((resolve, reject) => {
            this.rawPost(action, body).then(res => {
                if (isError(res)) throw new NetworkError(res)
                resolve(res.data)
            }).catch(error => {
                reject(getErrorMessage(error))
            }).finally(() => {
                if (options == null || options.showLoading == true)
                    loading().close()
            })
        })
    }
    static put(action, body, options) {
        if (options == null || options.showLoading == true)
            loading()
        return new Promise((resolve, reject) => {
            this.rawPut(action, body).then(res => {
                if (isError(res)) throw new NetworkError(res)
                resolve(res.data)
            }).catch(error => {
                reject(getErrorMessage(error))
            }).finally(() => {
                if (options == null || options.showLoading == true)
                    loading().close()
            })
        })
    }

    static delete(action, body, options) {
        if (options == null || options.showLoading == true)
            loading()
        return new Promise((resolve, reject) => {
            this.rawDelete(action, body).then(res => {
                if (isError(res)) throw new NetworkError(res)
                resolve(res.data)
            }).catch(error => {
                reject(getErrorMessage(error))
            }).finally(() => {
                if (options == null || options.showLoading == true)
                    loading().close()
            })
        })
    }
    static uploadFile(action, file, limitSize ,limitType) {
        if (file.size / 1024 / 1024 > limitSize) throw new Error("File Size Too large")
        if (!limitType.includes(file.type)) throw new Error("Wrong File Type")
        let formData = new FormData();
        formData.append("file", file);
        return axios.post(config.baseUrl + action, formData, {
            headers: Request.getDefaultHeader(),
            httpsAgent: Request.getAgent()
        })
    }
    static getDefaultHeader() {
        var sha = crypto.createHash("sha256")
        var headers = {
            "Content-Type": "application/json",
            Apikey: store().state.api_key,
            secret: sha.update(moment().format("yyyy-MM-DD") + store().state.api_key).digest("hex")
        }
        var memberToken = store().getters.memberToken
        if (memberToken != "" && memberToken != null) {
            headers["Membertoken"] = memberToken
        }
        var token = store().getters.token
        if (token != "" && token != null) {
            headers["Token"] = token
        }

        return headers
    }
    static getAgent() {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        return agent
    }
}
function isError(res) {
    try {
        return res.data.code != 200;
    } catch (error) {
        return true;
    }
}
function loading() {
    return Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
    });
}
function NetworkError(response) {
    if (isJSONObject(response.data)) {
        this.message = response.data.message
        this.code = response.data.code
        this.data = response.data.data
    } else
        this.error = response.data
}
function isJSONObject(object) {
    return typeof object === 'object' && object !== null
}
function getErrorMessage(error) {
    if (error.data != null)
        var message = error.data
    else
        message = error.message
    return message
}
export default Request