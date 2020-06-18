<template>
    <div class="logout-header">
        <!-- <p class="logout-text">登出</p> -->
        <slot></slot>
    </div>
</template>
<script>
export default {};
</script>
<style scoped lang="sass">
.logout-header
  position: fixed
  padding-right: 24px
  margin-left: 211px
  display: flex
  height: 52px
  width: calc(100% - 211px)
  align-items: center
  justify-content: flex-end
  background-color: #3c8dbc
  z-index: 10
.logout-text
  color: #FFFFFF
  font-size: 20px
</style>
