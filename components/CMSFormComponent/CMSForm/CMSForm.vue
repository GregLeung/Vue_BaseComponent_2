<template>
  <div id="cms-form" class="container mb-10">
    <div class="header">{{title}}</div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="js">
export default {
    props: {
        title:{
            type: String,
            required: true
        }
    }
}
</script>

<style lang="sass" scoped>
@import "vue_basecomponent/static/variables.scss"
@import "vue_basecomponent/static/main.sass"
@import "@/static/variables.scss"
.container
    border-radius: 8px
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1)
    border: 1px solid #ebeef5
    .header
        height: 1.5em
        background: $main-theme
        color: white
        text-align: center
        font-size: 1.5rem
        line-height: 1.5em
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

