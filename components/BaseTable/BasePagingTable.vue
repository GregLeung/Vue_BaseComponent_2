<template>
  <div id="base-table">
        <div v-if="tableStyle == 'OLD'" class="old-style">
          <h1>{{ title }}</h1>
          <div class="space-between-row">
            <div class="search-bar">
              <el-input  @change="handleEnterChange" class="mb-8 search-input" v-model="search" size="medium" :placeholder="$t('Keyword Search')"/>
              <el-button type="primary" size="medium" icon="el-icon-search" @click="handleEnterChange">Search</el-button>
              <slot name="searchSlot"/>
            </div>
            <div class="base-row" v-if="isAdvancedSearch">
              <el-button @click="handleOpenAdvancedSearchDialog" type="text">Advanced Search</el-button>
            </div>
          </div>
        </div>
        <div v-else class="standard-style">
          <div class="space-between-row title-row mt-4">
            <div>
              <div class="base-row">
                <i v-if="icon != null" :class="[icon, 'icon']" :style="{'color': mainThemePlain}"></i>
                <h1>{{ title }}</h1>
              </div>
              <slot name="title"/>
            </div>
            <div class="search-bar">
              <el-tooltip v-if="isAdvancedSearch" class="item" effect="dark" content="Advanced Search" placement="top-start">
                <el-button class="mr-4 advanced-search-button" icon="el-icon-zoom-in" circle @click="handleOpenAdvancedSearchDialog"></el-button>
              </el-tooltip>
              <el-input :style="{width: '30em'}" @change="handleEnterChange" class="search-input" v-model="search" size="medium" :placeholder="$t('Keyword Search')">
                <el-button slot="append" size="medium" icon="el-icon-search" @click="handleEnterChange"></el-button>
              </el-input>
              <slot name="searchSlot"/>
            </div>
          </div>
        </div>
    <div class="table-wrapper mt-4">
      <el-table highlight-current-row :max-height="windowHeight*0.75" @sort-change="sortChange" @selection-change="handleSelectionChange" @select="handleSelect" class="table mb-16" :border="border" :data="dataList" style="width: 100%" :cell-style="cellStyle" ref="table" :header-cell-style="{ background: '#333333', color: 'white' }" :row-style="rowStyle" @row-click="rowClick" @row-dblclick="rowDoubleClick" @select-all="handleSelectAll">
        <el-table-column v-if="isBatchSelection" type="selection"  width="55" ></el-table-column>
        <el-table-column v-if="showExpand" type="expand">
          <template slot-scope="scope">
            <slot v-if="expandOptions.type == 'CUSTOM'" name="expand" :row="scope.row" />
            <el-card v-else-if="expandOptions.type == 'GENERAL'" class="expand-table">
              <h5 class="expand-title">{{expandTitle}}</h5>
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
        <el-table-column  v-for="(column, index) in visibleColumn" v-bind:key="index" :label="column.label" :sortable="(column.sortable != null) ?column.sortable :'custom'" :min-width="column.width" :prop="column.prop" :fixed="column.fixed" >
          <template slot-scope="scope">
            <slot :name="column.prop" :row="scope.row">
              <span v-if="column.hasOwnProperty('parseValue') && parseData(scope.row, column, column.prop) != null" >
                <el-tag :type="parseData(scope.row, column, column.prop).type">{{ parseData(scope.row, column, column.prop).label }}</el-tag>
              </span>
              <span class="word-break" v-else-if="column.hasOwnProperty('format')">{{ column.format(scope.row[column.prop]) }}</span>
              <span class="word-break" v-else>{{ scope.row[column.prop] }}</span>
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
      <el-pagination small class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, prev, pager, next, sizes, jumper" :total="dataListForShowLength" :page-sizes="[20, 50, 100, 500]" :page-size="pageSize" :current-page.sync="currentPage" ></el-pagination>
    </div>
    <advanced-search-dialog-paging :paging="{
      page: 1, pageSize: this.pageSize, sort: {order: this.currentSortOrder, prop:this.currentSortProp }
    }" ref="advancedSearchDialog" :tableName="tableName" :joinClass="joinClass" @confirm="handleAdvancedSearchConfirm" :columnList="columnList" :computed="computed" :whereOperation="whereOperation" :visible.sync="visibleAdvancedSearchDialog">
      <template v-for="(column, index) in columnList" :slot="'advancedSearchCustom.' + column.key" slot-scope="scope">
        <slot :name="'advancedSearchCustom.' + column.key" :searchFilterSet="scope.searchFilterSet" :whereOperation="scope.whereOperation" :computed="scope.computed"></slot>
      </template> 
    </advanced-search-dialog-paging>
  </div>
