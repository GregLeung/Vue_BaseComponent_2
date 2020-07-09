<template>
<div>
    <div class="form-row">
        <div class="name input-title" :style="titleStyle">{{title}}</div>
        <el-date-picker @input="handleOnChange" v-bind:value="value" :type="type" :placeholder="placeholder" :value-format="setValueFormat()"></el-date-picker>
    </div>
</div>
</template>

<script>
export default {
    props: {
        title: String,
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
        value:{
            type: String
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
@import '../css/main.css'
.validation-text
    padding-left: 125px
    color: red
    font-size: 24px
.name
    color: #555
    font-size: 28px
    font-weight: 700
</style>
