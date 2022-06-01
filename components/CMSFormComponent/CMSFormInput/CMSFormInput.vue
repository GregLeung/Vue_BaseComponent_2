<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label v-if="showLabel" :style="{ 'min-width': labelWidth, 'max-width': labelWidth }">
      <h1 :style="{ 'font-size': fontSize + 'rem' }">{{ label }}</h1>
    </label>
    <el-input class="input" @keyup.enter.native="handleKeyUpEnter" @keydown.enter.native="handleKeyDownEnter" ref="input" :min="min" :max="max" :style="cssVars" :maxlength="maxlength" :disabled="disabled" :placeholder="placeholder" :show-password="showPassword" :type="type" :rows="rows" v-bind:value="value" @input="handleOnChange" :show-word-limit="showWordLimit" @blur="handleBlur" @focus="focus">
        <el-button v-if="icon != null"  slot="append" :icon="icon" @click="iconClick"></el-button>
    </el-input>
</div>
</template>

<script lang="js">
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
        showLabel: {
            type: Boolean,
            required: false,
            default: true
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
        isNoWrap: {
            type: Boolean,
            required: false,
            default: false
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
        },
        width: {
            type: String,
            require: false,
            default: "100%"
        },
        selectOnFocus: {
            type: Boolean,
            required: false,
            default: false
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
        focus(){
            this.$refs.input.focus()
            if(this.selectOnFocus)
                this.$nextTick(() => this.$refs.input.select())
        },
        handleKeyUpEnter(event){
            this.$emit("keyup-enter", event, this.value)
        },
        handleKeyDownEnter(event){
            this.$emit("keydown-enter", event, this.value)
        },
        handleBlur(event){
            this.$emit("blur", event, this.value)
        }
    },
    computed: {
        cssVars() {
            return {
                '--textTransform': this.textTransform,
                '--white-space': this.isNoWrap ?  "pre" : "normal",
                '--overflow-x': this.isNoWrap ?  "scroll" : "visible",
                'width': this.width
            }
        }
    }
}
</script>

<style lang="sass" scoped>
@import "../cmsInput.sass"

::v-deep .el-input__inner
    text-transform: var(--textTransform)
::v-deep .el-textarea__inner
    white-space: var(--white-space)
    overflow-x: var(--overflow-x)
</style>