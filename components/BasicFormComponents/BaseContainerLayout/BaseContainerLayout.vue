<template>
<div class="page-wrapper p-t-45 p-b-50">
    <div class="wrapper wrapper--w790" :style="wrapperStyle">
        <div class="card card-5">
            <div class="card-heading" :style="headingStyle">
                <h2 class="title">{{title}}</h2>
            </div>
            <slot></slot>
            <div class="card-body">
                <nuxt />
            </div>
        </div>
    </div>
</div>
</template>

<script lang="js" scoped>
export default {
    name: "BaseContainerLayout",
    props: {
        headingStyle: {
            type: Object,
            default: () =>{}
        },
    },
    data() {
        return {
            title: "Title",
            wrapperStyle: {},
        }
    },
};
</script>

<style lang="sass" scoped>
@import '../css/main.css'
.card-5 .card-body
    padding: 30px 20px
    
</style>