<template>
  <el-submenu id="navigation-menu-item" :style="cssProps" v-if="isAuth && menuItem != null && menuItem.hasOwnProperty('children') && Array.isArray(menuItem['children'])" :index="menuItem['name']">
    <template slot="title">
      <i :class="menuItem['icon']"></i>
      <span class="sub-menu">{{menuItem['name']}}</span>
    </template>
    <div v-for="(child, index) in menuItem['children']" v-bind:key="index">
      <navigation-menu-item
        v-if="child.hasOwnProperty('children')"
        :menuItem="child"
      ></navigation-menu-item>
      <el-menu-item-group v-else-if="((!child.hasOwnProperty('auth') || child['auth']))">
        <el-menu-item :index="child['path']" class="menu-item">
          <i :class="child['icon']"></i>
          <span>{{child["name"]}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </div>
  </el-submenu>
  <div id="navigation-menu-item" :style="cssProps" v-else-if="isAuth && menuItem != null">
    <el-menu-item :index="menuItem['path']" class="menu-item">
      <i :class="menuItem['icon']"></i>
      <span slot="title">{{menuItem["name"]}}</span>
    </el-menu-item>
  </div>
<!-- </div> -->
    
</template>
<script>
export default {
  name: "navigation-menu-item",
  props: {
    menuItem: {
      required: false
    },
    lineHeight: {
        type: String,
        required: false,
        default: "3.5em"
    }
  },
  computed: {
    cssProps() {
      return {
        '--height': this.lineHeight
      }
    },
    isAuth(){
      return !this.menuItem.hasOwnProperty('auth') || this.menuItem['auth']
    }
  }
};
</script>
<style scoped lang="sass">
@import "vue_basecomponent/static/variables.scss"
@import "vue_basecomponent/static/main.sass"
$font-size: .8rem
.el-menu:not(.el-menu--collapse)
  .el-submenu
    padding-left: 0px
    i
      font-size: $font-size
  .el-menu-item
    padding-left: 0px
    i
      font-size: $font-size
  .sub-menu
    font-size: $font-size
  .menu-item
    font-size: $font-size

</style>
<style lang="sass">
#navigation-bar
  .el-menu:not(.el-menu--collapse)
    .el-submenu__title
      padding-left: 7% !important
      height: var(--height)
      line-height: var(--height)
    .el-menu-item
      padding-left: 7% !important
      height: var(--height)
      line-height: var(--height)
    .el-menu-item-group
      .el-menu-item
        padding-left: 14% !important
    
</style>