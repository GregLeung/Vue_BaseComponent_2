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
    options.state.user = Cookies.get("user") || null;
    options.state.token = Cookies.get("token") || "";
    options.state.loadingText = "Loading";
    options.state.loadingIcon = "el-icon-loading";
    options.state.loadingBackground = "rgba(0, 0, 0, 0.7)";
    (options.state.baseUrl = options.state.baseUrlEntry + "?ACTION="),
      (options.state.navigationBar = {
        isOpen: Cookies.get("isNavigationBarOpened")
          ? !!+Cookies.get("isNavigationBarOpened")
          : true
      });
    options.state.locale = Cookies.get("locale") || "en";
    options.state.userAuth = [];
    options.state.currentPage = [];
  }
  static initMutations(options) {
    if (!options.hasOwnProperty("mutations")) options.mutations = {};
    options.mutations.TOGGLE_SIDEBAR = state => {
      state.navigationBar.isOpen = !state.navigationBar.isOpen;
      if (state.navigationBar.isOpen) {
        Cookies.set("isNavigationBarOpened", 1);
      } else {
        Cookies.set("isNavigationBarOpened", 0);
      }
    };
    options.mutations.SET_LOCALE = (state, locale) => {
      state.locale = locale;
      Cookies.set("locale", locale);
    };
    options.mutations.SET_TOKEN = (state, token) => {
      Cookies.set("token", token);
      state.token = Cookies.get("token");
    };
    options.mutations.SET_USER = (state, user) => {
      Cookies.set("user", user);
      state.user = Cookies.get("user");
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
      if (state.user == null) return null;
      return JSON.parse(state.user);
    };
    options.getters.userType = state => {
      if (state.user == null) return null;
      return JSON.parse(state.user).type;
    };
    options.getters.token = state => {
      return state.token;
    };
    options.getters.cache = state => {
      return state.cache;
    };
    options.getters.userAuth = state => {
      return state.userAuth;
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
