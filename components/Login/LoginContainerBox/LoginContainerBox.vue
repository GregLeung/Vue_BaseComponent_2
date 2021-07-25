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
@import "../main.sass"
</style>