<template>
<el-form-item class="basic-information-field">
    <template slot="label">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </template>
    <el-select :filterable="filterable" :clearable="clearable" v-bind:value="value" :placeholder="placeholder" @input="handleOnChange">
        <el-option class="input" v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
</el-form-item>
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
            default: "Select"
        },
        value: {
            type: [Number, String]
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
