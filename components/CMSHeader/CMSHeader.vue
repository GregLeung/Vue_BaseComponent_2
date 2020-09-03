<template>
  <div :style="headerStyle" class="cms-header">
    <div class="left">
      <slot name="left"></slot>
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
  mounted(){
      window.addEventListener('mousemove', this.onMouseMove)
  },
  methods: {
    onMouseMove(event) {
      var headerRef = this.$el;
      if (event.clientY < 100) headerRef.classList.add("show");
      else headerRef.classList.remove("show");
    },
  },
};
</script>
<style scoped lang="sass">
@import "@/static/variables.scss"
@import "@/static/main.sass"
.cms-header
    position: fixed
    display: flex
    height: 0em
    transition: height 1s
    overflow: hidden
    width: 100%
    align-items: center
    justify-content: space-between
    background: $main-theme
    z-index: 10
    &.show
        height: 3em
        transition: height 1s
</style>
