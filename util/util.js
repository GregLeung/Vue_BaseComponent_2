import store from "@/store/index";
import { Loading } from 'element-ui';
class Util {
  static loading() {
    return Loading.service({
      lock: true,
      text: store().state.loadingText,
      spinner: store().state.loadingIcon,
      background: store().state.loadingBackground
    });
  }
  static goToUrl(url, parameters){
    var url = new URL(url)
    url.search = new URLSearchParams(parameters)
    location.href = url.href
  }
};

export default Util;
