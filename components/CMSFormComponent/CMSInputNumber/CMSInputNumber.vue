<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-input-number :disabled="disabled" v-bind:value="value" @change="handleOnChange" :controls="control" :min="min" :max="max"  />
</div>
</template>

<script lang="js">
import Vue from "vue";
export default {
    props: {
        label: {
            type: String,
            required: false,
            default: ""
        },
        disabled: {
            type: Boolean,
            require: true,
            default: false
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
        },
        labelWidth: {
            type: String,
            required: false
        },
        min: {
            type: Number,
            required: false,
            default: 0
        },
        max: {
            type: Number,
            required: false,
            default: 99999999999
        },
        value: {
            type: [Number, String],
        },
        control: {
            type: Boolean,
            default: true
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
}
</script>

<style lang="sass" scoped>
@import "../cmsInput.sass"
</style>
