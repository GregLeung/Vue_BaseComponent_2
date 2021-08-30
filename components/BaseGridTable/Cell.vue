<template>
<div class="cell-container" style="width: 100%; height: 100%">
    <div :class="{'is-selected': isSelected}">
        <div v-if="isEditing && isEditable">
            <c-m-s-form-input v-if="editConfig.type == 'input'" @keyup-enter="editSubmit" ref="cellEditItem" :showLabel="false" v-model="localValue"></c-m-s-form-input>
            <new-c-m-s-selector v-else-if="editConfig.type == 'select'"  :showLabel="false" @change="editSubmitSelector" :options="editConfig.options(row)" v-model="localValue"></new-c-m-s-selector>
            <c-m-s-date-picker v-else-if="editConfig.type == 'date'" @update="editSubmit" :showLabel="false" v-model="localValue"></c-m-s-date-picker>
        </div>
        <div v-else>
            <span v-if="column.hasOwnProperty('parseValue') && parseData(row, column, column.prop) != null">
                <el-tag :type="parseData(row, column, column.prop).type">{{ parseData(row, column, column.prop).label }}</el-tag>
            </span>
            <span v-else-if="showValue != null">{{showValue}}</span>
            <span class="word-break" v-else-if="column.hasOwnProperty('format')">{{ column.format(row[column.prop]) }}</span>
            <span class="word-break" v-else-if="editConfig.type == 'select'">{{convertValueToLabel(getDeepObjectProp(row,column.prop), editConfig.options(row))}}</span>
            <span class="word-break" v-else>{{ getDeepObjectProp(row,column.prop)}}</span>
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
            this.$refs.cellEditItem.focus();
        },
        editSubmit(){
            this.sibilingRefList.forEach(f => f.isEditing = false)
            var cloneRow = this.deepClone(this.row)
            this.assignDeepValue(cloneRow, this.columnProp, this.localValue)
            this.$emit("cell-update", this.localValue, this.columnProp, cloneRow, this.row,)
        },
        unFocus(){
            this.isEditing = false
            this.isSelected = false
        },
        editSubmitSelector(value){
            this.localValue = value
            this.editSubmit()
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
