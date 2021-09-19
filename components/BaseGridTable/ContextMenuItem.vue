<template>
  <li class="menu-item-container" @click="handler" :style="{opacity:disabled?'0.5':'1'}">
    <i v-if="icon != null" :class="icon" :style="{'color': iconColor}"></i>
    <slot></slot>
  </li>
</template>

<script>
export default {
name: "ContextMenuItem",
  props:{
        label:{
            type: String|Number,
            default:''
        },
        value:{
            type: String|Number,
            default:''
        },
        disabled:{
            type:Boolean,
            default: false
        },
        icon: {
            type:String,
            required: false,
            default: null
        },
        iconColor: {
            type: String,
            required: false,
            default: "black"
        }
    },
    methods:{
        handler(){
            if(!this.disabled){
                this.$emit('click', this.value, this.label)
            }
        }
  }
}
</script>

<style scoped lang="sass">
.menu-item-container
    padding-left: 1em
    padding-right: 1em
li
    display: block
    min-width: 3rem
    height: 2rem
    line-height: 2rem
    font-size: 0.8rem
    text-align: left
    margin: 0

li:hover
    background-color: darkgrey
    cursor: pointer
</style>
