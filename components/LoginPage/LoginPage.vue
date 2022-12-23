<template>
    <div class="background">
    <div class="row">
      <div class="container-left center-item">
        <div class="header mt-12" text-align="center">
          <img :style="{width: logoWidth}" src="~@/assets/company_logo.png"/>
        </div>
        <login-container-box class="login-container-box" :title="$t('Login')">
          <div class="login-input-div">
            <login-input class="mb-8" :placeholder="$t('Username')" v-model="data.loginName"></login-input>
            <login-input type="password" class="mb-12" :placeholder="$t('Password')" v-model="data.password"></login-input>
          </div>
          <el-button @click="handleLogIn" round>{{$t('Login')}}</el-button>
        </login-container-box>
        <p class="footer">{{$t('Powered By Clear Future Technologies Limited ')}}{{ + new Date().getFullYear()}}</p>
      </div>
      <div class="container-right center-item">
        <div class="city-image">
          <div class="blue-layer"> 
            <h2>{{$t('Welcome to')}}</h2>
            <h1>{{systemName}}</h1>
            <p>{{$t('Login to Access Dashboard')}}</p>
            <p>Version: {{version}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js">
import Vue from "vue";
import {LoginContainerBox, LoginInput, Request} from "vue_basecomponent";
export default Vue.extend({
    props: {
        systemName: {
            type: String,
            required: true,
            default: ""
        },
        version: {
            type: String,
            required: true,
            default: ""
        },
        logoWidth: {
          type: String,
          required: false,
          default: "60%"
        }
    },
    components:{
        LoginContainerBox, LoginInput
    },
    methods: {
      handleLogIn(){
          this.$emit("loginCallback", this.data.loginName, this.data.password)
      }
    },
    data(){
      return {
        data: {
            loginName: null,
            password: null
        }
      }
    }
})
</script>
<style scoped lang="sass">
@import "@/static/variables.scss"
.background
  position: absolute
  width: 100%
  height: 100%
  background: white
.el-button
  background: $main-theme
  color: white
  width: 60%
.city-image
  width: 100%
  height: 100%
  background-image: url("~@/assets/background1.jpg")
  background-position: center center
  background-repeat: no-repeat
  background-size: cover
.center-item
  display: flex
  justify-content: space-between
  align-items: center
  flex-direction: column

.row
  display: flex
  justify-content: center
  align-items: center
  height: 100%
.container-left
  height: 100%
  width: 40%
.container-right
  height: 100%
  width: 60%
.blue-layer
  color: white
  height: 100%
  font-family: sans-serif
  font-weight: bold
  background: $main-theme
  display: flex
  flex-direction: column
  justify-content: center
  text-align: center
  animation: fade-in 5s ease
  h2
    font-size: 2rem
  h1
    font-size: 2.6rem
.header
  width: 100%
  justify-content: center
  display: flex
.footer
  font-size: 1rem
  color: rgba(157,157,218,1)
  font-family: sans-serif
  font-weight: bold
  text-align: right
.login-container-box
  width: 60%
  height: 18em
  position: relative
  animation: login-container-box-animation 2s ease
  .login-input-div
    width: 76%
    display: flex
    flex-direction: column
    justify-content: center

@keyframes login-container-box-animation
  0%
    left: -100%
  100%
    left: 0%



</style>