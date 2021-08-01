<template>
    <div id="cms-radio-box">
        <el-radio v-bind:value="value" :label="label" @input="handleOnChange"><slot/></el-radio>
    </div>
</template>
<script lang="js">
import Vue from "vue";
export default {
    props: {
         value: {
            type: [String, Number, Boolean]
        },
        label: {
            type: [String, Number, Boolean],
            required: true
        }
    },
     model:{
        prop: "value",
        event: "update"
    },
    methods:{
        handleOnChange(value){
            this.$emit("update", value)
            this.$emit("customChange", value)
        }
    }
}
</script>
<style lang="sass">
#cms-radio-box
    label
        display: flex
        align-items: center
        .el-radio__inner
            width: 2em
            height: 2em
            &::after
                width: 1em
                height: 1em
        .el-radio__label
            font-size: 1.2rem
            color: black
            font-weight: bold

</style>