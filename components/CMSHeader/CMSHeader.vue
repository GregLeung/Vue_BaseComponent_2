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
.cms-header
  position: fixed
  padding-right: 24px
  display: flex
  height: 52px
  width: 100%
  align-items: center
  justify-content: space-between
  background: linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(157,157,218,1) 0%, rgba(45,134,240,1) 100%)
  z-index: 10
.logout-text
  color: #FFFFFF
  font-size: 20px
</style>
