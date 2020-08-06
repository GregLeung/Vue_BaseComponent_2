<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth + 'em'}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-select :filterable="filterable" :clearable="clearable" v-bind:value="value" :placeholder="placeholder" @input="handleOnChange" @change="$emit('change')">
        <el-option class="input" v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
</div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            require: true,
            default: ""
        },
        placeholder: {
            type: String,
            required: false,
            default: this.$t('Please Select')
        },
        value: {
            type: [Number, String]
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
        options: {
            type: Array,
            default: []
        },
        defaultOption: {
            type: [String, Number],
            required: false,
            default: null
        },
        clearable: {
            type: Boolean,
            required: false,
            default: false
        },
        filterable: {
            type: Boolean,
            required: false,
            default: false
        },
        labelWidth: {
            type: Number,
            required: false
        }
    },
    mounted(){
        if(this.value == null && this.defaultOption != null )  
            this.$emit("update", this.defaultOption)
    },
    model: {
        prop: "value",
        event: "update"
    },
    methods: {
        handleOnChange(value) {
            this.$emit("update", value)
        }
    }
};
</script>

<style lang="sass" scoped>
@import "../cmsInput.sass"
</style>
