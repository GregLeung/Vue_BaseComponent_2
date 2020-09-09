<template>
<div>
    <el-checkbox :style="{'transform': 'scale(' + scaleSize + ')', 'padding': size + 'px'  }" v-model="checked"></el-checkbox>
</div>
</template>

<script lang="js">
import Vue from "vue";
export default {
    props: {
        scaleSize: {
            type: Number,
            required: false,
            default: 1
        }
    },
    data() {
        return {
            checked: true
        }
    },
    computed: {
        size() {
            return (this.scaleSize - 1) * 14 / 2
        },
        containerWidth(){
            return this.scaleSize * 14
        }
    }
}
</script>

<style lang="sass" scoped>
</style>
