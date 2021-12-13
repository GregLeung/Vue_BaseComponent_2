<template>
  <div :style="headerStyle" class="show" id="cms-header">
    <div class="left">
      <slot class="a" name="left"></slot>
      <div class="space"></div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item  v-for="(item, index) in breadcrumbList" :key="index">
            <n-link v-if="item.hasOwnProperty('path')" :to="item.path" no-prefetch>{{item.label}}</n-link>
            <span v-else>{{item.label}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    headerStyle: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    breadcrumbList(){
      return this.$store.state.currentPage
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll(event) {
      var headerRef = this.$el;
      if (window.scrollY == 0) headerRef.classList.add("show");
      else headerRef.classList.remove("show");
      this.$emit("headerShow", event, window.scrollY == 0)
    },
  },
};
</script>
<style scoped lang="sass">
@import "vue_basecomponent/static/variables.scss"
@import "vue_basecomponent/static/main.sass"
@import "@/static/variables.scss"
#cms-header
    position: fixed
    display: flex
    height: 0em
    transition: height 1s
    overflow: hidden
    width: calc(100% - 64px)
    align-items: center
    justify-content: space-between
    background: $main-theme
    z-index: 10
    &.show
        height: 3em
        transition: height 1s
    .left
        display: flex
        align-items: center
        .space
            width: 2em
        .el-breadcrumb ::v-deep .el-breadcrumb__inner
            color: white
            font-size: 1rem
            a
                color: white
                cursor: pointer
                font-weight: bold
            span
                color: white
</style>
