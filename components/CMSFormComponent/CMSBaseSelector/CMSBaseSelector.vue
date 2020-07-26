<template>
<el-form-item class="basic-information-field">
    <template slot="label">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </template>
    <el-select  v-bind:value="value" :placeholder="placeholder">
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
            type: String
        },
        fontSize: {
            type: Number,
            required: false,
            default: 1
        }
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
