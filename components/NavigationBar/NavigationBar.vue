<template>
  <div class="fixed">
    <div class="header">
      <p class="title">{{title}}</p>
    </div>
    <el-menu
      class="height-100"
      default-active="2"
      @open="handleOpen"
      @close="handleClose"
      background-color="#222d32"
      text-color="#fff"
      active-text-color="#3c8dbc"
      ref="menu"
      @select="handleSelect"
    >
      <el-submenu
        :index="submenu"
        v-for="(submenu, subMenuIndex) in getSubMenu()"
        v-bind:key="subMenuIndex"
      >
        <template slot="title">
          <span class="sub-menu">{{submenu}}</span>
        </template>
        <el-menu-item-group v-for="(menu, index) in menu[submenu]" v-bind:key="index">
          <el-menu-item :index="menu['path']" class="menu-item">
            <i :class="menu['icon']"></i>
            <span>{{menu["name"]}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item
        :index="menu[item]['path']"
        class="menu-item"
        v-for="(item, index) in getMenu()"
        v-bind:key="index"
      >
        <i :class="menu[item]['icon']"></i>
        <span>{{menu[item]["name"]}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$refs.menu.activeIndex = this.path;
  },
  props: {
    path: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false
    },
    menu: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    handleSelect(key, keyPath) {
      this.$router.push({ path: keyPath[keyPath.length - 1] });
    },
    getSubMenu() {
      var menuList = Object.keys(this.menu);
      var result = [];
      menuList.forEach(f => {
        if (Array.isArray(this.menu[f])) result.push(f);
      });
      return result;
    },
    getMenu() {
      var menuList = Object.keys(this.menu);
      var result = [];
      menuList.forEach(f => {
        if (!Array.isArray(this.menu[f])) result.push(f);
      });
      return result;
    }
  }
};
</script>
<style scoped lang="sass">
body
    margin: 0px
.fixed
    position: fixed
    height: 100%
.height-100
    height: 100%
.sub-menu
    font-size: 18px
    color: #48C9B0
.menu-item
    font-size: 20px
.icon
    font-size: 24px
.header
    height: 52px
    width: 211px
    border: none
    background-color: #367fa9
    display: flex
    justify-content: center
    align-items: center
.title
    color: #FFFFFF
    font-size: 20px
    text-align: center
</style>
