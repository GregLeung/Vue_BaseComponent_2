<template>
  <div id="cms-form" class="container">
    <div class="header">{{title}}</div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="js">
import Vue from "vue";
export default Vue.extend({
    props: {
        title:{
            type: String,
            required: true
        }
    }
})
</script>

<style lang="sass" scoped>
@import "@/static/variables.scss"
.container
    margin-left: 60px
    margin-right: 60px
    border-radius: .25em
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1)
    border: 1px solid #ebeef5
    margin-top: 16px
    .header
        height: 50px
        background: $main-theme
        color: white
        text-align: center
        font-size: 36px
        line-height: 50px
        border-radius: .25em .25em 0em 0em
</style>
<style lang="sass">
#cms-form
    .el-form-item__content
        flex-grow: 1
    .el-form-item__label
        text-align: left
    .el-select
        width: 100%
</style>

