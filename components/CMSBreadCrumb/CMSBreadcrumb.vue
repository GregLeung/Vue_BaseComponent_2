<template>
<div>
    <div class="space-between-row">
        <div class="breadcrumb-bar">
            <el-breadcrumb :separator-class="icon">
                <el-breadcrumb-item v-for="(f, index) in item" :key="index" :to="{ path: f.path }">{{f.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <slot name="right"></slot>
        </div>
    </div>
    <el-divider></el-divider>
</div>
</template>
<script lang="js">
import Vue from "vue";
export default {
    props: {
        icon: {
            type: String,
            required: false,
            default: "el-icon-arrow-right"
        },
        item: {
            type: Array,
            required: false,
            default: () => {
                return []
            }
        },
        
    },
    methods: {
  
    }
}
</script>
<style lang="sass" scoped>
@import "@/static/variables.scss"
.space-between-row
    display: flex
    justify-content: space-between
    align-items: center
.breadcrumb-bar
    padding-top: 0.75em
    padding-left: 1em
    padding-right: 1em
::v-deep .el-divider--horizontal
    margin: 12px
 </style>