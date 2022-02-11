import Vuex from "vuex";
import Cookies from "js-cookie";
import LRU from "lru-cache";
class BaseStore extends Vuex.Store {
    constructor({ baseUrlEntry, frontEntry, api_key } = {}, options = {}) {
        options.state.baseUrlEntry = baseUrlEntry;
        options.state.frontEntry = frontEntry;
        options.state.api_key = api_key;
        BaseStore.initState(options);
        BaseStore.initMutations(options);
        BaseStore.initActions(options);
        BaseStore.initGetters(options);
        super(options);
    }

    static initState(options) {
        if (!options.hasOwnProperty("state")) options.state = {};
        options.state.cache = initCache();
        options.state.user = Cookies.get(options.state.frontEntry + "user") || null;
        options.state.token = Cookies.get(options.state.frontEntry + "token") || "";
        options.state.member = Cookies.get(options.state.frontEntry + "member") || null;
        options.state.memberToken = Cookies.get(options.state.frontEntry + "memberToken") || "";
        options.state.version = Cookies.get(options.state.frontEntry + "version") || null;
        options.state.loadingText = "Loading";
        options.state.loadingIcon = "el-icon-loading";
        options.state.loadingBackground = "rgba(0, 0, 0, 0.7)";
        (options.state.baseUrl = options.state.baseUrlEntry + "?ACTION="),
        (options.state.navigationBar = {
            isOpen: Cookies.get(options.state.frontEntry + "isNavigationBarOpened") ?
                !!+Cookies.get(options.state.frontEntry + "isNavigationBarOpened") : true
        });
        options.state.locale = Cookies.get(options.state.frontEntry + "locale") || "en";
        options.state.userAuth = [];
        options.state.currentPage = [];
    }
    static initMutations(options) {
        if (!options.hasOwnProperty("mutations")) options.mutations = {};
        options.mutations.TOGGLE_SIDEBAR = state => {
            state.navigationBar.isOpen = !state.navigationBar.isOpen;
            if (state.navigationBar.isOpen) {
                Cookies.set(options.state.frontEntry + "isNavigationBarOpened", 1);
            } else {
                Cookies.set(options.state.frontEntry + "isNavigationBarOpened", 0);
            }
        };
        options.mutations.SET_LOCALE = (state, locale) => {
            state.locale = locale;
            Cookies.set(options.state.frontEntry + "locale", locale);
        };
        options.mutations.SET_TOKEN = (state, token) => {
            Cookies.set(options.state.frontEntry + "token", token);
            state.token = Cookies.get(options.state.frontEntry + "token");
        };
        options.mutations.SET_USER = (state, user) => {
            Cookies.set(options.state.frontEntry + "user", user);
            state.user = Cookies.get(options.state.frontEntry + "user");
        };
        options.mutations.SET_MEMBER_TOKEN = (state, memberToken) => {
            Cookies.set(options.state.frontEntry + "memberToken", memberToken);
            state.memberToken = Cookies.get(options.state.frontEntry + "memberToken");
        };
        options.mutations.SET_MEMBER = (state, member) => {
            Cookies.set(options.state.frontEntry + "member", member);
            state.member = Cookies.get(options.state.frontEntry + "member");
        };
        options.mutations.SET_VERSION = (state, version) => {
            Cookies.set(options.state.frontEntry + "version", version);
            state.version = Cookies.get(options.state.frontEntry + "version");
        };
        options.mutations.SET_CACHE = (state, data) => {
            state.cache.set(data.key, data.value);
        };
        options.mutations.SET_CURRENTPAGE = (state, currentPage) => {
            state.currentPage = currentPage;
        };
    }
    static initActions(options) {
        if (!options.hasOwnProperty("actions")) options.actions = {};
        (options.actions.toggleSideBar = function({ commit }) {
            commit("TOGGLE_SIDEBAR");
        }),
        (options.actions.setLocale = function({ commit }, locale) {
            commit("SET_LOCALE", locale);
        }),
        (options.actions.setToken = function({ commit }, token) {
            commit("SET_TOKEN", token);
        }),
        (options.actions.setUser = function({ commit }, user) {
            commit("SET_USER", user);
        }),
        (options.actions.setMemberToken = function({ commit }, memberToken) {
            commit("SET_MEMBER_TOKEN", memberToken);
        }),
        (options.actions.setMember = function({ commit }, member) {
            commit("SET_MEMBER", member);
        }),
        (options.actions.setVersion = function({ commit }, version) {
            commit("SET_VERSION", version);
        }),
        (options.actions.setCache = function({ commit }, data) {
            commit("SET_CACHE", data);
        });
        options.actions.setCurrentPage = function({ commit }, currentPage) {
            commit("SET_CURRENTPAGE", currentPage);
        };
    }

    static initGetters(options) {
        if (!options.hasOwnProperty("getters")) options.getters = {};
        options.getters.isNavigationBarOpened = state => {
            return state.navigationBar.isOpen;
        };
        options.getters.user = state => {
            if (state.user == null) {
                var result = Cookies.get(options.state.frontEntry + "user") || null
                if (result != null && result != "")
                    return JSON.parse(result)
                else
                    return null
            } else
                return JSON.parse(state.user);
        };
        options.getters.member = state => {
            if (state.member == null) {
                var result = Cookies.get(options.state.frontEntry + "member") || null
                if (result != null && result != "")
                    return JSON.parse(result)
                else
                    return null
            } else
                return JSON.parse(state.member);
        };
        options.getters.version = state => {
            if (state.version == null) return null;
            return JSON.parse(state.version);
        };
        options.getters.userType = state => {
            if (state.user == null) return null;
            return JSON.parse(state.user).type;
        };
        options.getters.token = state => {
            if (state.token == null) {
                var result = Cookies.get(options.state.frontEntry + "token") || null
                if (result != null && result != "")
                    return token
                else
                    return null
            } else
                return state.token;
        };
        options.getters.memberToken = state => {
            if (state.memberToken == null) {
                var result = Cookies.get(options.state.frontEntry + "memberToken") || null
                if (result != null && result != "")
                    return memberToken
                else
                    return null
            } else
                return state.memberToken;
        };
        options.getters.cache = state => {
            return state.cache;
        };
        options.getters.userAuth = state => {
            return state.userAuth;
        };
        options.getters.getCache = state => (table, ID) => {
            return state.cache.get(table)[ID];
        };
    }
}

function initCache() {
    return new LRU({
        max: 500,
        length: function(n, key) {
            return n * 2 + key.length;
        },
        maxAge: 1000 * 60 * 60
    });
}
export default BaseStore;