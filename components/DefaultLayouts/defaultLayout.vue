<template>
<div class="window-container">
    <navigation-bar id="navigation-bar" :headerColor="headerColor" :backgroundColor="backgroundColor" :textColor="textColor"  :class="classObj" lineHeight="2.6em" :path="currentPath" :menu="menu" :hasLogo="hasLogo" :textColorActive="textColorActive"></navigation-bar>
    <el-col>
        <div class="main-page" :class="classObj">
            <c-m-s-header :style="headerStyle">
                <div slot="left">
                    <div class="row">
                        <navigation-bar-toggle-button :isActive="isNavigationBarOpened" :toggleClick="toggleNavigationBarChange" class="ml-8"></navigation-bar-toggle-button>
                        <slot name="header-left"></slot>
                    </div>
                </div>
                <div slot="right" class="right-cms-header">
                    <slot name="header-right"></slot>
                    <el-tooltip class="item" effect="dark" :content="$t('Account')" placement="top-start">
                        <icon-button @click="$router.push({path:  basePath + '/my_account'})" class="mr-8" color="white" icon="mi-person"/>
                    </el-tooltip>
                    <el-button class="text-button mr-8" type="text" :style="{'color':color}" >{{getUserName()}}</el-button>
                    <el-tooltip class="item" effect="dark" content="Logout" placement="top-start">
                        <icon-button @click="handleLogOut" class="mr-8" color="white" icon="mi-exit-to-app"/>
                    </el-tooltip>
                </div>
            </c-m-s-header>
            <div class="page">
                <transition name="slide-fade">
                    <slot></slot>
                </transition>
            </div>
        </div>
    </el-col>
</div>
</template>

<script>
import {
    mapGetters
} from "vuex";
import {
    NavigationBar,
    NavigationBarToggleButton,
    CMSHeader, 
    IconButton, 
    Request
} from "vue_basecomponent";
export default {
    middleware: "authenticated",
    components: {
        NavigationBar,
        CMSHeader,
        NavigationBarToggleButton,
        IconButton
    },
    props: {
        menu: {
            type: Array,
            required: true,
            default: ()=>{
                return []
            }
        },
        basePath: {
            type: String,
            required: false,
            default: ""
        },
        color: {
            type: String,
            required: false,
            default: "black"
        },
        textColorActive: {
            required: false,
            default: null
        },
        headerColor: {
            type: String,
            required: false,
            default: "#434c64"
        },
        backgroundColor: {
            type: String,
            required: false,
            default: "#434c64"
        },
        textColor: {
            type: String,
            required: false,
            default: "#fff"
        },
        hasLogo: {
            type: Boolean,
            required: false,
            default: true
        }
        
    },
    computed: {
        ...mapGetters(["isNavigationBarOpened"]),
        classObj() {
            return {
                hideSidebar: !this.isNavigationBarOpened
            };
        },
        headerStyle() {
            return {
                width: this.isNavigationBarOpened ?
                    this.cmsHeaderWidth :
                    this.cmsHeaderWidthWithCollapseNavigationBar,
                background: this.mainTheme
            };
        },
    },
    data() {
        return {
            currentPath: $nuxt.$route.path,
        };
    },
    methods: {
        toggleNavigationBarChange() {
            this.$store.dispatch("toggleSideBar");
        },
        getUserName(){
            try{
                return this.$store.getters.user.username
            }catch(e){
                return ""
            }
        },
        handleLogOut() {
            Request.post(this, "user_logout", {token: this.$store.getters.token, ID: this.$store.getters.user.ID}, res => {
                this.$store.dispatch('setToken', "")
                this.$store.dispatch('setUser', null)
                this.$router.push({
                    path: this.basePath + "/login",
                });
            })
        }
    }
};
</script>

<style lang="sass" scoped>
@import "vue_basecomponent/static/main.sass"
@import "@/static/variables.scss"
#navigation-bar
    width: $navigation-bar-width
    &.hideSidebar
        width: 64px
.icon-language
    color: white
.right-cms-header
    display: flex
    align-items: center
.window-container
    display: flex
    height: 100vh
    width: 100%
.main-page
    margin-left: $navigation-bar-width
    height: 100%
    &.hideSidebar
        margin-left: 64px
    .page
        padding-left: .5em
        padding-right: .5em
        padding-top: 3em
        height: calc(100% - 3em)
    .text-button
        color: white
</style>