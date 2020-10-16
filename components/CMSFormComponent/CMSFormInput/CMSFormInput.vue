<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-input :maxlength="maxlength" :placeholder="placeholder" :disabled="disabled" :show-password="showPassword" :type="type" :rows="rows" v-bind:value="value" @input="handleOnChange"/>
</div>
</template>

<script lang="js">
import Vue from "vue";
export default Vue.extend({
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
        showPassword: {
            type: Boolean,
            requored: false,
            default: false
        },
        value: {
            type: [String, Number]
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
        type:{
            type: String,
            required: false,
            default: "text"
        },
        rows:{
            type: Number,
            required: false
        },
        labelWidth: {
            type: String,
            required: false
        },
        maxlength: {
            type: Number,
            required: false,
            default: 50
        },
        placeholder: {
            type: String,
            required: false,
            default: ""
        }
    },
    model:{
        prop: "value",
        event: "update"
    },
    methods:{
        handleOnChange(value){
            this.$emit("update", value)
            this.$emit("input", value)
        }
    }
})
</script>

<style lang="sass" scoped>
@import "../cmsInput.sass"
</style>
