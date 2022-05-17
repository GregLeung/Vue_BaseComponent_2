<template>
<new-standard-dialog v-if="isReady" :visible.sync="visible" title="Advanced Search" @close="handleClose" lc>
    <v-container>
        <div v-for="(item, index) in headers" :key="index">
            <div v-if="item.hasOwnProperty('advancedSearch') && item.advancedSearch != null&& (!item.advancedSearch.hasOwnProperty('isHidden') || (item.advancedSearch.hasOwnProperty('isHidden') && !item.advancedSearch.isHidden))">
                <div v-if="item.advancedSearch.type == 'SELECTION'">
                    <v-select :items="item.advancedSearch.options" :label="item.text" v-model="searchFilterSet[item.value].value" item-text="label" dense outlined></v-select>
                </div>
                <div v-if="item.advancedSearch.type == 'MULTI-SELECTION' || item.advancedSearch.type == 'MULTI-SELECTION-SELECTOR'">
                    <v-select :items="item.advancedSearch.options" :label="item.text" v-model="searchFilterSet[item.value].value" item-text="label" dense outlined multiple></v-select>
                </div>
                <div v-if="item.advancedSearch.type == 'TIME-RANGE'">
                    <div class="d-flex align-center mb-4">
                        <h4>{{item.text}}:</h4> <c-m-s-date-picker v-model="searchFilterSet[item.value].value" class="mr-8" width="20em" :type="getPickerType(item)" />
                    </div>
                </div>
                <div v-if="item.advancedSearch.type == 'FREETEXT'">
                    <v-text-field
                        :label="item.text"
                        v-model="searchFilterSet[item.value].value"
                        dense outlined
                    ></v-text-field>
                </div>
                <div v-else-if="item.advancedSearch.type == 'NUMBER-RANGE'">
                        <div class="d-flex align-center mb-4">
                            <h4 class="mr-4">{{item.text}}:</h4>
                            <el-input-number class="mr-16" size="medium" v-model="searchFilterSet[item.value].value[0]"></el-input-number>
                            <p>To</p>
                            <el-input-number class="ml-16" size="medium" v-model="searchFilterSet[item.value].value[1]"></el-input-number>
                        </div>
                </div>
                <div v-else>
                    <slot :name="'advancedSearchCustom.' + item.key" :searchFilterSet="searchFilterSet"></slot>
                </div>
            </div>
            <v-divider/>
        </div>
    </v-container>
    <template slot="actionSlot">
        <v-spacer/>
        <v-btn color="primary" @click="handleConfirm">
            Confirm
        </v-btn>
    </template>
</new-standard-dialog>
</template>
<script lang="js">
import Vue from "vue";
import {NewRequest as Request, NewStandardDialog} from "vue_basecomponent"
export default{
    props: {
        visible: {
            type: Boolean,
            required: true,
            default: false,
        },
        headers: {
            type: Array,
            required: true,
            default: () => {
                return []
            },
        },
        parameters: {
            type: Object,
            required: true,
            default: () => {
                return {}
            },
        },
        tableName: {
            type: String,
            required: true,
            default: ""
        },
        paging: {
            type: Object,
            required: true,
            default: () => {
                return {}
            }
        }
    },
    components: {
        NewStandardDialog
    },
    watch: {
        visible(value){
            if(value && Object.keys(this.searchFilterSet).length == 0){
                this.searchFilterSet = this.initSearchFilterSet()
            }
        }
    },
    methods: {
        handleClose(){
            this.$emit("update:visible", false)
        },
        initSearchFilterSet(){
            this.isReady = false
            var result = {}
            console.log(this.headers.filter(f => f.hasOwnProperty("advancedSearch") && f.advancedSearch != null));
            this.headers.filter(f => f.hasOwnProperty("advancedSearch") && f.advancedSearch != null).forEach(f => {
                switch(f.advancedSearch.type){
                    case 'MULTI-SELECTION':
                        result[f.value] = {
                            type: "MULTI-SELECTION",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'SELECTION':
                        result[f.value] = {
                            type: "SELECTION",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'MULTI-SELECTION-SELECTOR':
                        result[f.value] = {
                            type: "MULTI-SELECTION-SELECTOR",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'TIME-RANGE':
                        result[f.value] = {
                            type: "TIME-RANGE",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'FREETEXT':
                        result[f.value] = {
                            type: "FREETEXT",
                            value: "",
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'NUMBER-RANGE':
                        result[f.value] = {
                            type: "NUMBER-RANGE",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                }
            })
            this.isReady = true
            return result
        },
        getPickerType(column){
            try{
                if(column.advancedSearch.hasOwnProperty("pickerType"))
                    return column.advancedSearch.pickerType
                return "daterange"
            }catch(e){
                console.log(e)
                return "daterange"
            }
        },
        async handleConfirm(){
            var searchFilterSet = this.filterNullSearchFilterSet(this.searchFilterSet)
            var parameters = Object.assign(this.parameters, {paging: this.paging, advancedSearch:  searchFilterSet})
            var res = await Request.post( "get_" + this.tableName + "_all", parameters)
            this.$emit("confirm", res.data[this.tableName].data, res.data[this.tableName].totalRow, searchFilterSet)
            this.$emit('update:visible', false)
        },
        filterNullSearchFilterSet(searchFilterSet){
            var result = {}
            Object.entries(searchFilterSet).forEach(([key, object]) =>{
                if((object.value != "" && object.value != null) || Array.isArray(object.value))
                    result[key] = object
            })
            Object.entries(result).forEach(([key, object]) =>{
                if(Array.isArray(result[key].value) && result[key].value.length == 0)
                    delete result[key]
            })
            return result
        },
    },
    data(){
        return {
            searchFilterSet: {},
            isReady: false
        }
    }
}
</script>
<style lang="sass" scoped>
</style>