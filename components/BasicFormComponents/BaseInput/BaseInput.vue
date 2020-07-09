<template>
<div>
    <div :class="{'form-row': direction == 'row'}">
        <div class="name input-title" :style="titleStyle">{{title}}</div>
        <input @input="handleOnChange(value)" v-model="value" class="input--style-5" type="text" name="name" />
    </div>
</div>
</template>

<script>
export default {
    props: {
        title: String,
        validateMessage: String,
        direction: {
            type: String,
            default: "row"
        },
        change: {
            type: Function,
            default: text => {}
        },
        titleStyle: {
            type: Object,
            default: () => {}
        }
    },
    model:{
        prop: "value",
        event: "update"
    },
    data: () => {
        return {
            value: "",
        };
    },
    methods:{
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
