<template>
  <div :class="{ 'basic-information-field': direction == 'horizontal' }" :style="customStyle">

    <label v-if="showLabel" :style="{ 'min-width': labelWidth, 'max-width': labelWidth }">
      <h1 :style="{ 'font-size': fontSize + 'rem' }">{{ label }}</h1>
    </label>
    
    <el-select
      v-model="localValue"
      ref="select"
      @change="$emit('change', $event)"
      :loading="loading"
      :remote="remote"
      :remote-method="remoteMethod"
      @clear="handleClear"
      @focus="handleFocus"
      @blur="$emit('blur', $event)"
      :clearable="clearable"
      :multiple="multiple"
      :filterable="filterable"
      :disabled="disabled"
      :placeholder="placeholder"
      :style="{'width': width}"
      popper-class="select-down"
      :allow-create="autoCreate"
      :default-first-option="autoCreate"
    >
    <el-option
      v-for="item in localOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :style="cssVars"
      :disabled="item.disabled">
      <div v-if="isPopOver">
        <el-popover
        placement="right"
        width="400"
        trigger="hover">
            <slot name="popOver" :value="item.value" :label="item.label"></slot>
            <div slot="reference" style="width: 100%;">
                <span>{{ item.label }}</span>
            </div>
        </el-popover>
      </div>
    </el-option>
    </el-select>
    <slot></slot>
  </div>
</template>
<script lang="js">
import Vue from "vue";
export default {
    props: {
        showLabel: {
            type: Boolean,
            required: false,
            default: true
        },
        customStyle: {
            type: Object,
            default: ()=>{
                return {}
            }
        },
        label: {
            type: String,
            require: false,
            default: ""
        },
        labelWidth: {
            type: String,
            required: false
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
        options: {
            type: Array,
            default: () => {
                return []
            }
        },
        value: {
            type: [Array, String, Number, Boolean],
            default: null
        },
        remote: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            require: true,
            default: false
        },
        clearable: {
            type: Boolean,
            require: true,
            default: false
        },
        filterable: {
            type: Boolean,
            require: false,
            default: true
        },
        multiple: {
            type: Boolean,
            require: true,
            default: false
        },
        placeholder: {
            type: String,
            require: false,
        },
        width: {
            type: String,
            require: false,
            default: "100%"
        },
        isPopOver: {
            type: Boolean,
            require: false,
            default: false
        },
        menuItemFontSize: {
            type: String,
            default: "14px"
        },
        getUnShowedValue:{
            type: Function,
            default: (value)=>{
                return {label: value, value: value, disabled: true}
            }
        },
        autoCreate:{
            type: Boolean,
            require: false,
            default: false
        }
    },
    model: {
        prop: "value",
        event: "update"
    },
    watch: {
        value(val, oldVal){
            this.localValue = this.value
            if(this.remote)
                this.remoteMethod(this.localValue)
        },
        options(val, oldVal){
            var tmp = this.deepClone(this.options)
            this.localOptions = tmp
        },
        localOptions(val, oldVal){
            this.$emit('update:options', val)
        },
        localValue(val, oldVal){
            this.$emit('update', val)
        },
    },
    methods: {
        handleClear(){
            this.localValue = null
            this.$emit('clear', this.localValue)
        },
        remoteMethod(value){
            this.loading = true
            this.$emit('remoteMethod', value, async (options) => {
                this.localOptions = options
                await this.getUnknowOption()
                this.loading = false
            })
        },
        handleFocus(event){
            if(this.remote)
                this.remoteMethod(this.localValue)
            this.$emit("focus", event)
        },
        focus(){
            this.$refs.select.focus()
        },
        isValueInOptions(value){
            if(value == null || value == "") return true
            if(this.multiple == true) return true
            return this.localOptions.find(f => f.value == value)
        },
        async getUnknowOption(){
            if(!this.isValueInOptions(this.localValue) && !this.remote){
                var options = await this.getUnShowedValue(this.localValue)
                this.localOptions.push(options)
            }
        }
    },
    async created(){
        this.localOptions = this.deepClone(this.options)
        this.localValue = this.value
        this.handleFocus()
        await this.getUnknowOption()
    },
    data(){
        return {
            localOptions: [],
            localValue: null,
            loading: false
        }
    },
    computed: {
        cssVars(){
            return{
                // "--menuItemColor": this.menuItemColor,
                "--menuItemFontSize": this.menuItemFontSize
            }
        }
    }
}
</script>
<style lang="sass" scoped>
@import "../cmsInput.sass"

.select-down
    .el-select-dropdown__item
        font-size: var(--menuItemFontSize)
</style>