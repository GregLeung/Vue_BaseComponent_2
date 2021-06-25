<template>
  <div>
    <el-input v-if="showSearch" slot="first" v-model="searchValue" placeholder="Search" />
    <el-table :border='border' @selection-change="handleMultiSelection" :header-cell-style="headerCellStyle" class="mt-12" :data="filteredList()" @sort-change="handleSortChange">
      <slot></slot>
    </el-table>
    <div class="pagination-wrapper mt-12">
      <el-pagination
        v-if="showPagination"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next"
        :total="pagingLength"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script lang="js">
import Vue from "vue";
import { stringSimilarity } from "string-similarity-js";
export default {
    props: {
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
            default: { background: '#FFFFFF' }
        }
        
    },
    watch: {
        showPagination:{
            handler(val, oldValue){
                if(this.showPagination)
                    this.pageSize = 25
                else
                    this.pageSize = 9999999
            }
        }
    },
    computed: {
        pagingLength(){
            return this.dataList.length
        },
    },
    created(){
        this.localDataList = this.deepClone(this.dataList)
    },
    watch:{
        dataList: {
            handler(val, oldValue){
                this.localDataList = this.deepClone(val)
            }
        }
    },
    methods: {
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
                    a = this.getDeepObjectProp(a, this.currentSortObject.prop)
                    b = this.getDeepObjectProp(b, this.currentSortObject.prop)
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
                    // return (this.getDeepObjectProp(a, this.currentSortObject.prop) < this.getDeepObjectProp(b, this.currentSortObject.prop))?1:-1
                })
            }
            return tmp.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize )
        }
    },
    data(){
        return {
            searchValue: "",
            pageSize: 25,
            currentPage: 1,
            multipleSelection: [],
            currentSortObject: null
        }
    }
}
</script>
<style lang="sass" scoped>
.pagination-wrapper
    display: flex
    justify-content: flex-end
</style>