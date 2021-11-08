<template>
<el-drawer append-to-body :visible="visible" direction="btt" @close="handleClose" :size="size">
    <div slot="title">
        <p>{{title}}</p>
    </div>
    <slot></slot>
</el-drawer>
</template>
<script lang="js">
import Vue from "vue";
export default{
    props: {
        visible: {
            type: Boolean,
            required: true,
            default: false
        },
        title: {
            type: String,
            required: true,
            default: ""
        },
        size: {
            type: String,
            required: false,
            default: "40%"
        }
    },
    methods: {
        handleClose(){
            this.$emit("close")
        }
    }
}
</script>
<style lang="sass" scoped>
::v-deep 
    .el-drawer__container
        width: 90%
        margin-left: 5%
    #el-drawer__title
        background-color: #0e71eb
        margin-bottom: 0em
        color: white
    .el-drawer__header
        padding: 0px 5px 0
</style>