<template>
<div class="cell-container" style="width: 100%; height: 100%">
    <div :class="{'is-selected': isSelected, 'is-copy': isCopy, 'is-sub-selected': isSubSelected}">
        <div v-if="isEditing && isEditable">
            <c-m-s-form-input  v-if="editConfig.type == 'input'" @keydown-enter="handleKeyDown" ref="cellEditItem" :showLabel="false" v-model="localValue" @blur="editSubmit" selectOnFocus/>
            <new-c-m-s-selector ref="cellEditItem" v-else-if="editConfig.type == 'select'"  :showLabel="false" @change="(value)=> editSubmitSelector(value, editConfig, row)" :options="editConfig.options(row)" :clearable="editConfig.clearable != null ?  editConfig.clearable(row): true" :multiple="editConfig.multiple != null ?  editConfig.multiple(row): false" @clear="()=>{if(editConfig.clear != null) editConfig.clear(row)}" :isPopOver="editConfig.isPopOver != null ?  editConfig.isPopOver(row): false" v-model="localValue">
                <div slot="popOver">
                    <slot :name="column.prop + '-popOver'" :row="row" :isEditing="isEditing" :isEditable="isEditable" :editConfig="editConfig" :isSelected="isSelected"></slot>
                </div>
            </new-c-m-s-selector>
            <c-m-s-date-picker ref="cellEditItem" v-else-if="editConfig.type == 'date'" :type="editConfig.pickerType != null ?  editConfig.pickerType(row): 'date'" @confirm="editSubmit" :showLabel="false" v-model="localValue"></c-m-s-date-picker>
            <slot :name="column.prop + '-active'" :row="row" :isEditing="isEditing" :isEditable="isEditable" :editConfig="editConfig" :isSelected="isSelected"></slot>
        </div>
        <div :style="cellStyle" v-else>
            <span v-if="column.hasOwnProperty('parseValue') && parseData(row, column, column.prop) != null">
            <el-tag :type="parseData(row, column, column.prop).type">{{ parseData(row, column, column.prop).label }}</el-tag>
            </span>
            <span v-else-if="showValue != null">{{showValue}}</span>
            <span class="word-break" v-else-if="column.hasOwnProperty('format')">{{ column.format(row[column.prop], row) }}</span>
            <span class="word-break" v-else-if="editConfig.type == 'select'">{{convertValueToLabel(getDeepObjectProp(row,column.prop), editConfig.options(row))}}</span>
            <span class="word-break" v-else>{{ getDeepObjectProp(row,column.prop)}}</span>
            <slot :name="column.prop + '-inactive'" :row="row" :isEditing="isEditing" :isEditable="isEditable" :editConfig="editConfig" :isSelected="isSelected"></slot>
        </div>
    </div>
</div>
</template>

<script lang="js">

