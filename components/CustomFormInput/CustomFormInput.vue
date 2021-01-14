<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-input @blur="handleBlur" @focus="handleFocus" :maxlength="maxlength" :disabled="disabled" :placeholder="placeholder" :type="type" :show-password="showPassword"  :rows="rows" v-model="localValue" @input="handleOnChange">
        <el-select v-if="options != null" v-model="appendSelect" :options="options" :slot="selectorPosition" :placeholder="$t('Select')" :style="'width: ' + appendWidth">
            <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
    </el-input>
</div>
</template>

<script lang="js">
import Vue from "vue";
export default Vue.extend({
    props: {
        label: {
            type: String,
            required: true,
            default: ""
        },
        disabled: {
            type: Boolean,
            require: true,
            default: false
        },
        showPassword: {
            type: Boolean,
            requored: false,
            default: false
        },
        value: {
            type: [String, Number]
        },
        direction: {
            type: String,
            required: false,
            default: "horizontal"
        },
        fontSize: {
            type: Number,
            required: false,
            default: 1
        },
        rows:{
            type: Number,
            required: false
        },
        labelWidth: {
            type: String,
            required: false
        },
        maxlength: {
            type: Number,
            required: false,
            default: 50
        },
        placeholder: {
            type: String,
            required: false,
            default: ""
        },
        iconClick: {
            type: Function,
            required: false
        },
        icon: {
            type: String,
            required: false
        },
        select: {
            type: String,
            required: false
        },
        options: {
            type: Array,
            required: false
        },
        appendSelect: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true,
            default: ""
        },
        appendWidth: {
            type: String,
            required: false,
            default: '7em'
        },
        sperateSign: {
            type: String,
            required: false,
            default: ''
        },
        selectorPosition: {
            type: String,
            required: false,
            default: "prepend"
        }
    },
    watch:{
        appendSelect: {
            handler(val, oldValue){
                this.$emit("update:appendSelect", val);
            }
        },
        value(val){
            this.localValue = val
        },
        localValue(val){
            this.$emit("update:value", val)
        }
    },
    mounted(){
        this.type = "text";
        if(this.sperateSign != '') this.$emit("update:value", this.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.sperateSign));
    },
    methods:{
        handleOnChange(value){
            this.localValue = value
        },
        handleFocus(event){
            this.type = "number";
            if(this.sperateSign != '') this.localValue = this.localValue.toString().replaceAll(this.sperateSign, "")
        },
        handleBlur(){
            this.type = "text";
            if(this.sperateSign != '') this.localValue = this.localValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.sperateSign)
        }
    },
    data(){
        return{
            type: "",
            localValue: ""
        }
    }
})
</script>

<style lang="sass" scoped>
.basic-information-field
    display: flex
    align-items: center
    justify-content: flex-start
    margin-bottom: 0px
    width: 100%
h1
    overflow: hidden
    margin: 0
    // white-space: nowrap
label
    vertical-align: middle
    float: left
    font-size: 1rem
    color: #606266
    padding: 0 12px 0 0
    box-sizing: border-box
</style>