<template>
  <span>
    <i class="grey" :class="icon"></i>
    <span class="font-18 grey" :style="textStyle">{{field}}</span>
  </span>
</template>

<script lang="js">
import Vue from "vue";
export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: true
        },
        field: {
            type: String,
            required: true
        },
        textStyle:{
            type:Object,
            required: false,
            default: () => {
                return {}
            }
        }

    }
})
</script>

<style lang="sass" scoped>
.font-18
    font-size: 18px
.grey
    color: #999999
</style>
