<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label>
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-input v-bind:value="value" @input="handleOnChange"/>
</div>
</template>

<script lang="js">
import Vue from "vue";
export default Vue.extend({
    props: {
        label: {
            type: String,
            required: true,
            default: ""
        },
        value: {
            type: String
        },
        direction: {
            type: String,
            required: false,
            default: "horizontal"
        },
        fontSize: {
            type: Number,
            required: false,
            default: 1
        }
    },
    model:{
        prop: "value",
        event: "update"
    },
    methods:{
        handleOnChange(value){
            this.$emit("update", value)
        }
    }
})
</script>

<style lang="sass" scoped>
@import "../cmsInput.sass"
</style>
