<template>
  <div>
    <el-input v-if="showSearch" slot="first" v-model="searchValue" placeholder="Search" />
    <el-table highlight-current-row :show-summary="showSummary" :summary-method="summaryMethod" v-loading="isLoading" :tree-props="treeProps" :row-key="rowKey" :default-expand-all="defaultExpandAll" :max-height="maxHeight"  :border='border' @selection-change="handleMultiSelection" :header-cell-style="headerCellStyle" class="mt-12" :data="filteredList().slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize )" @sort-change="handleSortChange" @row-click="rowClick" @row-dblclick="rowDoubleClick" :default-sort="defaultSort">
      <slot></slot>
    </el-table>
    <div class="pagination-wrapper mt-12">
      <el-pagination v-if="showPagination" small :page-sizes="pageSizes" :page-size="pageSize" :current-page.sync="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next" :total="totalLength"/>
    </div>
  </div>
</template>
<script lang="js">
import Vue from "vue";
import { stringSimilarity } from "string-similarity-js";
export default {
    props: {
        isLoading: {
            type: Boolean,
            required: false,
            default: false
        },
        dataList: {
            type: Array,
            required: false,
            default: function(){
                return []
            }
        },
        pageSizes: {
            type: Array,
            required: false,
            default: function(){
                return [25, 50, 100, 500]
            }
        },
        showSearch: {
            type: Boolean,
            required: false,
            default: true
        },
        showPagination:{
            type: Boolean,
            required: false,
            default: true
        },
        border: {
            type: Boolean,
            required: false,
            default: false
        },
        headerCellStyle: {
            type: Object,
            required: false,
            default: () =>{
                return { background: '#FFFFFF' }
            }
        },
        rowClick: {
            type: Function,
            required: false,
            default: (row, column, event) => {},
        },
        maxHeight: {
            type: String | Number,
            required: false,
            default: process.client ? window.innerHeight * 0.75 : "1080px"
        },
        rowKey: {
            type: String,
        },
        defaultExpandAll: {
            type: Boolean,
            required: false
        },
        treeProps: {
            type: Object
        },
        showSummary: {
            type: Boolean,
            required: false,
            default: false
        },
        summaryMethod: {
            type: Function,
            required: false,
            default: () => {
                return {}
            }
        },
        rowDoubleClick: {
            type: Function,
            required: false,
            default: (row, column, event) => {},
        },
        "default-sort": {
            type: Object,
            required: false,
        }
    },
    created(){
        this.init()
    },
    watch:{
        dataList: {
            handler(val, oldValue){
                this.localDataList = this.deepClone(val)
            }
        },
        showPagination:{
            handler(val, oldValue){
                if(this.showPagination)
                    this.pageSize = this.pageSizes[0]
                else
                    this.pageSize = 9999999
            }
        },
        searchValue: {
            handler(val, oldValue){
                this.currentPage = 1
            }
        }
    },
    methods: {
        init(){
            this.localDataList = this.deepClone(this.dataList)
        },
        handleMultiSelection(val){
            this.multipleSelection = val
            this.$emit('selection-change', val)
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        handleSortChange(sortObject){
            this.currentSortObject = sortObject
        },
        recursiveSearch(value){
            try{
                if(this.isJSONObject(value)){
                    for(let i = 0; i < Object.entries(value).length; i++){
                        var item = Object.entries(value)[i]
                        if(item[1] != null)
                            if(this.recursiveSearch(item[1])) return true
                    }
                }else if(value != null){
                    // if(stringSimilarity(value.toString(), this.searchValue) > 0.1)
                    //     return true
                    return value.toString().toLowerCase().includes(this.searchValue.toLowerCase())
                }else
                    return false
            }catch(error){
                return false
            }
        },
        filteredList(){
            var tmp = this.deepClone(this.localDataList)
            if(this.searchValue != "" && this.searchValue != null)
                tmp = tmp.filter(f => {return this.recursiveSearch(f)})
            if(this.currentSortObject != null && this.currentSortObject.column.sortMethod == null){
                tmp.sort((a,b)=>{
                    try{
                        a = this.getDeepObjectProp(a, this.currentSortObject.prop)
                    }catch(e){
                        a = "";
                    }
                    try{
                        b = this.getDeepObjectProp(b, this.currentSortObject.prop)
                    }catch(e){
                        b = "";
                    }
                    if (a === b) 
                        return 0;
                    else if (a === null || a === "") 
                        return 1;
                    
                    else if (b === null || b === "") 
                        return -1;
                    
                    else if (this.currentSortObject.order == "ascending") 
                        return a < b ? -1 : 1;
                    
                    else if (this.currentSortObject.order == "descending") 
                        return a < b ? 1 : -1;
                    
                    return 0
                })
            }
            this.totalLength = tmp.length
            return tmp
            // return tmp.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize )
        }
    },
    data(){
        return {
            searchValue: "",
            pageSize: this.pageSizes[0],
            currentPage: 1,
            multipleSelection: [],
            currentSortObject: null,
            windowHeight: window.innerHeight,
            totalLength: 0
        }
    }
}
</script>
<style lang="sass" scoped>
.pagination-wrapper
    display: flex
    justify-content: flex-end
.el-table
    font-size: .7rem
    ::v-deep  td, th
        padding: 0
    .el-table__row
        word-break: break-word
::v-deep
    .el-table
        th
            padding: 0px
        .el-table__row
            cursor: pointer
</style>