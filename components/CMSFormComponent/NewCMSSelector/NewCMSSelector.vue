<template>
  <div :class="{ 'basic-information-field': direction == 'horizontal' }" :style="customStyle">
    <label v-if="showLabel" :style="{ 'min-width': labelWidth, 'max-width': labelWidth }">
      <h1 :style="{ 'font-size': fontSize + 'rem' }">{{ label }}</h1>
    </label>
    <el-select
      v-model="localValue"
      @change="$emit('change', $event)"
      :loading="loading"
      :remote="remote"
      :remote-method="remoteMethod"
      @clear="handleClear"
      @focus="handleFocus"
      :clearable="clearable"
      :multiple="multiple"
      filterable
      :disabled="disabled"
    >
    <el-option
      v-for="item in localOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled">
    </el-option>
    </el-select>
    <slot></slot>
  </div>
</template>
<script lang="js">
import Vue from "vue";
export default{
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
            require: true,
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
        multiple: {
            type: Boolean,
            require: true,
            default: false
        },
    },
    model: {
        prop: "value",
        event: "update"
    },
    watch: {
        value(val, oldVal){
            this.localValue = this.value
        },
        options(val, oldVal){
            var tmp = this.deepClone(this.options)
            tmp.sort((a,b) => a.label.localeCompare(b.label))
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
        },
        remoteMethod(value){
            this.loading = true
            this.$emit('remoteMethod', value, (options) => {
                this.localOptions = options
                this.localOptions.sort((a,b) => a.label.localeCompare(b.label))
                this.loading = false
            })
        },
        handleFocus(event){
            if(this.remote)
                this.remoteMethod(null)
            this.$emit("focus", event)
        }
    },
    created(){
        this.localOptions = this.deepClone(this.options)
        this.localOptions.sort((a,b) => a.label.localeCompare(b.label))
        this.localValue = this.value
    },
    data(){
        return {
            localOptions: [],
            localValue: null,
            loading: false
        }
    }
}
</script>
<style lang="sass" scoped>
@import "../cmsInput.sass"

::v-deep .el-input__inner
    text-transform: var(--textTransform)
</style>
</style>