<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth + 'em'}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-checkbox :disabled="disabled" v-bind:value="value" @input="handleOnChange" @change="$emit('change', $event)"></el-checkbox>
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
        disabled: {
            type: Boolean,
            require: true,
            default: false
        },
        value:{
            type: Boolean
        },
        fontSize: {
            type: Number,
            required: false,
            default: 1
        },
        labelWidth: {
            type: Number,
            required: false
        },
        direction: {
            type: String,
            required: false,
            default: "horizontal"
        },
    },
    model:{
        prop: "value",
        event: "update"
    },
    methods: {
        handleOnChange(value){
            this.$emit("update", value)
        }
    }
};
</script>
<style lang="sass" scoped>
@import "../cmsInput.sass"
</style>

