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
.basic-information-field
    display: flex
    align-items: center
    margin-bottom: 0px
    width: 100%
h1
    overflow: hidden
    white-space: nowrap
label
    vertical-align: middle
    float: left
    font-size: 1rem
    color: #606266
    padding: 0 12px 0 0
    box-sizing: border-box
</style>
