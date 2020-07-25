<template>
  <span >
    <i class="grey" :class="icon"></i>
    <span class="grey" :style="textStyle">{{field}}</span>
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
.grey
    color: #999999
    font-size: .8rem
</style>