import Vue from "vue";
import { Request, Util } from "vue_basecomponent";
export default {    
    props: {
        column: {
            type: Object,
            required: true,
            default: () => {
                return {}
            }
        },
        row: {
            type: Object,
            required: true,
            default: () => {
                return {}
            }
        },
        columnProp: {
            type: String,
            required: false,
        },
        column: {
            type: Object,
            required: true
        },
        columnIndex: {
            type: Number,
            required: true,
        },
        showValue: {
            type: [String, Number]
        },
        isEditable: {
            type: Boolean,
            required: false,
            default: true
        },
        editConfig: {
            type: Object,
            required: false,
            default: function(){
                return {
                    type: "input"
                }
            }
        },
        cellUpdate: {
            type: Function,
            required: false,
            default: function(){
                
            }
        },
        cellStyle: {
            type: Object,
            required: false,
            default: function(){
                
            }
        }
    },
    watch: {
        isEditing(val, oldVal){
            if(val){
                this.localValue = this.getDeepObjectProp(this.row, this.columnProp)
                if(this.lastValidValue == null) 
                    this.lastValidValue = this.localValue
                this.isSelected = false
            }
        },
    },
    methods: {
        checkLocalValueValid(){
            var isValid = true;
            if(this.editConfig.type == "date"){
                if(this.$moment(this.localValue, "YYYY-MM-DD", true).isValid())
                    this.localValue = this.$moment(this.localValue, "YYYY-MM-DD", true).format("YYYY-MM-DD")
                else if(this.$moment(this.localValue, "D/M/YYYY", true).isValid())
                    this.localValue = this.$moment(this.localValue, "D/M/YYYY", true).format("YYYY-MM-DD")
                else if(this.$moment(this.localValue, "DD/MM/YYYY", true).isValid())
                    this.localValue = this.$moment(this.localValue, "DD/MM/YYYY", true).format("YYYY-MM-DD")

            }else if(this.editConfig.type == 'number'){
                if(!isNaN(this.localValue.replaceAll(",", "")))
                    this.localValue = Number(this.localValue.replaceAll(",", ""))
            }
            else if(this.editConfig.type == 'select'){
                var selectedOption = this.editConfig.options(this.row).find(f => f.label == this.localValue || f.value == this.localValue)
                if(selectedOption == null)
                    isValid = false
                else
                    this.localValue = selectedOption.value
            }
            if(!isValid)
                this.localValue = this.lastValidValue
            return isValid;
        },
        getRowIndex(){
            return this.row.innerProperty.rowIndex
        },
        getDisplay(){
            var result = "";
            if(this.showValue != null)
                result = this.showValue
            else if(this.column.hasOwnProperty('format'))
                result = this.column.format(this.row[this.column.prop], this.row)
            else if(this.editConfig.type == 'select')
                result = this.convertValueToLabel(this.getDeepObjectProp(this.row,this.column.prop), this.editConfig.options(this.row))
            else
                result = this.getDeepObjectProp(this.row,this.column.prop)
            if(result == null)
                return ""
            else
                return result
        },
        handleKeyDown(){
            document.activeElement.blur();
        },
        focus(){
            if(this.$refs.cellEditItem != null)
                this.$refs.cellEditItem.focus();
        },
        async editSubmit(isRemoveEditFocus = true){
            if(this.checkLocalValueValid()){
                if(isRemoveEditFocus)
                    this.sibilingRefList.forEach(f => f.isEditing = false)
                var cloneRow = this.deepClone(this.row)
                this.assignDeepValue(cloneRow, this.columnProp, this.localValue)
                this.cellUpdate(this.localValue, this.columnProp, cloneRow, this.row, this.column)
                this.lastValidValue = this.localValue
                await this.timeout(10)
                this.isSelected = true
            }
        },
        unFocus(){
            this.isEditing = false
            this.isSelected = false
            this.isSubSelected = false
            this.isCopy = false
        },
        editSubmitSelector(value, editConfig, row){
            this.localValue = value
            if(editConfig.multiple(row))
                this.editSubmit(false)
            else
                this.editSubmit(true)
        },
        convertValueToLabel(value, options){
            try{
                var selectedOption = options.find(f => f.value == value)
                if(selectedOption == null)
                    return value
                else
                return selectedOption.label
            }catch(e){
                console.log(e);
                return value
            }
        },
        timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    },
    data() {
        return {
            isEditing: false,
            isSelected: false,
            isSubSelected: false,
            isCopy: false,
            localValue: null,
            lastValidValue: null,
            sibilingRefList: []
        }
    }
}
</script>

<style lang="sass" scoped>
@import "@/static/variables.scss"
.is-selected
    min-height: 2em
    border-style: solid
    border-color: $main-theme-plain
    border-width: thin
.is-sub-selected
    min-height: 2em
    border-style: solid
    border-color: $main-theme-plain
    border-width: thin
    background: rgba(0,0,0,0.3)
.is-copy 
    height: 100%
    width: 100%
    background: linear-gradient(90deg, $main-theme-plain 50%, transparent 50%), linear-gradient(90deg, $main-theme-plain 50%, transparent 50%), linear-gradient(0deg, $main-theme-plain 50%, transparent 50%), linear-gradient(0deg, $main-theme-plain 50%, transparent 50%)
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y
    background-size: 8px 2px, 8px 2px, 2px 8px, 2px 8px
    background-position: 0% 0%, 100% 100%, 0% 100%, 100% 0px
    border-radius: 1px
    animation: dash 10s linear infinite


@keyframes dash 
    to 
        background-position: 100% 0%, 0% 100%, 0% 0%, 100% 100%
</style>
