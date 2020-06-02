import Vue from "vue"
import BaseCMSTable from "./components/BaseCMSTable/BaseCMSTable.vue"
import BaseFooter from "./components/BaseFooter/BaseFooter.vue"
import BaseTable from "./components/BaseTable/BaseTable.vue"
import BaseUploadButton from "./components/BaseUploadButton/BaseUploadButton.vue"
import LogoutHeader from "./components/LogoutHeader/LogoutHeader.vue"
import NavigationBar from "./components/NavigationBar/NavigationBar.vue"
const Components = {
    BaseCMSTable, BaseFooter, BaseTable, BaseUploadButton, LogoutHeader, NavigationBar
}

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
})

export default Components;