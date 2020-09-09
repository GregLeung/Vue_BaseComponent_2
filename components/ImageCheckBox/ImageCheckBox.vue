<template>
<div class="check-box">
    <input  type="checkbox" :id="'cb' + label"/>
    <label :for="'cb' + label"><img :src="require('@/static/' + path)" /></label>
    <p class="label-text">{{label}}</p>
</div>
</template>

<script lang="js">
import Vue from "vue";
export default {
    props: {
        path: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true
        }
    },
}
</script>

<style lang="sass" scoped>
.check-box
    input[type="checkbox"]
        display: none
    .label-text
        text-align: center
        font-weight: bold
    label
        border: 1px solid #fff
        padding: .4em
        display: block
        position: relative
        margin: .8em
        cursor: pointer
        text-align: center
        &:before
            background-color: white
            color: white
            content: " "
            display: block
            border-radius: 50%
            border: 1px solid grey
            position: absolute
            top: -5px
            left: -5px
            width: 25px
            height: 25px
            text-align: center
            line-height: 28px
            transition-duration: 0.4s
            transform: scale(0)
        img
            height: 7em
            width: 7em
            transition-duration: 0.2s
            transform-origin: 50% 50%
    input[type="checkbox"]:checked + label
        border-color: #ddd
        &:before
            content: "✓"
            background-color: grey
            transform: scale(1)
        img
            transform: scale(0.9)
            box-shadow: 0 0 5px #333
            z-index: -1

</style>
