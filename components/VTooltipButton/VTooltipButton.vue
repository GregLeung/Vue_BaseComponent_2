<template>
<v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
            <slot></slot>
        </div>
    </template>
    <span>{{tooltip}}</span>
</v-tooltip>
</template>
<script lang="js">
import Vue from "vue";
export default{
    props: {
        tooltip: {
            type: String,
            required: true,
            default: ""
        }
    }
}
</script>
<style lang="sass" scoped>
</style>