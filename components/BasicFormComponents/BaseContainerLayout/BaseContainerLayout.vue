<template>
  <div class="page-wrapper p-t-45 p-b-50">
    <div class="wrapper wrapper--w790">
      <div class="card card-5">
        <div class="card-heading">
          <h2 class="title">{{title}}</h2>
        </div>
        <div class="card-body">
            <nuxt />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
export default {
    data(){
        return {
            title: "Title"
        }
    },
};
</script>

<style scoped lang="sass">
@import '../css/main.css'
img
    max-width: 514px
    width: 100%
</style>