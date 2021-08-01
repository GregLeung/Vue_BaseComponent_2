<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-input :min="min" :max="max" :style="cssVars" :maxlength="maxlength" :disabled="disabled" :placeholder="placeholder" :show-password="showPassword" :type="type" :rows="rows" v-bind:value="value" @input="handleOnChange" :show-word-limit="showWordLimit">
        <el-button v-if="icon != null"  slot="append" :icon="icon" @click="iconClick"></el-button>
    </el-input>
</div>
</template>

<script lang="js">
export default {
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
        },
        textTransform: {
            type: String,
            required: false,
            default: "none"
        },
        showWordLimit: {
            type: Boolean,
            required: false,
            default: false
        },
        min: {
            type: Number,
            required: false,
            default: null
        },
        max: {
            type: Number,
            required: false,
            default: null
        }
    },
    model:{
        prop: "value",
        event: "update"
    },
    methods:{
        handleOnChange(value){
            if(this.textTransform == "uppercase" && value != null)
                value = value.toUpperCase()
            this.$emit("update", value)
            this.$emit("input", value)
        },
    },
    computed: {
        cssVars() {
            return {
                '--textTransform': this.textTransform,
            }
        }
    }
}
</script>

<style lang="sass" scoped>
@import "../cmsInput.sass"

::v-deep .el-input__inner
    text-transform: var(--textTransform)
</style>