<template>
  <div class="fixed" :style="isCollaspe ? {}: openStyle">
    <navigation-menu-item></navigation-menu-item>
    <!-- <el-popover placement="right"  trigger="click">
      <div class="headerSelection">
        <el-button class="headerSelectionButton" @click.native="handleSystemChange" round>Client Management System</el-button>
        <el-button class="headerSelectionButton" round>Event System</el-button>
      </div>
      <div slot="reference" class="header">
        <p class="title">{{title}}</p>
      </div>
    </el-popover>-->
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
      :collapse="isCollaspe"
    >
      <navigation-menu-item
        :menuItem="item"
        v-for="(item, index) in menu"
        v-bind:key="index"
      ></navigation-menu-item>
    </el-menu>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapGetters } from "vuex";
import NavigationMenuItem from "@/components/NavigationMenuItem";
export default {
  mounted() {
    this.$refs.menu.activeIndex = this.path;
  },
  components: {
    NavigationMenuItem
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
      type: Array,
      required: true
    },
    openStyle: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(["isNavigationBarOpened"]),
    isCollaspe() {
      return !this.isNavigationBarOpened;
    }
  },
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    handleSelect(key, keyPath) {
      this.$router.push({ path: keyPath[keyPath.length - 1] });
    }
  }
};
</script>
<style scoped lang="sass">
.fixed
  position: fixed
  z-index: 2
  height: 100%
.height-100
  height: 100%
.menu-item
  font-size: 18px
.icon
  font-size: 24px
.header
  height: 52px
  width: 211px
  cursor: pointer
  border: none
  background-color: #367fa9
  display: flex
  justify-content: center
  align-items: center
.title
  color: #FFFFFF
  font-size: 20px
  padding: 4px
  text-align: center
.headerSelection
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
.headerSelectionButton
  margin-bottom: 8px
  margin-left: 0px
  width: 100%
.horizontal-collapse-transition
  transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out
</style>
