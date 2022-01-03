<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-input @blur="handleBlur" :style="{'width': width}" @focus="handleFocus" :maxlength="maxlength" :disabled="disabled" :placeholder="placeholder" :type="type" :show-password="showPassword"  :rows="rows" v-model="localValue">
        <el-select :disabled="appendDisabled" :clearable="clearable" v-if="options != null" v-model="localAppendSelect" :options="options" :slot="place" :placeholder="$t('Select')" :style="'width: ' + appendWidth">
            <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
    </el-input>
</div>
</template>

<script lang="js">
import Vue from "vue";
export default {
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
        appendDisabled: {
            type: Boolean,
            require: true,
            default: false
        },
        showPassword: {
            type: Boolean,
            requored: false,
            default: false
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
        },
        value: {
            type: [String, Number],
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
        place: {
            type: String,
            required: false,
            default: 'append'
        },
        clearable: {
            type: String,
            required: false,
            deafult: true
        },
        width: {
            type: String,
            require: false,
            default: "100%"
        },
        formateType: {
            type: String,
            require: false,
            default: "Number"
        },
        decimalNumber: {
            type: Number,
            require: false,
            default: 3
        }
        
    },
    watch:{
        localAppendSelect: {
            handler(val, oldValue){
                this.$emit("update:appendSelect", val);
            }
        },
        localValue(val, oldValue){
            var rawValue = this.convertOriginalNumber(val)
            if(this.type == "text"){
                val = this.convertNumberWithSeperation(val)
                this.localValue = val
            }
            this.$emit("update:value", rawValue == "" ? null : rawValue)
        },
        value(val, oldVal){
            this.localValue = this.value
            this.$emit("valueChange", val)
        },
        appendSelect(val, oldVal){
            this.localAppendSelect = this.appendSelect
            this.$emit("selectChange", val)
        }
    },
    mounted(){
        this.type = "text";
        if(this.sperateSign != '') this.localValue = this.convertNumberWithSeperation(this.value)
        else this.localValue = this.value
        this.localAppendSelect = this.appendSelect
    },
    methods:{
        isNumeric(str) {
            if (typeof str != "string") return false
            return !isNaN(str) && !isNaN(parseFloat(str))
        },
        handleFocus(event){
            try{
                this.type = "number";
                if(this.sperateSign != '') this.localValue = this.convertOriginalNumber(this.localValue)
            }catch(error){
                console.log(error);
            }
        },
        handleBlur(){
            try{
                this.type = "text";
                if(this.formateType == "Number" && this.decimalNumber != null)
                    this.localValue = Number(this.localValue).toFixed(this.decimalNumber)
                if(this.sperateSign != '') this.localValue = this.convertNumberWithSeperation(this.localValue)
            }catch(error){
                console.log(error);
            }
        },
        convertNumberWithSeperation(val, defaultValue = ""){
            return (val != null) ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.sperateSign): defaultValue
        },
        convertOriginalNumber(val, defaultValue = ""){
            return (val != null) ? val.toString().replaceAll(this.sperateSign, ""): defaultValue
        }
    },
    data(){
        return{
            type: "",
            localValue: null,
            localAppendSelect: null,
        }
    }
}
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