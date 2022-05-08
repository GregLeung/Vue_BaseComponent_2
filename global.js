import Vue from "vue";
import variables from "@/static/variables.scss";
Vue.prototype.$bus = new Vue();
Vue.mixin({
    computed: {
        mainTheme() {
            return variables["main-theme"];
        },
        mainThemePlain() {
            return variables["main-theme-plain"];
        },
        navigationBarWidth() {
            return variables["navigation-bar-width"];
        },
        cmsHeaderWidth() {
            return variables["cms-header-width"];
        },
        cmsHeaderWidthWithCollapseNavigationBar() {
            return variables["cms-header-width-with-collapse-navigation-bar"];
        },
        isMobile() {
            return this.$vuetify.breakpoint.name == 'sm' || this.$vuetify.breakpoint.name == 'xs';
        },
        viewPortRatio() {
            if (window.innerWidth < 1024)
                return variables["phone-width-ratio"]
            else if (window.innerWidth < 1440)
                return variables["small-pad-width-ratio"]
            else if (window.innerWidth < 1920)
                return variables["pad-width-ratio"]
            else
                return variables["pc-width-ratio"]
        }
    },
});