<template>
  <div id="base-table" class="container">
    <h1>{{ title }}</h1>
    <div v-if="isAdvancedSearch" class="space-between-row">
      <div style="width: 100%">
        <el-input @input="handleSearchChange" @change="handleEnterChange"  class="mb-8 search-input" v-model="search" size="medium" :placeholder="$t('Keyword Search')" />
        <el-button v-if="!autoSearch" type="primary" size="medium" icon="el-icon-search" @click="handleEnterChange">Search</el-button>
      </div>
      <div class="row">
        <el-tooltip class="item" effect="dark" content="Clear Search" placement="top">
          <el-button icon="el-icon-refresh" type="success" @click="handleRefresh()" circle></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="Advance Search" placement="top">
          <el-button icon="el-icon-search" type="warning" @click="handleOpenAdvancedSearchDialog" circle></el-button>
        </el-tooltip>
      </div>
    </div>
    <div v-else>
      <el-input @input="handleSearchChange" @change="handleEnterChange" class="mb-8 search-input" v-model="search" size="medium" :placeholder="$t('Search')"/>
      <el-button v-if="!autoSearch" type="primary" size="medium" icon="el-icon-search" @click="handleEnterChange">Search</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :max-height="windowHeight*0.75" @sort-change="sortChange" @selection-change="handleSelectionChange" class="table mb-16" border :data="dataListForShow" style="width: 100%" :cell-style="cellStyle" ref="table" :header-cell-style="{ background: '#333333', color: 'white' }" :row-style="rowStyle" @row-click="rowClick" >
        <el-table-column v-if="isBatchSelection" type="selection"  width="55" ></el-table-column>
        <el-table-column v-if="showExpand" type="expand">
          <template slot-scope="scope">
            <slot v-if="expandOptions.type == 'CUSTOM'" name="expand" :row="scope.row" />
            <el-card v-else-if="expandOptions.type == 'GENERAL'">
              <h3>{{$t('Detail')}}</h3>
              <el-table :data="scope.row[expandOptions.childrenProp]" class="mt-4" border>
                <el-table-column :label="column.label" v-for="(column, index) in expandOptions.columnList" v-bind:key="index" sortable="custom" :min-width="column.width" :prop="scope.row[column.prop]" :fixed="column.fixed" >
                  <template slot-scope="scope">
                      <span v-if="column.hasOwnProperty('parseValue') && parseData(scope.row, column, column.prop) != null" >
                        <el-tag :type="parseData(scope.row, column, column.prop).type">{{ parseData(scope.row, column, column.prop).label }}</el-tag>
                      </span>
                      <span v-else-if="column.hasOwnProperty('format')">{{ column.format(scope.row[column.prop]) }}</span>
                      <span v-else>{{ scope.row[column.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column  v-for="(column, index) in visibleColumn" v-bind:key="index" :label="column.label" sortable="custom" :min-width="column.width" :prop="column.prop" :fixed="column.fixed" >
          <template slot-scope="scope">
            <slot :name="column.prop" :row="scope.row">
              <span v-if="column.hasOwnProperty('parseValue') && parseData(scope.row, column, column.prop) != null" >
                <el-tag :type="parseData(scope.row, column, column.prop).type">{{ parseData(scope.row, column, column.prop).label }}</el-tag>
              </span>
              <span v-else-if="column.hasOwnProperty('format')">{{ column.format(scope.row[column.prop]) }}</span>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </slot>
          </template>
        </el-table-column>
        <el-table-column v-if="showManipulation" :label="$t('Manipulation')" fixed="right" :min-width="manipulationColumn.width" >
          <template slot-scope="scope">
            <slot name="manipulation" :row="scope.row" />
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-if="currentSelection != null" :title="$t('Edit')" :visible.sync="dialogVisible" width="70%" >
        <div v-for="(item, index) in columnList" :key="index">
          <el-row v-if="!item['disabled']" class="mb-16" type="flex" align="middle" justify="center" >
            <el-col :span="4">
              <span class="title-font">{{ item.label }}</span>
            </el-col>
            <el-col :span="20">
              <p v-if="item.label == 'ID'">{{ currentSelection[item.prop] }}</p>
              <el-select v-else-if="item.hasOwnProperty('parseValue')" v-model="currentSelection[item.prop]" placeholder="Please Select" >
                <el-option v-for="item in item.parseValue" :key="item.value" :label="item.label" :value="item.value" ></el-option>
              </el-select>
              <el-input-number v-else-if="item.type == Number" v-model="currentSelection[item.prop]" :placeholder="item.prop" ></el-input-number>
              <el-date-picker v-else-if="item.type == 'DateTime'" v-model="currentSelection[item.prop]" type="datetime" value-format="yyyy-MM-dd hh:mm:ss" :placeholder="item.prop" ></el-date-picker>
              <el-date-picker v-else-if="item.type == 'Date'" v-model="currentSelection[item.prop]" type="date" value-format="yyyy-MM-dd" :placeholder="item.prop" ></el-date-picker>
              <el-input  v-else v-model="currentSelection[item.prop]" :placeholder="item.prop" ></el-input>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t("Cancel") }}</el-button>
          <el-button type="primary" @click="handleUpdate">{{ $t("Confirm") }}</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="pagination-wrapper">
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total, prev, pager, next, sizes, jumper" :total="dataListForShowLength" :page-sizes="[20, 50, 100, 500]" :page-size="pageSize" :current-page.sync="currentPage" ></el-pagination>
    </div>
    <advanced-search-dialog @search-callback="(data)=>{dataList = data}" :dataList="dataList" :columnList="columnList.filter(f => f.hasOwnProperty('advancedSearch'))" :dialogVisible.sync="visibleAdvancedSearchDialog" :width="advanceSearchDialogWidth" :top="advanceSearchDialogTop" />
  </div>
</template>

<script>
import axios from "axios";
import AdvancedSearchDialog from "./AdvancedSearchDialog";
import { Request, Util } from "vue_basecomponent";

export default {
  components: {
    AdvancedSearchDialog
  },
  props: {
    isAdvancedSearch: {
      type: Boolean,
      default: false,
    },
    showManipulation: {
      type: Boolean,
      required: false,
      default: false,
    },
    columnList: {
      type: Array,
      required: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    manipulationColumn: {
      type: Object,
      required: false,
      default: () => {
        return {
          width: 150,
        };
      },
    },
    defaultSortProp: {
      type: String,
      required: false,
    },
    defaultSort: {
      type: String,
      required: false,
      default: "ascending",
    },
    title: {
      type: String,
      required: false,
    },
    isBatchSelection: {
      type: Boolean,
      required: false,
      default: false,
    },
    customRefresh: {
      type: Function,
      required: false,
      default: null,
    },
    rowClick: {
      type: Function,
      required: false,
      default: (row, column, event) => {},
    },
    rowStyle: {
      type: Function,
      required: false,
      default: ({ row, Object }) => {},
    },
    isCircleButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    autoSearch: {
      type: Boolean,
      required: false,
      default: true,
    },
    showExpand: {
      type: Boolean,
      requried: false,
      default: false,
    },
    expandOptions: {
      type: Object,
      requried: false,
      default: function() {
        return {type: 'CUSTOM'}
      },
    },
    advanceSearchDialogWidth: {
      type: String,
      required: false,
      default: '50%'
    },
    advanceSearchDialogTop: {
      type: String,
      required: false,
      default: '0vh'
    }
  },
  mounted() {
    this.handleRefresh();
  },
  data() {
    return {
      search: "",
      confirmedSearch: "",
      currentPage: 1,
      pageSize: 20,
      dialogVisible: false,
      currentSelection: null,
      multipleSelection: [],
      dataList: [],
      windowHeight: window.innerHeight,
      visibleAdvancedSearchDialog: false,
    };
  },
  methods: {
    handleOpenAdvancedSearchDialog(){
      this.handleRefresh()
      this.visibleAdvancedSearchDialog = true
    },
    handleSearchChange() {
      if (this.autoSearch) this.confirmedSearch = this.search;
    },
    handleEnterChange() {
      if (this.confirmedSearch != this.search)
        this.confirmedSearch = this.search;
    },
    handleDefaultSorting() {
      if (this.defaultSortProp != null && this.defaultSortProp != "") {
        if (this.defaultSort == "ascending")
          this.ascendingSorting(this.defaultSortProp);
        else this.descendignSorting(this.defaultSortProp);
      }
    },
    ascendingSorting(prop) {
      try{
        var sortType = this.columnList.find(f => f.prop == prop).sortType || "String"
      }catch(e){
        console.log(e);
        var sortType = "String"
      }
      switch(sortType){
        case "Number":
          this.dataList.sort(function (a, b) {
            return a[prop] - b[prop];
          });
        break;
        case "String":
          this.dataList.sort(function (a, b) {
            return ("" + a[prop]).localeCompare(b[prop]);
          });
      }
    },
    descendignSorting(prop) {
      try{
        var sortType = this.columnList.find(f => f.prop == prop).sortType || "String"
      }catch(e){
        console.log(e);
        var sortType = "String"
      }
      switch(sortType){
        case "Number":
          this.dataList.sort(function (a, b) {
            return b[prop] - a[prop];
          });
        break;
        case "String":
          this.dataList.sort(function (a, b) {
            return ("" + b[prop]).localeCompare(a[prop]);
          });
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === this.$refs.table.columns.length - 1) {
        return "background:#EEEEEE";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sortChange: function (column) {
      var columnObject = this.columnList.find((f) => f.prop == column.prop);
      if (typeof columnObject.customSort === "function") {
          this.columnCustomSort(columnObject, column.order)
      } else {
        if (column.order == "descending") {
          this.descendignSorting(column.prop);
        } else {
          this.ascendingSorting(column.prop);
        }
      }
    },
    columnCustomSort(columnObject,order){
        this.dataList.sort(function (a, b) {
            return columnObject.customSort(a, b, order)
        });
    },
    handleEdit(row) {
      this.currentSelection = Object.assign({}, row);
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleDelete(row) {
      Request.get(
        this,
        "delete_" + this.tableName,
        {
          ID: row.ID,
        },
        (res) => {
          if (res.code == -1) throw res.data.data;
          this.$notify({
            title: "Success",
            message: "",
            type: "success",
          });
          this.handleRefresh();
        }
      );
    },
    async handleRefresh() {
      try {
        if (this.customRefresh)
          this.dataList = await this.customRefresh();
        else{
            var result = await Request.getAsync(this, "get_" + this.tableName + "_all", {});
            console.log(result.data);
            this.dataList = result.data[this.tableName.toString()]
        }
        this.handleDefaultSorting(); 
      } catch (error) {
        console.log(error)
        this.dataList = [];
      }
    },
    handleUpdate() {
      var updateData = { ID: this.currentSelection["ID"] };
      this.columnList.forEach((f) => {
        updateData[f.prop] = this.currentSelection[f.prop];
      });
      Request.post(this, "update_" + this.tableName, updateData, (res) => {
        if (res.code == -1) throw res.data.data;
        this.$notify({
          title: "Success",
          message: "",
          type: "success",
        });
        this.dialogVisible = false;
        this.handleRefresh();
      });
    },
    parseData(row, property, currentProp) {
      if (property.hasOwnProperty("parseValue")) {
        var label = property.parseValue.find((item) => {
          return item.value == row[currentProp];
        });
        return label;
      }
      return row[currentProp];
    },
  },
  computed: {
    visibleColumn: function(){
      return this.columnList.filter(f => !f.isHidden || false)
    },
    filteredData: function(){
      if (this.confirmedSearch == "") return this.dataList;
      else
        return this.dataList
          .filter((val) => {
            for (let i = 0; i < Object.keys(val).length; i++) {
              if (
                val[Object.keys(val)[i]] != null &&
                val[Object.keys(val)[i]]
                  .toString()
                  .toLowerCase()
                  .includes(this.confirmedSearch.toLowerCase())
              )
                return true;
            }
            return false;
          })
    },
    dataListForShow: function () {
      if (this.confirmedSearch == "")
        return this.dataList.slice(
          this.currentPage * this.pageSize - this.pageSize,
          this.currentPage * this.pageSize
        );
      else {
        return this.dataList
          .filter((val) => {
            for (let i = 0; i < Object.keys(val).length; i++) {
              if (
                val[Object.keys(val)[i]] != null &&
                val[Object.keys(val)[i]]
                  .toString()
                  .toLowerCase()
                  .includes(this.confirmedSearch.toLowerCase())
              )
                return true;
            }
            return false;
          })
          .slice(
            this.currentPage * this.pageSize - this.pageSize,
            this.currentPage * this.pageSize
          );
      }
    },
    dataListForShowLength: function () {
      if (this.confirmedSearch == "") return this.dataList.length;
      else
        return this.dataList.filter((val) => {
          for (let i = 0; i < Object.keys(val).length; i++) {
            if (
              val[Object.keys(val)[i]] != null &&
              val[Object.keys(val)[i]]
                .toString()
                .toLowerCase()
                .includes(this.confirmedSearch.toLowerCase())
            )
              return true;
          }
          return false;
        }).length;
    },
  },
};
</script>
<style scoped lang="sass">
#base-table
    .el-table
        font-size: .7rem
        ::v-deep  td, th
          padding: 0
    .el-table__row
        cursor: pointer
    h1
        font-size: 1.5rem
        margin-top: .2em
        margin-bottom: .2em
    .title-font
        font-size: 1rem
    // .table-wrapper
    //     height: 70vh
    //     overflow: scroll
    .search-input
        width: 30%
    .pagination-wrapper
        display: flex
        justify-content: flex-end
    .row
        display: flex
        align-items: center
</style>