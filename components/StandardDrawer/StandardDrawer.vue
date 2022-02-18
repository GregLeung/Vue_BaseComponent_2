<template>
<el-drawer append-to-body :visible="visible" direction="btt" @close="handleClose" :size="size">
    <div slot="title">
        <div class="base-row">
            <i v-if="icon!=null" :class="icon"/>
            <p>{{title}}</p>
        </div>
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
        },
        icon: {
            type: String,
            required: false,
            default: null
        },
    },
    methods: {
        handleClose(){
            this.$emit("close")
        }
    }
}
</script>
<style lang="sass" scoped>
@import "@/static/variables.scss"
::v-deep 
    .el-drawer__container
        width: 90%
        margin-left: 5%
    #el-drawer__title
        background-color: $main-theme-plain
        margin-bottom: 0em
        color: white
    .el-drawer__header
        padding: 0px 5px 0
.base-row
    display: flex
    align-items: center
    padding-left: 1em
    min-height: 3em
    i
        font-size: 1.5rem
        margin-right: .5em
p
    margin: 0px
</style>