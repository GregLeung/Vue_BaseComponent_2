import moment from "moment";
import { sha256 } from "js-sha256";
const Plugin = {
  install(Vue, options) {
    Vue.mixin({
      methods: {
        successPrompt(title = this.$t("Success"), message = "") {
          this.$notify({
            title: title,
            message: message,
            type: "success",
          });
        },
        prompt(title = this.$t("Error"), message = "", type = "warning") {
          this.$notify({
            title: title,
            message: message,
            type: type,
          });
        },
        deepClone(object){
          return JSON.parse(JSON.stringify(object))
        },
        isObjectEmpty(object) {
          return (
            Object.keys(object).length === 0 && object.constructor === Object
          );
        },
        isObjectEquivalent(a, b) {
          a = JSON.parse(JSON.stringify(a));
          b = JSON.parse(JSON.stringify(b));
          var aProps = Object.getOwnPropertyNames(a);
          var bProps = Object.getOwnPropertyNames(b);
          if (aProps.length != bProps.length) {
            return false;
          }
          for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (a[propName] !== b[propName]) {
              return false;
            }
          }
          return true;
        },
        checkValidate(propList) {
          for (let i = 0; i < propList.length; i++) {
            if (checkValidationRules(this, propList[i]) == false) return false;
          }
          return true;
        },
        formateDate(value) {
          if (value != null) return moment(value).format("yyyy-MM-DD");
          else return "";
        },
        hashPassword(password) {
          if (password === "" || password == null) return password;
          return sha256(password);
        },
        getImgUrl(image) {
          return require("@/assets/" + image);
        },
        notNullNotEmpty(value) {
          return !(value == null || value == '' || value.length == 0)
        },
      },
    });
  },
};

function checkValidationRules(vueInstance, prop) {
  for (let i = 0; i < prop.rules.length; i++) {
    var rule = prop.rules[i];
    switch (rule.type) {
      case "REQUIRED":
        if (prop.value == null || prop.value === "") {
          vueInstance.$message.error(rule.message);
          return false;
        }
        break;
      case "IS_INT":
        if (!isInt(prop.value)) {
          vueInstance.$message.error(rule.message);
          return false;
        }
        break;
      case "CHARACTER_LENGTH_LIMIT":
        if (!isLengthLessThan(prop.value, rule.length)) {
          vueInstance.$message.error(rule.message);
          return false;
        }
        break;
      case "ARRAY_LENGTH_SHOULD_LARGER":
        if (!Array.isArray(prop.value) || prop.value.length <= rule.length) {
          vueInstance.$message.error(rule.message);
          return false;
        }
        break;
    }
  }
  return true;
}

function isInt(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
}

function isLengthLessThan(value, length) {
  return value.length <= length;
}

export default Plugin;
