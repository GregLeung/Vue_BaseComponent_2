<template>
  <div :class="isCollaspe ? 'collaspe' : 'open'" >
    <el-menu
      class="height-100"
      default-active="2"
      @open="handleOpen"
      @close="handleClose"
      :background-color="backgroundColor"
      :text-color="textColor"
      :active-text-color="textColorActive == null ? mainThemePlain :textColorActive"
      ref="menu"
      @select="handleSelect"
      :collapse="isCollaspe"
    >
      <div v-if="hasLogo" class="header-box" :style="{'background-color': headerColor}">
        <img class="header-image" src="~@/assets/company_logo.png"/>
      </div>
      <el-divider class="divider"></el-divider>
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
    headerColor: {
      type: String,
      required: false,
      default: "#434c64"
    },
    backgroundColor: {
      type: String,
      required: false,
      default: "#434c64"
    },
    textColor: {
      type: String,
      required: false,
      default: "#fff"
    },
    textColorActive: {
      required: false,
      default: null
    },
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
    },
    hasLogo: {
      type: Boolean,
      required: false,
      default: true
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
      this.$router.push({ path: '/' + this.$i18n.locale + keyPath[keyPath.length - 1] });
    }
  }
};
</script>
<style scoped lang="sass">
@import "vue_basecomponent/static/variables.scss"
@import "vue_basecomponent/static/main.sass"
.header-box
  width: 100%
  max-height: 8em
  padding-top: 1em
  padding-bottom: 1em
  .header-image
    object-fit: cover
    width: 90%
    margin-left: 5%
    margin-right: 5%
.divider
  margin-top: 0px
  margin-bottom: .5em
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
  span
    font-weight: bold
</style>
