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
      }
    }
  }
};
</script>
<style scoped lang="sass">
@import "@/static/variables.scss"
@import "@/static/main.sass"
.cms-header
  position: fixed
  display: flex
  height: 3em
  width: 100%
  align-items: center
  justify-content: space-between
  background: $main-theme
  z-index: 10
</style>
