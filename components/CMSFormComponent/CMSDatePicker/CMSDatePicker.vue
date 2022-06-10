<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label v-if="showLabel" :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-date-picker ref="picker" :clearable="clearable" unlink-panels :format="format" :disabled="disabled" @change="handleConfirm" @input="handleOnChange" v-bind:value="value" :type="type" :placeholder="placeholder" :value-format="setValueFormat()" :start-placeholder="startPlaceholder" :end-placeholder="endPlaceholder"></el-date-picker>
</div>
</template>

<script>
export default {
    props: {
        showLabel: {
            type: Boolean,
            required: false,
            default: true
        },
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
        },
        startPlaceholder: {
            type: String,
            default: ""
        },
        endPlaceholder: {
            type: String,
            default: ""
        },
        clearable: {
            type: Boolean,
            required: false,
            default: true
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
            if(this.type != "date" && value != null && value.length == 2){
                this.$emit("update", [value[0], value[1].split(" ")[0] + " " + "23:59:59"])
            }else
                this.$emit("update", value)
        },
        focus(){
            this.$refs.picker.focus()
        },
        handleConfirm(value){
            this.$emit("confirm", value)
        }
    }
};
</script>
<style lang="sass" scoped>
@import "../cmsInput.sass"
</style>