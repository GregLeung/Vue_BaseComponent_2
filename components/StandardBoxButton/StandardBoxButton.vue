<template>
<el-card @click.native="handleClick" class="standard-box-button-container">
    <el-avatar v-if="src != null" :src="require('@/static/' + src)" :style="cssVars" :size="avatarSize" :icon="icon"></el-avatar>
    <el-avatar v-else :style="cssVars" :size="avatarSize" :icon="icon"></el-avatar>
    <h3>{{title}}</h3>
    <p>{{description}}</p>
</el-card>
</template>

<script lang="js">
import Vue from "vue";
export default {
    props: {
        avatarSize: {
            type: String | Number,
            required: false,
            default: "large"
        },
        iconSize: {
            type: String,
            required: false,
            default: ".8rem"
        },
        icon: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false,
            default: ""
        },
        iconColor: {
            type: String,
            required: false,
            default: "grey"
        },
        src: {
            type: String,
            required: false,
        }
    },
    computed: {
        cssVars() {
            return {
                '--background-color': this.iconColor,
                '--icon-size': this.iconSize,
            }
        }
    },
    methods:{
        handleClick(event){
            this.$emit("click", event)
        }
    }
}
</script>

<style lang="sass" scoped>
.standard-box-button-container
    text-align: center
    cursor: pointer
    .el-avatar
        background-color: var(--background-color)
        ::v-deep
            i
                font-size: var(--icon-size)
    p
        font-size: .8rem
        color: grey
</style>
