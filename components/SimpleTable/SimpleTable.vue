<template>
  <div>
    <el-input v-if="showSearch" slot="first" v-model="search" placeholder="Search" />
    <el-table @selection-change="handleMultiSelection" class="mt-12" :data="filteredList">
      <slot></slot>
    </el-table>
    <div class="pagination-wrapper mt-12">
      <el-pagination
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
export default{
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
        }
    },
    computed: {
        pagingLength(){
            return this.dataList.length
        },
        filteredList(){
            if(this.search != "")
                return this.dataList.filter(f => {
                    for(let i = 0; i < Object.entries(f).length; i++){
                        var item = Object.entries(f)[i]
                        if(item[1] != null){
                            try{
                                if(stringSimilarity(item[1].toString(), this.search) > 0.2)
                                    return true
                                return  item[1].toString().includes(this.search)
                            }catch(error){
                                console.log(error);
                            }
                        }
                    }
                    return false
                }).slice(this.currentPage * this.pageSize - this.pageSize,this.currentPage * this.pageSize)
            else
                return this.dataList.slice(this.currentPage * this.pageSize - this.pageSize,this.currentPage * this.pageSize)
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
        }
    },
    data(){
        return {
            search: "",
            pageSize: 25,
            currentPage: 1,
            multipleSelection: []
        }
    }
}
</script>
<style lang="sass" scoped>
.pagination-wrapper
    display: flex
    justify-content: flex-end
</style>