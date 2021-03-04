<template>
  <div id="base-table" class="container">
    <h1>{{ title }}</h1>
      <el-input @change="handleEnterChange" class="mb-8 search-input" v-model="search" size="medium" :placeholder="$t('Search')"/>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="handleEnterChange">Search</el-button>
    <div class="table-wrapper">
      <el-table :max-height="windowHeight*0.75" @sort-change="sortChange" @selection-change="handleSelectionChange" class="table mb-16" border :data="dataList" style="width: 100%" :cell-style="cellStyle" ref="table" :header-cell-style="{ background: '#333333', color: 'white' }" :row-style="rowStyle" @row-click="rowClick" >
        <el-table-column v-if="showExpand" type="expand">
          <template slot-scope="scope">
            <slot v-if="expandOptions.type == 'CUSTOM'" name="expand" :row="scope.row" />
            <el-card v-else-if="expandOptions.type == 'GENERAL'" class="expand-table">
              <h5 class="expand-title">{{$t('Detail')}}</h5>
              <el-table :data="scope.row[expandOptions.childrenProp]" class="mt-4" border>
                <el-table-column :label="column.label" v-for="(column, index) in expandOptions.columnList" v-bind:key="index" :min-width="column.width" :fixed="column.fixed" >
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
    tableName: {
      type: String,
      required: false,
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
    showExpand: {
      type: Boolean,
      requried: false,
      default: false,
    },
    joinClass: {
      type: Array,
      requried: false,
      default: function(){
        return []
      },
    },
    expandOptions: {
      type: Object,
      requried: false,
      default: function() {
        return {type: 'CUSTOM'}
      },
    },
    parameters: {
      type: Object,
      requried: false,
      default: function() {
        return {}
      },
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
          this.currentSortProp = this.defaultSortProp
          this.currentSortOrder = this.defaultSort
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
        }else{
          var parameters = Object.assign({
            paging: {page: this.currentPage, pageSize: this.pageSize, search: this.confirmedSearch, sort: {order: this.currentSortOrder, prop:this.currentSortProp }},
            joinClass: this.joinClass,
            type: 1
          }, this.parameters)
          console.log(parameters);
          var result = await Request.postAsync(this, "get_" + this.tableName + "_all_paging", parameters, {showLoading: true});
          this.dataList = result.data[this.tableName.toString()].data
          this.dataListForShowLength = result.data[this.tableName.toString()].totalRow
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