</template>

<script>
import AdvancedSearchDialogPaging from "./AdvancedSearchDialogPaging";
import { Request, Util } from "vue_basecomponent";

export default {
  components: {
    AdvancedSearchDialogPaging
  },
  props: {
    tableStyle: {
      type: String,
      required: false,
      default: "STANDARD"
    },
    border: {
      type: Boolean,
      default: true,
    },
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
    rowDoubleClick: {
      type: Function,
      required: false,
      default: (row, column, event) => {},
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
    expandTitle: {
      type: String,
      required: false,
      default: 'Detail'
    },
    joinClass: {
      type: Array,
      requried: false,
      default: function(){
        return []
      },
    },
    whereCondition: { //DEPRECATED
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
    },
    isBatchSelection: {
      type: Boolean,
      required: false,
      default: false,
    },
    isCustomRequest: {
      type: Boolean,
      required: false,
      default: false,
    },
    isServerSidePaging: {
      type: Boolean,
      required: false,
      default: true,
    },
    beforeClear: {
      type: Function,
      required: false,
    },
    computed: {
      type: Array,
      required: false,
      default: function(){
        return []
      }
    },
    icon: {
      type: String,
      required: false,
      default: null
    },
    whereOperationType: {
      type: String,
      required: false,
      default: "OR"
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
      originalDataList: [],
      windowHeight: window.innerHeight,
      dataListForShowLength: 0,
      currentSortProp: null,
      visibleAdvancedSearchDialog: false,
      currentSortOrder: "ascending",
      searchFilterSet: {},
    };
  },
  methods: {
    getExportParameters(){
      var parameters = {}
      if(this.joinClass.length > 0)
        parameters["joinClass"] = this.joinClass
      if(Object.keys(this.searchFilterSet).length !== 0)
        parameters["advancedSearch"] = this.searchFilterSet
      if(this.confirmedSearch != null && this.confirmedSearch != "")
        parameters["search"] = this.confirmedSearch
      if(this.whereOperation.length > 0)
        parameters["whereOperation"] = this.whereOperation
      if(this.whereCondition.length > 0)
        parameters["whereCondition"] = this.whereCondition
      if(this.computed.length > 0)
        parameters["computed"] = this.computed
      parameters["multipleSelection"] = this.multipleSelection.map(f => f.ID)
      parameters["whereOperationType"] = this.whereOperationType
      return parameters
      },
    handleEnterChange() {
      // if (this.confirmedSearch != this.search){
        this.confirmedSearch = this.search;
        this.currentPage = 1
        this.$refs.advancedSearchDialog.searchFilterSet = this.$refs.advancedSearchDialog.initSearchFilterSet()
        this.searchFilterSet = {}
        this.handleRefresh()
      // }
    },
    handleDefaultSorting() {
      if (this.defaultSortProp != null && this.defaultSortProp != "") {
        if(this.isServerSidePaging){
          this.currentSortProp = this.defaultSortProp
          this.currentSortOrder = this.defaultSort
        }else{
          if (this.defaultSort == "descending") 
            this.dataList = this.paging(this.originalDataList.sort((a, b)=> {return (""+ this.getPropByString(b, this.defaultSortProp)).localeCompare("" + this.getPropByString(a, this.defaultSortProp))}))
          else
            this.dataList = this.paging(this.originalDataList.sort( (a, b)=> {return (""+this.getPropByString(a, this.defaultSortProp)).localeCompare("" + this.getPropByString(b, this.defaultSortProp))}))
        }
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === this.$refs.table.columns.length - 1 && this.showManipulation) {
        return "background:#EEEEEE";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("selectionChange", this.multipleSelection)
    },
    sortChange: function (column) {
      if(this.isServerSidePaging){
        this.currentSortProp = column.prop
        this.currentSortOrder = column.order
        this.handleRefresh()
      }else{
        if (column.order == "descending") 
          this.dataList = this.paging(this.originalDataList.sort((a, b)=> {return (""+ this.getPropByString(b, column.prop)).localeCompare("" + this.getPropByString(a, column.prop))}))
        else
          this.dataList = this.paging(this.originalDataList.sort( (a, b)=> {return (""+this.getPropByString(a, column.prop)).localeCompare("" + this.getPropByString(b, column.prop))}))
      }
    },
    getPropByString(instance, prop){
      prop.split(".").forEach(f => {
        instance = instance[f]
        if(instance == null) return instance;
      })
      return instance;
    },
    handleSizeChange(val) {
      if(this.isServerSidePaging){
        this.pageSize = val;
        this.handleRefresh()
      }else
        this.dataList = this.paging(this.originalDataList);
    },
    handleCurrentChange(val) {
      if(this.isServerSidePaging){
        this.currentPage = val;
        this.handleRefresh()
      }else
        this.dataList = this.paging(this.originalDataList);
    },
    async handleRefresh(isDefaultSorting = true) {
      Util.loading();
      try {
        var parameters = Object.assign({
          paging: {page: this.currentPage, pageSize: this.pageSize, search: this.confirmedSearch, sort: {order: this.currentSortOrder, prop:this.currentSortProp }},
          joinClass: this.joinClass,
          computed: this.computed,
          advancedSearch: this.searchFilterSet,
        }, this.parameters)
        if(this.whereCondition.length > 0)
          parameters["whereCondition"] = this.whereCondition
        if(this.whereOperation.length > 0)
          parameters["whereOperation"] = this.whereOperation
        parameters["whereOperationType"] = this.whereOperationType
        if(this.isCustomRequest){
          this.$emit("customRequest",parameters,(result, totalRow) => {
            this.dataListForShowLength = totalRow
            if(!this.isServerSidePaging){
               this.originalDataList = result
               this.dataList = this.paging(this.originalDataList)
               if(isDefaultSorting)
                this.handleDefaultSorting()
            }else{
              this.dataList = result
            }
          })
        }else{
          var result = await Request.postAsync(this, "get_" + this.tableName + "_all", parameters, {showLoading: false});
          this.dataList = result.data[this.tableName.toString()].data
          this.dataListForShowLength = result.data[this.tableName.toString()].totalRow
        }
        this.$emit("refreshCallback")
      } catch (error) {
        console.log(error)
        this.dataList = [];
      }finally{
        Util.loading().close();
      }
    },
    paging(dataList){
      return dataList.slice(this.currentPage * this.pageSize - this.pageSize,this.currentPage * this.pageSize)
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
    handleOpenAdvancedSearchDialog(){
      this.visibleAdvancedSearchDialog = true
    },
    handleAdvancedSearchConfirm(dataList, totalRow, searchFilterSet){
      this.currentPage = 1
      this.dataList = dataList
      this.dataListForShowLength = totalRow
      this.searchFilterSet = searchFilterSet
    },
    handleClearAdvancedSearchFilter(){
      this.searchFilterSet = {}
      this.search = ""
      this.confirmedSearch = ""
      this.$refs.advancedSearchDialog.searchFilterSet = this.$refs.advancedSearchDialog.initSearchFilterSet()
      this.currentPage = 1
      if(this.beforeClear != null){
        this.beforeClear()
      }else{
        this.handleRefresh()
      }
    },
    handleSelect(selection, row){
      this.$emit("select", selection, row)
    },
    getRef(){
      return this.$refs.table
    },
    handleSelectAll(selection){
      this.$emit("select-all", selection)
    }
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
@import "@/static/variables.scss"
::v-deep
  .el-table
   cursor: pointer
   th
    padding: 0px
.old-style
  .search-bar
    width: 100%
.standard-style    
  .search-bar
    display: flex
    align-items: center
  .title-row
    align-items: center
  .advanced-search-button
    border-style: none
    color: $main-theme-plain
    font-size: 1.5rem
.icon
  font-size: 2rem
  margin-right: .5em
.base-row
  display: flex
</style>