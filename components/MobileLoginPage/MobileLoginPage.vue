<template>
    <v-app>
      <v-container
        class="mobile-container">
          <v-img
            class="logo-image"
            :src="require('@/assets/company_logo.png')"
            height="80"
            contain
          />
          <v-text-field
            class="mt-32"
            label="Username"
            v-model="loginName"
            solo
            hide-details
          ></v-text-field>
          <v-text-field
            class="mt-12"
            label="Password"
            type="password"
            v-model="password"
            solo
            hide-details
          ></v-text-field>
          <v-row class="justify-center">
            <v-btn
              class="submit-button mt-12"
              x-large
              dark
              :color="mainThemePlain"
              @click="handleLogin">
              {{$t("Login")}}
            </v-btn>
          </v-row>
      </v-container>
    </v-app>
</template>
<script lang="js">
import Vue from "vue";
export default{
    methods: {
        handleLogin(){
            this.$emit("loginCallback", this.loginName, this.password)
        }
    },
    data(){
        return {
            loginName: null,
            password: null
        }
    }
}
</script>
<style lang="sass" scoped>
@import "@/static/variables.scss"
@import "vue_basecomponent/static/main.sass"
.mobile-container
  background: $main-theme-vertical
  height: 100%
  width: 100%
  .logo-image
    margin-top: 30%
  .submit-button
    font-size: 2rem
</style>