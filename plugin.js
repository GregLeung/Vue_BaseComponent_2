import moment from "moment";
import Vue from 'vue'
import _ from 'lodash';
import Swal from 'sweetalert2'
import $ from 'jquery'

import {
    BaseFooter,
    BaseTable,
    BasePagingTable,
    NodeBasePagingTable,
    BaseUploadButton,
    CMSHeader,
    NavigationBar,
    NavigationBarToggleButton,
    LoginContainerBox,
    LoginInput,
    BaseCamera,
    CMSForm,
    CMSFormInput,
    CMSDatePicker,
    CMSSelector,
    CMSRadioBox,
    CMSInputNumber,
    NewCMSSelector,
    BaseLabel,
    IconField,
    BaseFab,
    LanguageButton,
    HalfRow,
    IconButton,
    SignaturePad,
    CustomFormInput,
    SimpleTable,
    PanelBox,
    DefaultLayout,
    MyAccount,
    ChangePassword,
    CMSCheckBox,
    BaseGridTable,
    LoginPage,
    NewCMSForm,
    ReportTemplate,
    StandardBoxButton,
    StandardDrawer,
    StandardDialog,
    VTooltipButton,
    CMSPhotoUpload,
    NodeCMSPhotoUpload,
    VNewCMSForm,
    VBaseDatePicker,
    NewDefaultLayout,
    NewNodeDefaultLayout,
    NewNavigationMenuItem,
    MobileBasePagingTable,
    NodeMobileBasePagingTable,
    AdvancedSearchTitleBar,
    BaseImportDrawer,
    NewStandardDialog,
    BaseCheckBox,
    BaseCheckBoxGroup
} from 'vue_basecomponent'
import { sha256 } from "js-sha256";
const components = {
    BaseFooter,
    BaseTable,
    BasePagingTable,
    NodeBasePagingTable,
    BaseUploadButton,
    CMSHeader,
    NavigationBar,
    NavigationBarToggleButton,
    LoginContainerBox,
    LoginInput,
    BaseCamera,
    CMSForm,
    CMSFormInput,
    CMSDatePicker,
    CMSSelector,
    CMSRadioBox,
    CMSInputNumber,
    NewCMSSelector,
    BaseLabel,
    IconField,
    BaseFab,
    LanguageButton,
    HalfRow,
    IconButton,
    SignaturePad,
    CustomFormInput,
    SimpleTable,
    PanelBox,
    DefaultLayout,
    MyAccount,
    ChangePassword,
    CMSCheckBox,
    BaseGridTable,
    LoginPage,
    NewCMSForm,
    ReportTemplate,
    StandardBoxButton,
    StandardDrawer,
    StandardDialog,
    VTooltipButton,
    CMSPhotoUpload,
    NodeCMSPhotoUpload,
    VNewCMSForm,
    VBaseDatePicker,
    NewDefaultLayout,
    NewNodeDefaultLayout,
    NewNavigationMenuItem,
    MobileBasePagingTable,
    NodeMobileBasePagingTable,
    AdvancedSearchTitleBar,
    BaseImportDrawer,
    NewStandardDialog,
    BaseCheckBox,
    BaseCheckBoxGroup
}
Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
})
const Plugin = {
    install(Vue, options) {
        Vue.mixin({
            methods: {
                convertValueToLabel(optionsList, value) {
                    return optionsList.find(f => f.value == value).label
                },
                showNumber(value, decimalPoint = 2) {
                    try {
                        return Number(value).toLocaleString("en-US", { minimumFractionDigits: decimalPoint })
                    } catch (e) {
                        return value
                    }
                },
                showDate(value) {
                    return this.$moment(value).format("YYYY-MM-DD")
                },
                isJSONObject(obj) {
                    return obj !== undefined && obj !== null && obj.constructor == Object
                },
                isPropExisted(object, prop) {
                    if (!object.hasOwnProperty(prop))
                        return false
                    if (object[prop] == null || object[prop] === "")
                        return false
                    return true
                },
                getDeepObjectProp(object, properties) {
                    try {
                        var propertiesArray = properties.split(".")
                        propertiesArray.forEach(f => {
                            object = object[f]
                        })
                        return object
                    } catch (e) {
                        console.log(e);
                        return null
                    }
                },
                assignDeepValue(object, properties, value) {
                    _.set(object, properties, value);
                    // var i;
                    // var obj = object
                    // properties = properties.split('.');
                    // for (let i = 0; i < properties.length - 1; i++)
                    //     obj = obj[properties[i]];
                    // obj[properties[i]] = value;
                },
                generateRandomString(length) {
                    var result = [];
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
                    }
                    return result.join('');
                },
                checkPermission(userRight) {
                    return (
                        userRight.find(
                            (f) => this.$store.getters.userType.indexOf(f) != -1
                        ) != null
                    );
                },
                checkReadPermission(page) {
                    try {
                        if (page == null)
                            return this.checkPermission(
                                findPageByUserAuth(this.$store.getters.userAuth, this.$route.path).readAuth
                            );
                        else
                            return this.checkPermission(
                                findPageByUserAuth(this.$store.getters.userAuth, page).readAuth
                            );
                    } catch (exception) {
                        console.log(exception);
                        return false
                    }
                },
                checkCreatePermission(page) {
                    try {
                        if (page == null)
                            return this.checkPermission(
                                findPageByUserAuth(this.$store.getters.userAuth, this.$route.path).createAuth
                            );
                        else
                            return this.checkPermission(
                                findPageByUserAuth(this.$store.getters.userAuth, page).createAuth
                            );
                    } catch (exception) {
                        console.log(exception);
                        return false
                    }
                },
                checkUpdatePermission(page) {
                    try {
                        if (page == null)
                            return this.checkPermission(
                                findPageByUserAuth(this.$store.getters.userAuth, this.$route.path).updateAuth
                            );
                        else
                            return this.checkPermission(
                                findPageByUserAuth(this.$store.getters.userAuth, page).updateAuth
                            );
                    } catch (exception) {
                        console.log(exception);
                        return false
                    }
                },
                checkDeletePermission(page) {
                    try {
                        if (page == null)
                            return this.checkPermission(
                                findPageByUserAuth(this.$store.getters.userAuth, this.$route.path).deleteAuth
                            );
                        else
                            return this.checkPermission(
                                findPageByUserAuth(this.$store.getters.userAuth, page).deleteAuth
                            );
                    } catch (exception) {
                        console.log(exception);
                        return false
                    }
                },
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
                deepClone(object) {
                    return JSON.parse(JSON.stringify(object));
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
                formatDate(value) {
                    if (value != null) return moment(value).format("yyyy-MM-DD");
                    else return "";
                },
                formatDateTime(value) {
                    if (value != null) {
                        value = new Date();
                        return moment(value).format("yyyy-MM-DD") + " " + value.getHours() + ":" + value.getMinutes() + ":" + value.getSeconds()
                    } else { return "" }
                },
                hashPassword(password) {
                    if (password === "" || password == null) return password;
                    return sha256(password);
                },
                getImgUrl(image) {
                    return require("@/assets/" + image);
                },
                notNullNotEmpty(value) {
                    return !(value == null || value === "" || value.length == 0);
                },
                numberWithCommas(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                },
                filterUnique(array, prop) {
                    return array.filter((f, index, self) =>
                        index === self.findIndex((t) => (
                            this.getDeepObjectProp(t, prop) == this.getDeepObjectProp(f, prop)
                        ))
                    )
                },
                async confirm(title, icon = "warning") {
                    var result = await Swal.fire({
                        title: title,
                        icon: icon,
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        reverseButtons: true
                    })
                    return result.isConfirmed
                },
                alert(title, content, icon, callback = function() {}) {
                    Swal.fire({
                        icon: icon != null ? icon : 'error',
                        title: title,
                        text: content != null ? content : ""
                    }).then((result) => {
                        callback()
                    });
                },
                convertNumberWithSeperation(val, defaultValue = "") {
                    return (val != null) ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : defaultValue
                },
                isEmptyString(val) {
                    return val == null || val == ""
                },
                getLocaleName(nameObject) {
                    try {
                        return nameObject.zh
                    } catch (e) {
                        return ""
                    }
                },
                isEmail(email) {
                    return String(email)
                        .toLowerCase()
                        .match(
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        );
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
            case "IS_POSITIVE":
                if (prop.value < 0) {
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
            case "REQUIRED_SOME":
                var validData = [];
                prop.value.forEach(f => {
                    if (f != null && f !== "") { validData.push(f); }
                });
                if (validData.length < rule.required) {
                    vueInstance.$message.error(rule.message);
                    return false;
                }
                break;
        }
    }
    return true;
}

function findPageByUserAuth(userAuthList, page) {
    var userAuth = userAuthList.find((f) => f.page == page)
    if (userAuth == null) throw new Error(page + " is not found")
    return userAuth
}

function isInt(value) {
    return (!isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10))
    );
}

function isLengthLessThan(value, length) {
    return value.length <= length;
}



export default Plugin;