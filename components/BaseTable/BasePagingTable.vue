<template>
  <div id="base-table" class="container">
    <h1>{{ title }}</h1>
      <el-input @change="handleEnterChange" class="mb-8 search-input" v-model="search" size="medium" :placeholder="$t('Search')"/>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="handleEnterChange">Search</el-button>
    <div class="table-wrapper">
      <el-table :max-height="windowHeight*0.75" @sort-change="sortChange" @selection-change="handleSelectionChange" class="table mb-16" border :data="dataList" style="width: 100%" :cell-style="cellStyle" ref="table" :header-cell-style="{ background: '#333333', color: 'white' }" :row-style="rowStyle" @row-click="rowClick" >
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
    </div>
    <div class="pagination-wrapper">
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total, prev, pager, next, sizes, jumper" :total="dataListForShowLength" :page-sizes="[20, 50, 100, 500]" :page-size="pageSize" :current-page.sync="currentPage" ></el-pagination>
    </div>
  </div>
</template>

<script>
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
    customRefresh: {
      type: Function,
      required: true,
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
    }
  },
  mounted() {
    this.handleDefaultSorting()
    this.handleRefresh();
  },
  data() {
    return {
      search: "",
      confirmedSearch: "",
      currentPage: 1,
      pageSize: 20,
      multipleSelection: [],
      dataList: [],
      windowHeight: window.innerHeight,
      dataListForShowLength: 0,
      currentSortProp: null,
      currentSortOrder: "ascending",
    };
  },
  methods: {
    handleEnterChange() {
      if (this.confirmedSearch != this.search){
        this.confirmedSearch = this.search;
        this.handleRefresh()
      }
    },
    handleDefaultSorting() {
      if (this.defaultSortProp != null && this.defaultSortProp != "") {
        // if (this.defaultSort == "ascending"){
          this.currentSortProp = this.defaultSortProp
          this.currentSortOrder = this.defaultSort
        // }
        // else this.descendignSorting(this.defaultSortProp);
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
      console.log(column);
      this.currentSortProp = column.prop
      this.currentSortOrder = column.order
      this.handleRefresh()
    },
    columnCustomSort(columnObject,order){
        this.dataList.sort(function (a, b) {
            return columnObject.customSort(a, b, order)
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleRefresh()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleRefresh()
    },
    async handleRefresh() {
      try {
        if (this.customRefresh){
          var result = await this.customRefresh();
          this.dataList = result.data
          this.dataListForShowLength = result.totalRow
        }
      } catch (error) {
        console.log(error)
        this.dataList = [];
      }
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
    }
  },
};
</script>
<style scoped lang="sass">
@import "./baseTable.sass"
</style>