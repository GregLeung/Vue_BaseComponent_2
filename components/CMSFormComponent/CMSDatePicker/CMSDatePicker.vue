<template>
    <el-form-item class="basic-information-field">
        <template slot="label">
            <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
        </template>
            <el-date-picker @input="handleOnChange" v-bind:value="value" :type="type" :placeholder="placeholder" :value-format="setValueFormat()"></el-date-picker>
    </el-form-item>
</template>

<script>
export default {
    props: {
        label:{
            type: String,
            require: true,
            default: ""
        },
        type: {
            type: String,
            required: false,
            default: "datetime"
        },
        placeholder: {
            type: String,
            required: false,
            default: "Select"
        },
        titleStyle: {
            type: Object,
            default: () => {}
        },
        value:{
            type: String
        },
        fontSize: {
            type: Number,
            required: false,
            default: 1
        }
    },
    model:{
        prop: "value",
        event: "update"
    },
    methods: {
        setValueFormat() {
            if (this.type == "date") {
                return "yyyy-MM-dd"
            }
            return "yyyy-MM-dd hh:mm:ss"
        },
        handleOnChange(value){
            this.$emit("update", value)
        }
    }
};
</script>
<style lang="sass" scoped>
.basic-information-field
  display: flex
  align-items: center
  margin-bottom: 0px
  width: 100%
</style>

