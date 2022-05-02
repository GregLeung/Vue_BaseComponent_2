import axios from "axios";
import store from "@/store/index";
import { Loading } from "element-ui";
const https = require('https');
// axios.defaults.headers.common['Apikey'] = store().state.api_key || "";
var baseUrl = store().state.baseUrlEntry + "?ACTION="
class Request {
    static rawGet(action, params) {
        return axios.get(baseUrl + action, {
            params: params,
            headers: Request.getDefaultHeader(),
            httpsAgent: Request.getAgent()
        })
    }
    static rawPost(action, body) {
        return axios.post(baseUrl + action, body, {
            headers: Request.getDefaultHeader(),
            httpsAgent: Request.getAgent()
        })
    }

    static get(action, params, options) {
        if (options != null && options.showLoading == true)
            loading()
        return new Promise((resolve, reject) => {
            this.rawGet(action, params).then(res => {
                if (isError(res)) throw new NetworkError(res)
                resolve(res.data)
            }).catch(error => {
                reject(getErrorMessage(error))
            }).finally(() => {
                if (options != null && options.showLoading == true)
                    loading().close()
            })
        })
    }

    static post(action, body) {
        loading()
        return new Promise((resolve, reject) => {
            this.rawPost(action, body).then(res => {
                if (isError(res)) throw new NetworkError(res)
                resolve(res.data)
            }).catch(error => {
                reject(getErrorMessage(error))
            }).finally(() => {
                loading().close()
            })
        })
    }
    static getDefaultHeader() {
        var headers = {
            "Content-Type": "application/json",
            Apikey: store().state.api_key
        }
        var memberToken = store().getters.memberToken
        if (memberToken != "" && memberToken != null) {
            headers["Membertoken"] = memberToken
        }
        var token = store().getters.token
        if (token != "" && token != null) {
            headers["Token"] = token
        }
        var sessionID = store().getters.sessionID
        if (sessionID != "" && sessionID != null) {
            headers["Sessionid"] = sessionID
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
        message = error
    return message
}
export default Request