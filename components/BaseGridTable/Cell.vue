<template>
<div class="cell-container" style="width: 100%; height: 100%">
    <div :class="{'is-selected': isSelected}">
        <div v-if="isEditing && isEditable">
            <c-m-s-form-input v-if="editConfig.type == 'input'" @keydown-enter="editSubmit" ref="cellEditItem" :showLabel="false" v-model="localValue"></c-m-s-form-input>
            <new-c-m-s-selector v-else-if="editConfig.type == 'select'"  :showLabel="false" @change="(value)=> editSubmitSelector(value, editConfig, row)" :options="editConfig.options(row)" :clearable="editConfig.clearable != null ?  editConfig.clearable(row): true" :multiple="editConfig.multiple != null ?  editConfig.multiple(row): false" @clear="()=>{if(editConfig.clear != null) editConfig.clear(row)}" :isPopOver="editConfig.isPopOver != null ?  editConfig.isPopOver(row): false" v-model="localValue">
                <div slot="popOver">
                    <slot :name="column.prop + '-popOver'" :row="row" :isEditing="isEditing" :isEditable="isEditable" :editConfig="editConfig" :isSelected="isSelected"></slot>
                </div>
            </new-c-m-s-selector>
            <c-m-s-date-picker v-else-if="editConfig.type == 'date'" :type="editConfig.pickerType != null ?  editConfig.pickerType(row): 'date'" @update="editSubmit" :showLabel="false" v-model="localValue"></c-m-s-date-picker>
            <slot :name="column.prop + '-active'" :row="row" :isEditing="isEditing" :isEditable="isEditable" :editConfig="editConfig" :isSelected="isSelected"></slot>
        </div>
        <div v-else>
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
        }
    },
    watch: {
        isEditing(val, oldVal){
            if(val){
                this.localValue = this.getDeepObjectProp(this.row, this.columnProp)
                this.isSelected = false
            }
        },
    },
    methods: {
        focus(){
            if(this.$refs.cellEditItem != null)
                this.$refs.cellEditItem.focus();
        },
        editSubmit(isRemoveEditFocus = true){
            if(isRemoveEditFocus)
                this.sibilingRefList.forEach(f => f.isEditing = false)
            var cloneRow = this.deepClone(this.row)
            this.assignDeepValue(cloneRow, this.columnProp, this.localValue)
            this.$emit("cell-update", this.localValue, this.columnProp, cloneRow, this.row, this.column)
            setTimeout(() =>{
                this.isSelected = true
            },10)
        },
        unFocus(){
            this.isEditing = false
            this.isSelected = false
        },
        editSubmitSelector(value, editConfig, row){
            this.localValue = value
            if(editConfig.multiple(row))
                this.editSubmit(false)
            else
                this.editSubmit(true)
        },
        convertValueToLabel(value, options){
            var selectedOption = options.find(f => f.value == value)
            if(selectedOption == null)
                return value
            else
                return selectedOption.label
        },
    },
    data() {
        return {
            isEditing: false,
            isSelected: false,
            localValue: null,
            sibilingRefList: []
        }
    }
}
</script>

<style lang="sass" scoped>
// .cell-container
//     height: 2em
.is-selected
    min-height: 2em
    border-style: solid
    border-color: blue
    border-width: thin
</style>
