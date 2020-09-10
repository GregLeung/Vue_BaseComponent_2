<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-select :multiple="multiple" :disabled="disabled" :filterable="filterable" :clearable="clearable" v-bind:value="optionValue" :placeholder="placeholder" @input="handleOnChange" @change="$emit('change', $event)">
        <el-option class="input" v-for="item in dataOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
</div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            require: true,
            default: ""
        },
        disabled: {
            type: Boolean,
            require: true,
            default: false
        },
        placeholder: {
            type: String,
            required: false,
        },
        value: {
            type: [Number, String, Object, Array]
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
            default: []
        },
        clearable: {
            type: Boolean,
            required: false,
            default: false
        },
        filterable: {
            type: Boolean,
            required: false,
            default: false
        },
        labelWidth: {
            type: String,
            required: false
        },
        multiple: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    model: {
        prop: "value",
        event: "update"
    },
    methods: {
        handleOnChange(value) {
            if(this.multiple){
                this.optionValue = value
                this.$emit("update", this.optionValue.map(f => this.options[f].value))
            }else{
                this.$emit("update", this.options[value].value)
                this.optionValue = value
            }
        }
    },
    data(){
        return {
            optionValue: ""
        }
    },
    computed:{
        dataOptions(){
            return this.options.map((f, index)=>{
                return {
                    label: f.label,
                    value: index
                };
            })
        }
    },
};
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
