<template>
  <span class="label" :style="{'background': color, 'font-size': fontSize + 'rem'}">{{value}}</span>
</template>
<script lang="js">
export default {
    props: {
        value:{
            type: String,
            required: true,
        },
        color:{
            type: String,
            required: false,
        },
        fontSize: {
            type: Number,
            required: false,
        }
    },
    
}
</script>
<style lang="sass" scoped>
.label
    display: inline
    padding: .2em .6em .2em
    font-weight: 700
    line-height: 1
    color: #fff
    text-align: center
    vertical-align: baseline
    border-radius: .25em
    background-color: #337ab7
    
</style>