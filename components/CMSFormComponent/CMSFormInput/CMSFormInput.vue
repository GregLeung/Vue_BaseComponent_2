<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-input :maxlength="maxlength" :disabled="disabled" :placeholder="placeholder" :show-password="showPassword" :type="type" :rows="rows" v-bind:value="value" @input="handleOnChange">
        <el-button v-if="icon != null" slot="append" :icon="icon" @click="iconClick"></el-button>
    </el-input>
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
            default: 1000000000000
        },
        placeholder: {
            type: String,
            required: false,
            default: ""
        },
        iconClick: {
            type: Function,
            required: false
        },
        icon: {
            type: String,
            required: false
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