<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app :width="width" dark :color="backgroundColor">
      <v-list-item v-if="hasLogo" :style="{'background': headerColor}">
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <v-img
              class="logo-image"
              :src="require('@/assets/company_logo.png')"
              height="80"
              contain
            />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense>
        <new-navigation-menu-item
          v-for="(item, index) in menu"
          :key="index"
          :menuItem="item"
        />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dark :color="appBarColor">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex justify-space-between" style="width: 100%">
        <div>
            <slot name="header-left"></slot>
        </div>
        <div class="d-flex align-center">
            <slot name="header-right"></slot>
          <language-button class="pr-2" color="white" />
            <el-tooltip class="item" effect="dark" :content="$t('Account')" placement="top-start">
                <icon-button @click="$router.push({path:  '/private/my_account'})" class="mr-8" color="white" icon="mi-person"/>
            </el-tooltip>
            <el-button class="text-button mr-8" type="text" :style="{'color':'white'}" >{{getUserName()}}</el-button>
            <el-tooltip class="item" effect="dark" content="Logout" placement="top-start">
                <icon-button @click="handleLogOut" class="mr-8" color="white" icon="mi-exit-to-app"/>
            </el-tooltip>
        </div>
      </div>
    </v-app-bar>
    <v-main class="page-container">
        <slot></slot>
    </v-main>
  </v-app>
</template>
<script lang="js">
import Vue from "vue";
import {
    NewRequest as Request
} from "vue_basecomponent";
export default{
    props: {
        menu: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        textColorActive: {
            required: false,
            default: "white"
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
        appBarColor: {
            type: String,
            required: false,
            default: "#434c64"
        },
        hasLogo: {
            type: Boolean,
            required: false,
            default: true
        },
        width: {
            type: String,
            required: false,
            default: "300"
        }
    },
    methods: {
        getUserName(){
            try{
                return this.$store.getters.user.username
            }catch(e){
                return ""
            }
        },
        async handleLogOut() {
            try{
                await Request.post("user_logout", {token: this.$store.getters.token, ID: this.$store.getters.user.ID})
                this.$store.dispatch('setToken', "")
                this.$store.dispatch('setUser', null)
                this.$router.push({
                    path: "/login",
                });
                
            }catch(e){
                this.alert(e)
            }
        }
    },
    data(){
        return {
            drawer: null,
        }
    }
}
</script>
<style lang="sass" scoped>
.page-container
    background: #eee!important
</style>