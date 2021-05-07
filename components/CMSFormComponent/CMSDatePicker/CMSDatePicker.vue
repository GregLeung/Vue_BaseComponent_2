<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-date-picker :format="format" :disabled="disabled" @input="handleOnChange" v-bind:value="value" :type="type" :placeholder="placeholder" :value-format="setValueFormat()"></el-date-picker>
</div>
</template>

<script>
export default {
    props: {
        label:{
            type: String,
            require: false,
            default: ""
        },
        type: {
            type: String,
            required: false,
            default: "datetime"
        },
        disabled: {
            type: Boolean,
            require: true,
            default: false
        },
        placeholder: {
            type: String,
            required: false,
            default: "Select"
        },
        titleStyle: {
            type: Object,
            default: () => {}
        },
        direction: {
            type: String,
            required: false,
            default: "horizontal"
        },
        value:{
            type: [String, Array]
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
        format: {
            type: String,
            required: false
        }
    },
    model:{
        prop: "value",
        event: "update"
    },
    methods: {
        setValueFormat() {
            if (this.type == "date") {
                return "yyyy-MM-dd"
            }
            return "yyyy-MM-dd HH:mm:ss"
        },
        handleOnChange(value){
            this.$emit("update", value)
        }
    }
};
</script>
<style lang="sass" scoped>
@import "../cmsInput.sass"
</style>

