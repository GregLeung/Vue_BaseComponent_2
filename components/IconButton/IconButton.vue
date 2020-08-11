<template>
    <i @click="$emit('click')" :class="icon" :style="{
        'color': color
    }"></i>
</template>
<script lang="js">
import Vue from "vue";
export default{
    props: {
        icon:{
            type: String,
            required: true
        },
        color: {
            type:String,
            required: false
        }
    }
}
</script>
<style lang="sass" scoped>
i
    font-size: 1.5rem
    cursor: pointer
</style>