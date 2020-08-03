<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth + 'em'}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-date-picker @input="handleOnChange" v-bind:value="value" :type="type" :placeholder="placeholder" :value-format="setValueFormat()"></el-date-picker>
</div>
</template>

<script>
export default {
    props: {
        label:{
            type: String,
            require: true,
            default: ""
        },
        type: {
            type: String,
            required: false,
            default: "datetime"
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
            type: String
        },
        fontSize: {
            type: Number,
            required: false,
            default: 1
        },
        labelWidth: {
            type: Number,
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
            return "yyyy-MM-dd hh:mm:ss"
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

