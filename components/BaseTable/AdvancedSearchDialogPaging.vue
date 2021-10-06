<template>
    <el-drawer :title="$t('Search')" :visible.sync="visible" direction="btt"  @close="handleDialogClose" size="95%">
        <!-- <div slot="title">
         <h3>Advanced Search</h3>
        </div> -->
        <!-- <el-button type="primary" @click="handleClearSearch">Clear Advanced Search</el-button> -->
    <el-card>
        <div v-for="(item, index) in columnList" :key="index">
        <div v-if="item.hasOwnProperty('advancedSearch')">
            <div class="row">
                <h4>{{item.label}}</h4>
                <div style="width: 80%">
                    <div v-if="item.advancedSearch.type == 'SELECTION'">
                        <new-c-m-s-selector v-if="item.advancedSearch.remote" :showLabel="false" :remote="item.advancedSearch.remote" @remoteMethod="item.advancedSearch.remoteMethod" v-model="searchFilterSet[item.prop].value" :options="item.advancedSearch.options"></new-c-m-s-selector>
                        <new-c-m-s-selector v-else :remote="item.advancedSearch.remote" :showLabel="false" v-model="searchFilterSet[item.prop].value" :options="item.advancedSearch.options"></new-c-m-s-selector>
                    </div>
                    <div v-if="item.advancedSearch.type == 'MULTI-SELECTION'">
                        <el-checkbox-group v-model="searchFilterSet[item.prop].value">
                            <el-checkbox v-for="(checkBoxValue, checkBoxIndex) in item.advancedSearch.options" :key="checkBoxIndex" :label="checkBoxValue"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div v-if="item.advancedSearch.type == 'MULTI-SELECTION-SELECTOR'">
                        <new-c-m-s-selector v-if="item.advancedSearch.remote" :showLabel="false" multiple :remote="item.advancedSearch.remote" @remoteMethod="item.advancedSearch.remoteMethod" v-model="searchFilterSet[item.prop].value" :options="item.advancedSearch.options"></new-c-m-s-selector>
                        <new-c-m-s-selector v-else :showLabel="false" v-model="searchFilterSet[item.prop].value" multiple :options="item.advancedSearch.options"></new-c-m-s-selector>
                    </div>
                    <div v-else-if="item.advancedSearch.type == 'TIME-RANGE'">
                            <el-date-picker
                                v-model="searchFilterSet[item.prop].value[0]"
                                :type=" (item.advancedSearch.datePickerType != null)?item.advancedSearch.datePickerType: 'date'"
                                placeholder="Start"
                                align="right">
                            </el-date-picker>
                            <span> To </span>
                            <el-date-picker
                                v-model="searchFilterSet[item.prop].value[1]"
                                :type=" (item.advancedSearch.datePickerType != null)?item.advancedSearch.datePickerType: 'date'"
                                placeholder="End"
                                align="right">
                            </el-date-picker>
                    </div>
                    <div v-if="item.advancedSearch.type == 'FREETEXT'">
                        <el-input
                            placeholder="Search"
                            v-model="searchFilterSet[item.prop].value"
                            clearable>
                        </el-input>
                    </div>
                    <div v-else-if="item.advancedSearch.type == 'NUMBER-RANGE'">
                        <div class="row">
                            <el-input-number class="mr-16" size="medium" v-model="searchFilterSet[item.prop].value[0]"></el-input-number>
                            <p>To</p>
                            <el-input-number class="ml-16" size="medium" v-model="searchFilterSet[item.prop].value[1]"></el-input-number>
                        </div>
                    </div>
            </div>
            </div>
            <el-divider/>
          </div>
      </div>
      <el-button class="mt-12"  @click="handleConfirm">Confirm</el-button>
    </el-card>
    </el-drawer>
</template>
<script lang="js">
import Vue from "vue";
import moment from "moment";
import Request from "../../util/request.js"
import Util from "../../util/util.js"
import NewCMSSelector from "../CMSFormComponent/NewCMSSelector/NewCMSSelector"
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
        paging: {
            type: Object,
            required: true
        },
        joinClass: {
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
    components: {
        NewCMSSelector
    },
    created(){
        this.searchFilterSet = this.initSearchFilterSet()
    },
    methods: {
        handleClearSearch(){
            this.searchFilterSet = this.initSearchFilterSet()
        },
        handleDialogClose() {
            this.$el.scrollTop = 0
            this.$emit('update:visible', false)
        },
        handleConfirm(){
            var searchFilterSet = this.filterNullSearchFilterSet(this.searchFilterSet)
            Request.post(this, "get_" + this.tableName + "_all", {
                advancedSearch:  searchFilterSet,
                paging: this.paging,
                joinClass: this.joinClass
            }, res => {
                this.$emit("confirm", res.data[this.tableName].data, res.data[this.tableName].totalRow, searchFilterSet)
                this.$emit('update:visible', false)
            },err => {
                console.log(err);
            }, {showLoading: true})
        },
        filterNullSearchFilterSet(searchFilterSet){
            var result = {}
            Object.entries(searchFilterSet).forEach(([key, object]) =>{
                if(object.value != "" && object.value != null)
                    result[key] = object
            })
            Object.entries(result).forEach(([key, object]) =>{
                if(Array.isArray(result[key].value) && result[key].value.every(f => f == null))
                    delete result[key]
            })
            return result
        },
        initSearchFilterSet(){
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
            return result
        }
    },
    data() {
        return {
            searchFilterSet: {},
        }
    }
}
</script>
<style lang="sass" scoped>
@import "@/static/variables.scss"
::v-deep 
    #el-drawer__title
        background-color: #0e71eb
        margin-bottom: 1em
        span, i
            color: white
        
h4
    margin: .2em
    width: 10em
.row
    display: flex
    align-items: center
</style>