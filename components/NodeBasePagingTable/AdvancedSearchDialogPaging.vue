<template>
    <el-drawer v-if="isReady" :visible.sync="visible" direction="btt"  @close="handleDialogClose" size="95%" :append-to-body="true">
        <div slot="title">
            <advanced-search-title-bar v-model="searchFilterSet" :columnList="columnList"/>
        </div>
    <el-card>
        <div v-for="(item, index) in columnList" :key="index">
        <div v-if="item.hasOwnProperty('advancedSearch') && (!item.advancedSearch.hasOwnProperty('isHidden') || (item.advancedSearch.hasOwnProperty('isHidden') && !item.advancedSearch.isHidden))">
            <div class="base-row">
                <h4>{{item.label}}</h4>
                <div style="width: 80%">
                    <div v-if="item.advancedSearch.type == 'SELECTION'">
                        <new-c-m-s-selector v-if="item.advancedSearch.remote" :showLabel="false" :remote="item.advancedSearch.remote" @remoteMethod="item.advancedSearch.remoteMethod" v-model="searchFilterSet[item.prop].value" :options="item.advancedSearch.options"></new-c-m-s-selector>
                        <new-c-m-s-selector v-else :remote="item.advancedSearch.remote" :showLabel="false" v-model="searchFilterSet[item.prop].value" :options="item.advancedSearch.options"></new-c-m-s-selector>
                    </div>
                    <div v-else-if="item.advancedSearch.type == 'MULTI-SELECTION'">
                        <i :ref="'collapse-button_' + item.prop" v-if="item.advancedSearch.options.length > 4" @click="handleOpenCollapse(item.prop)" class="el-icon-arrow-right" style="float: right; margin-top: 10px; cursor: pointer"></i>
                        <div :ref="'collapse-container_' + item.prop" style="height: 54px; overflow: hidden">
                            <base-check-box-group v-model="searchFilterSet[item.prop].value" :checkBoxList="item.advancedSearch.options"></base-check-box-group>
                        </div>
                    </div>
                    <div v-else-if="item.advancedSearch.type == 'MULTI-SELECTION-SELECTOR'">
                        <div class="space-between-row">
                            <new-c-m-s-selector :disabled="searchFilterSet[item.prop].value.some(f => f == null)" style="flex-grow: 1" v-if="item.advancedSearch.remote" :showLabel="false" multiple :remote="item.advancedSearch.remote" @remoteMethod="item.advancedSearch.remoteMethod" v-model="searchFilterSet[item.prop].value" :options="item.advancedSearch.options"></new-c-m-s-selector>
                            <new-c-m-s-selector :disabled="searchFilterSet[item.prop].value.some(f => f == null)" style="flex-grow: 1" v-else :showLabel="false" v-model="searchFilterSet[item.prop].value" multiple :options="item.advancedSearch.options"></new-c-m-s-selector>
                             <el-checkbox @change="() => {searchFilterSet[item.prop].value = searchFilterSet[item.prop].value.filter(f => f == null)}" v-model="searchFilterSet[item.prop].value" v-if="item.advancedSearch.hasOwnProperty('isNullAble') && item.advancedSearch.isNullAble" class="ml-12">{{(item.advancedSearch.hasOwnProperty("emptyText")) ? item.advancedSearch.emptyText: "No"}}</el-checkbox>
                        </div>
                    </div>
                    <div v-else-if="item.advancedSearch.type == 'TIME-RANGE'">
                        <c-m-s-date-picker @update="(value) => {handleDateChange(value, searchFilterSet[item.prop])}" v-model="searchFilterSet[item.prop].value" class="mr-8" width="20em" :type="getPickerType(item)" />
                    </div>
                    <div v-else-if="item.advancedSearch.type == 'FREETEXT'">
                        <el-input
                            placeholder="Search"
                            v-model="searchFilterSet[item.prop].value"
                            clearable>
                        </el-input>
                    </div>
                    <div v-else-if="item.advancedSearch.type == 'NUMBER-RANGE'">
                        <div class="base-row">
                            <el-input-number class="mr-16" size="medium" v-model="searchFilterSet[item.prop].value[0]"></el-input-number>
                            <p>To</p>
                            <el-input-number class="ml-16" size="medium" v-model="searchFilterSet[item.prop].value[1]"></el-input-number>
                        </div>
                    </div>
                    <div v-else>
                        <slot :name="'advancedSearchCustom.' + item.key" :searchFilterSet="searchFilterSet" :whereOperation="whereOperation" :computed="computed"></slot>
                    </div>
            </div>
            </div>
            <el-divider/>
          </div>
      </div>
      <div class="button-container">
          <el-button type="primary" class="mt-12 confirm-button"  @click="handleConfirm">Confirm</el-button>
        </div>
    </el-card>
    </el-drawer>
