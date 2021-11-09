<template>
    <div class="space-between-row">
        <div class="left-content">
            <div><i :style="{'font-size': iconSize}" class="el-icon-s-tools header-icon"></i></div>
            <div :style="{'margin-left': marginLeft}">
                <span :style="titleStyle" class="title">{{title}}</span><br>
                <span :style="subtitleStyle" class="subtitle">{{subtitle}}</span>
            </div>
        </div>
        <div>
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script lang="js">
import Vue from "vue";
export default {
    props: {
        iconSize: {
            type: String,
            required: false,
            default: "2.5rem"
        },
        marginLeft: {
            type: String,
            required: false,
            default: "2rem"
        },
        title: {
            type: String,
            required: false,
            default: ''
        },
        subtitle: {
            type: String,
            required: false,
            default: ''
        },
        titleStyle: {
            type: Object,
            required: false,
            default: () => {
               return {'font-size': '2rem'}
            }
        },
        subtitleStyle: {
            type: Object,
            required: false,
            default: () => {
               return {'font-size': '0.75rem'}
            }
        }
    },
    methods: {
        handleClick(){
            this.$emit("click")
        }
    }
}
</script>
<style lang="sass" scoped>
@import "@/static/variables.scss"
.space-between-row
    display: flex
    justify-content: space-between
    align-items: center
.left-content
    display: flex
    align-items: center
.header-icon
    color: $main-theme-plain
.title
    color: $main-theme-plain
.subtitle
    font-weight: bold
    color: #606266
 </style>