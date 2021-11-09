<template>
  <div :class="isCollaspe ? 'collaspe' : 'open'" >
    <el-menu
      class="height-100"
      default-active="2"
      @open="handleOpen"
      @close="handleClose"
      background-color="#434c64"
      text-color="#fff"
      active-text-color="#3c8dbc"
      ref="menu"
      @select="handleSelect"
      :collapse="isCollaspe"
    >
      <navigation-menu-item
        :menuItem="item"
        :lineHeight="lineHeight"
        v-for="(item, index) in menu"
        v-bind:key="index"
      />
    </el-menu>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapGetters } from "vuex";
import NavigationMenuItem from "../NavigationMenuItem/NavigationMenuItem";
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
    menu: {
      type: Array,
      required: true
    },
    lineHeight: {
        type: String,
        required: false,
        default: "3.5em"
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
@import "vue_basecomponent/static/variables.scss"
@import "vue_basecomponent/static/main.sass"
.open
  position: fixed
  z-index: 2
  height: 100%
  overflow: scroll
  width: $navigation-bar-width
  &::-webkit-scrollbar
    display: none
    -ms-overflow-style: none
    scrollbar-width: none
.collaspe
  position: fixed
  z-index: 2
  height: 100%
  overflow: scroll
  width: 64px
  &::-webkit-scrollbar
    display: none
    -ms-overflow-style: none
    scrollbar-width: none
.height-100
  height: 100%
::v-deep
  .el-menu-item-group__title
    padding: 0px
</style>