</template>
<script lang="js">
import Vue from "vue";
import moment from "moment";
import {NodeRequest as Request} from "vue_basecomponent";
import { Util, NewCMSSelector, BaseCheckBox,BaseCheckBoxGroup,AdvancedSearchTitleBar } from "vue_basecomponent";
export default {
    props: {
        visible: {
            type: Boolean,
            required: true,
            default: false
        },
        columnList: {
            type: Array,
            required: true,
            default: []
        },
        tableName: {
            type: String,
            required: true,
        },
        // paging: {
        //     type: Object,
        //     required: true
        // },
        pageSize: {
            type: Number,
            required: true
        },
        page: {
            type: Number,
            required: true
        },
        sort: {
            required: false
        },
        sortOrder: {
            type: String,
            required: true
        },
        joinClass: {
            type: Array,
            requried: false,
            default: function(){
                return []
            },
        },
        whereOperation: {
            type: Array,
            requried: false,
            default: function(){
                return []
            },
        },
        computed: {
            type: Array,
            requried: false,
            default: function(){
                return []
            },
        },
        width: {
            type: String,
            required: false,
            default: '50%'
        },
        top: {
            type: String,
            required: false,
            default: '0vh'
        }
    },
    created(){
        this.searchFilterSet = this.initSearchFilterSet()
    },
    methods: {
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
        handleOpenCollapse(propName){
            var ref = this.$refs["collapse-container_" + propName][0]
            var refCollapseButton = this.$refs["collapse-button_" + propName][0]
            if(ref.style.height == "54px"){
                ref.style.height = "100%"
                refCollapseButton.classList.value = ["el-icon-arrow-down"]
            }
            else{
                ref.style.height = "54px"
                refCollapseButton.classList.value = ["el-icon-arrow-right"]
            }
        },
        handleClearSearch(){
            this.searchFilterSet = this.initSearchFilterSet()
        },
        handleDialogClose() {
            this.$el.scrollTop = 0
            this.$emit('update:visible', false)
        },
        async handleConfirm(){
            try{
                var searchFilterSet = this.filterNullSearchFilterSet(this.searchFilterSet)
                var parameters = {
                    advancedSearch:  searchFilterSet,
                    joinClass: this.joinClass,
                    page: this.page,
                    pageSize: this.pageSize,
                    sort: this.sort,
                    sortOrder: this.sortOrder
                }
                if(this.whereOperation.length > 0)
                    parameters.whereOperation = this.whereOperation
                if(this.computed.length > 0)
                    parameters.computed = this.computed
                var res = await Request.post("get/" + this.tableName, parameters)
                console.log(res);
                this.$emit("confirm", res.data[this.tableName].data, res.data[this.tableName].totalRow, searchFilterSet)
                this.$emit('update:visible', false)
            }catch(e){
                this.alert(e)
            }
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
        handleDateChange(value, model){
            var endDate = value[1].split(" ")[0] + " 23:59:59"
            model.value = [value[0], endDate]
        },
        initSearchFilterSet(){
            this.isReady = false
            var result = {}
            this.columnList.filter(f => f.hasOwnProperty("advancedSearch")).forEach(f => {
                switch(f.advancedSearch.type){
                    case 'MULTI-SELECTION':
                        result[f.prop] = {
                            type: "MULTI-SELECTION",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'SELECTION':
                        result[f.prop] = {
                            type: "SELECTION",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'MULTI-SELECTION-SELECTOR':
                        result[f.prop] = {
                            type: "MULTI-SELECTION-SELECTOR",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'TIME-RANGE':
                        result[f.prop] = {
                            type: "TIME-RANGE",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'FREETEXT':
                        result[f.prop] = {
                            type: "FREETEXT",
                            value: "",
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                    case 'NUMBER-RANGE':
                        result[f.prop] = {
                            type: "NUMBER-RANGE",
                            value: [],
                            multiFields: f.advancedSearch["multiFields"] ?? [] 
                        }
                        break
                }
            })
            this.isReady = true
            return result
        }
    },
    data() {
        return {
            searchFilterSet: {},
            isReady: false
        }
    }
}
</script>
<style lang="sass" scoped>
@import "@/static/variables.scss"
::v-deep 
    .el-drawer__container
        width: 90%
        margin-left: 5%
    .el-divider
        margin-top: .8em
        margin-bottom: .8em
    #el-drawer__title
        background-color: $main-theme-plain
        margin-bottom: 1em
        span, i
            color: white
        .el-tag
            background-color: white
            color: black
            border: 1px solid black
            i
                color: black
            
        
h4
    margin: .2em
    width: 10em
.base-row
    display: flex
    align-items: center
.button-container
    width: 100%
    text-align: center
    .confirm-button
        width: 20%
        background-color: $main-theme-plain
        color: white
.title
    color: white
</style>