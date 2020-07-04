<template>
    <div class="main">
      <p class="sign" align="center">{{title}}</p>
          <slot></slot>
    </div>
</template>
<script lang="js">
export default{
    props: {
        title:{
            type: String,
            required: true,
        } 
    }
}
</script>
<style scoped lang="sass">
.main
    animation: login-container-box-animation 2s ease
@keyframes login-container-box-animation
  0%
    left: -100%
  100%
    left: 0%
</style>