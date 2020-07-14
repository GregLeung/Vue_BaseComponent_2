<template>
    
    <el-submenu id="navigation-menu-item" :style="cssProps" v-if="menuItem != null && menuItem.hasOwnProperty('children') && Array.isArray(menuItem['children'])" :index="menuItem['name']">
    <template slot="title">
      <i :class="menuItem['icon']"></i>
      <span class="sub-menu">{{menuItem['name']}}</span>
    </template>
    <div v-for="(child, index) in menuItem['children']" v-bind:key="index">
      <navigation-menu-item
        v-if="child.hasOwnProperty('children')"
        :menuItem="child"
      ></navigation-menu-item>
      <el-menu-item-group v-else>
        <el-menu-item :index="child['path']" class="menu-item">
          <i :class="child['icon']"></i>
          <span>{{child["name"]}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </div>
  </el-submenu>
  <div id="navigation-menu-item" :style="cssProps" v-else-if="menuItem != null">
    <el-menu-item :index="menuItem['path']" class="menu-item">
      <i :class="menuItem['icon']"></i>
      <span slot="title">{{menuItem["name"]}}</span>
    </el-menu-item>
  </div>
    
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
        default: "56px"
    }
  },
  computed: {
    cssProps() {
      return {
        '--height': this.lineHeight
      }
    }
  }
};
</script>
<style scoped lang="sass">
.sub-menu
  font-size: 18px
.menu-item
  font-size: 18px
</style>
<style lang="sass">
#navigation-menu-item
    .el-submenu__title
        height: var(--height)
        line-height: var(--height)
    
    .el-menu-item
        height: var(--height)
        line-height: var(--height)
    .el-menu-item-group__title
        padding: 0px
    
</style>