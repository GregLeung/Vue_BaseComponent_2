<template>
<div :class="{'basic-information-field': (direction == 'horizontal')}">
    <label :style="{'min-width': labelWidth, 'max-width': labelWidth}">
        <h1 :style="{'font-size':  fontSize + 'rem'}">{{label}}</h1>
    </label>
    <el-select  :remote="customFilter" :remote-method="handleFilter" :multiple="multiple" :disabled="disabled" :filterable="filterable" :clearable="clearable" v-model="optionValue" :placeholder="placeholder" @input="handleOnChange" @change="$emit('change', $event)">
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
            default: function(){
                return []
            }
        },
        clearable: {
            type: Boolean,
            required: false,
            default: false
        },
        filterable: {
            type: Boolean,
            required: false,
            default: true
        },
        labelWidth: {
            type: String,
            required: false
        },
        multiple: {
            type: Boolean,
            required: false,
            default: false
        },
        customFilter: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    model: {
        prop: "value",
        event: "update"
    },
    watch: {
        value: function(value, oldVal) {
            if(this.isOptionsExisted())
                this.updateValue(value)   
        },
        options: function(value, oldVal) {
            if(this.isOptionsExisted())
                this.updateValue(value)   
        },
    },
    methods: {
        handleFilter(value){
            this.$emit("onFilterChange", value)
        },
        handleOnChange(value) {
            if(this.multiple){
                this.optionValue = value
                var answer = this.optionValue.map(f => this.options[f].value)
                this.$emit("update", answer)
                this.$emit("customChange", answer)
            }else{
                if(this.notNullNotEmpty(value)){
                    var answer = this.options[value].value
                    this.$emit("update", answer)
                    this.$emit("customChange", answer)
                    this.optionValue = value
                }else{
                    this.$emit("update", null)
                    this.$emit("customChange", null)
                }
            }
        },
        updateValue(value){
            try{
                if(Array.isArray(this.value))
                    this.optionValue = this.value.map(each => {
                        return this.dataOptions[this.options.findIndex(f => this.isObjectEquivalent(f.value, each))].value
                    })
                else
                    this.optionValue = this.dataOptions[this.options.findIndex(f => f.value == this.value)].value
            }catch(e){
                this.optionValue = null
            }
        },
        isOptionsExisted(){
            return this.options.length > 0
        }
    },
    created(){
        if(this.value != null && this.value !== "" && this.isOptionsExisted())
            this.updateValue(this.value)
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
@import "../cmsInput.sass"
.el-select
    width: 100%
</style>
