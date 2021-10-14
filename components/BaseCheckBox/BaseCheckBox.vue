<template>
<div>
    <el-checkbox @change="handleChange" :style="{'transform': 'scale(' + scaleSize + ')', 'padding': size + 'px'  }" v-bind:value="value"></el-checkbox>
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
        },
        value: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    computed: {
        size() {
            return (this.scaleSize - 1) * 14 / 2
        },
        containerWidth(){
            return this.scaleSize * 14
        }
    },
    methods: {
        handleChange(value){
            this.$emit("update:value", value)
            this.$emit("change", value)
        }
    },
    model: {
        prop: "value",
        event: "update"
    },
}
</script>

<style lang="sass" scoped>
</style>
