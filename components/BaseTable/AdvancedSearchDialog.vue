<template>
  <el-dialog :visible="dialogVisible" width="80%" @close="handleDialogClose">
      <h3>Advanced Search</h3>
      <div v-for="(item, index) in columnList" :key="index">
          <h4>{{item.label}}</h4>
            <div v-if="item.hasOwnProperty('advancedSearch')">
                <div v-if="item.advancedSearch.type == 'MULTI-SELECTION'">
                    <el-checkbox-group v-model="searchFilterSet[index]">
                        <el-checkbox v-for="(checkBoxValue, checkBoxIndex) in item.advancedSearch.options" :key="checkBoxIndex" :label="checkBoxValue"></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div v-else-if="item.advancedSearch.type == 'TIME-RANGE'">
                        <el-date-picker
                            v-model="searchFilterSet[index]"
                            type="datetimerange"
                            range-separator="To"
                            start-placeholder="Start"
                            end-placeholder="End">
                        </el-date-picker>
                </div>
                <div v-else-if="item.advancedSearch.type == 'FREETEXT'">
                    <el-input
                        placeholder="Search"
                        v-model="searchFilterSet[index]"
                        clearable>
                    </el-input>
                </div>
                <div v-else-if="item.advancedSearch.type == 'NUMBER-RANGE'">
                    <div class="row">
                        <el-input-number class="mr-16" size="medium" v-model="searchFilterSet[index][0]"></el-input-number>
                        <p>To</p>
                        <el-input-number class="ml-16" size="medium" v-model="searchFilterSet[index][1]"></el-input-number>
                    </div>
                </div>
            </div>
            <el-divider/>
      </div>
      <el-button @click="handleConfirm">Confirm</el-button>
  </el-dialog>
</template>
<script lang="js">
import Vue from "vue"
import moment from "moment";
import {Util} from "vue_basecomponent";
export default{
    props: {
        dialogVisible: {
            type: Boolean,
            required: true,
            default: false
        },
        columnList: {
            type: Array,
            required: true,
            default: []
        },
        dataList: {
            type: Array,
            required: true,
            default: []
        }
    },
    methods: {
        handleDialogClose() {
            this.$emit('update:dialogVisible', false)
        },
        handleConfirm(){
            var result = this.dataList
            this.columnList.forEach((column, index) => {
                switch(column.advancedSearch.type){
                    case 'MULTI-SELECTION':
                        if(this.searchFilterSet[index].length > 0)
                            result = result.filter(f => {
                                if(Array.isArray(f[column.prop]))
                                    return f[column.prop].find(prop => this.searchFilterSet[index].includes(prop)) != null
                                else
                                    return this.searchFilterSet[index].includes(f[column.prop])
                            })
                        break;
                    case 'TIME-RANGE':
                        if(this.searchFilterSet[index].length == 2)
                            result = result.filter(f => moment(f[column.prop]).valueOf() > this.searchFilterSet[index][0].valueOf() && moment(f[column.prop]).valueOf() < this.searchFilterSet[index][1].valueOf())
                    case 'FREETEXT':
                        if(this.searchFilterSet[index].length > 0)
                            result = result.filter(f => {
                                if(f[column.prop] == null || f[column.prop] == "")
                                    return false
                                else
                                    return f[column.prop].includes(this.searchFilterSet[index]) || this.searchFilterSet[index].includes(f[column.prop])
                            })
                    case 'NUMBER-RANGE':
                        if(this.searchFilterSet[index].length == 2)
                            result = result.filter(f => {
                                if(!Util.isNumeric(f[column.prop]))
                                    return false
                                else
                                    return f[column.prop] >= this.searchFilterSet[index][0] &&  f[column.prop] <= this.searchFilterSet[index][1]
                            })
                }
            })
            this.$emit('search-callback', result)
            this.$emit('update:dialogVisible', false)
        },
        init(){
            return this.columnList.map(f => {
                switch(f.advancedSearch.type){
                    case 'MULTI-SELECTION':
                        return [];
                        break;
                    case 'TIME-RANGE':
                        return [];
                        break;
                    case 'FREETEXT':
                        return "";
                        break;
                    case 'NUMBER-RANGE':
                        return [];
                        break;
                }
            })
        }
    },
    data() {
        return {
            searchFilterSet: this.init(),
        }
    }
}
</script>
<style lang="sass" scoped>
</style>