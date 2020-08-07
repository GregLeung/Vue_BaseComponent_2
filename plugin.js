import moment from "moment";
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
        hashPassword(password){
          if(password === "") return password;
          return sha256(password)
        }
      },
    });
  },
};

function checkValidationRules(vueInstance, prop) {
  for (let i = 0; i < prop.rules.length; i++) {
    var rule = prop.rules[i];
    switch (rule.type) {
      case "REQUIRED":
        if (prop.value == null || prop.value == "") {
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
