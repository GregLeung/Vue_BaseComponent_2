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
};

export default Util;
