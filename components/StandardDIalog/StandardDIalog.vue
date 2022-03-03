<template>
<el-dialog
  :visible="visible"
  :width="width"
  :show-close="false"
  :lock-scroll="false"
  :append-to-body="appendToBody"
  >
  <div slot="title">
      <div class="container-title">
          <div class="space-between-row title-row">
              <div class="row">
                  <i v-if="icon!=null" :class="icon"/>
                  <h4>{{title}}</h4>
              </div>
              <i class="el-icon-close" @click="handleCloseDialog"></i>
          </div>
      </div>
  </div>
    <slot></slot>
</el-dialog>
</template>
<script lang="js">
import Vue from "vue";
import Cookies from "js-cookie";
import {
    Request,
    Util,
} from "vue_basecomponent";
export default{
    props: {
        visible: {
            type: Boolean,
            required: true,
            default: false,
        },
        title: {
            type: String,
            required: false,
            default: ""
        },
        width: {
            type: String,
            required: false,
            default: "50%"
        },
        icon: {
            type: String,
            required: false,
            default: null
        },
        appendToBody: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    methods: {
        handleCloseDialog(){
            this.$emit("close")
        },
    },
}
</script>
<style lang="sass" scoped>
@import "@/static/variables.scss"
::v-deep
    .el-dialog__header
        padding: 0px
    .el-tabs__content
        height: 100%
    .el-tab-pane
        height: 100%
.container-title
    width: 100%
    background-color: $main-theme-plain
    height: 3em
    .title-row
        align-items: center
        h4
            padding: 0px
            margin: 0
            color: white
        i
            padding: 1em
            color: white
            cursor: pointer
        .row
            display: flex
            align-items: center
            padding-left: 1em
            i
                font-size: 1.5rem
                margin-right: .5em
                padding: 0px
</style>