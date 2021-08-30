<template>
  <div id="base-table" class="container">
    <div class="table-wrapper" v-click-outside="handleClickOutside">
      <el-table :key="key" highlight-current-row :max-height="windowHeight*0.75" @sort-change="sortChange" class="table mb-16" border :data="dataList" style="width: 100%" ref="table" :row-style="rowStyle" @row-click="handleRowClick" @row-dblclick="handleRowDoubleClick" @cell-click="handleCellClick" :row-class-name="tableRowClassName" :cell-class-name="tableCellClassName">
        <el-table-column  v-for="(column, index) in visibleColumn" v-bind:key="index" :label="column.label" :sortable="(column.sortable != null) ?column.sortable :'custom'" :min-width="column.width" :prop="column.prop" :fixed="column.fixed" >
          <template slot-scope="scope">
            <cell :ref="'el-table_column_' + index + '_row_index_' + scope.$index + '_'" :class="'row_index_' + scope.$index" :columnProp="column.prop" :column="column" :row="scope.row" :columnIndex="index" :columnID="scope.column.id" @cell-update="handleCellUpdate" :showValue="column.showValue != null ? column.showValue(column, scope.row, index, scope.$index): null" :isEditable="column.isEditable" :editConfig="column.editConfig"></cell>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Cell from "./Cell";
import { Request, Util } from "vue_basecomponent";
export default {
  components: {
    Cell
  },
  props: {
    columnList: {
      type: Array,
      required: true,
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
    tableName: {
      type: String,
      required: false,
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
    expandTitle: {
      type: String,
      required: false,
      default: 'Detail'
    },
    parameters: {
      type: Object,
      requried: true,
      default: function() {
        return {}
      },
    },
    isCustomRequest: {
      type: Boolean,
      required: false,
      default: false,
    },
    beforeClear: {
      type: Function,
      required: false,
    },
    cellUpdate: {
      type: Function,
      required: false,
    },
    rowUpdate: {
      type: Function,
      required: false,
    }
  },
  async mounted() {
    await this.handleRefresh();
    this.handleDefaultSorting()
    this.totalColumnNumber = this.$refs.table.columns.length
    this.addKeyListener()
    // this.addScrollDetector()
  },
  data() {
    return {
      dataList: [],
      windowHeight: window.innerHeight,
      currentSortProp: null,
      visibleAdvancedSearchDialog: false,
      currentSortOrder: "ascending",
      totalColumnNumber: 0,
      key: "",
      // lastScrollYPosition: 0
    };
  },
  directives: {
    clickOutside: {
      bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      },
    }
  },
  methods: {
    addKeyListener(){ 
      document.addEventListener('keydown', event => {
        if(this.isSelecting() && !this.isEditing() && this.isValidKey(event.key)){
            const key = event.key
            var currentCellRef = this.getSelectedCellRef()
            var columnIndex = currentCellRef.columnIndex
            var rowIndex = currentCellRef.row.innerProperty.rowIndex
            if (key === 'ArrowRight' || key === 'Tab') {
                var nextRowIndex = rowIndex
                if(columnIndex + 1 > this.totalColumnNumber)
                    var nextColumnIndex = columnIndex;
                else
                    var nextColumnIndex = columnIndex + 1
            }else if(key === 'ArrowLeft'){
                var nextRowIndex = rowIndex
                if(columnIndex - 1 < 0)
                    var nextColumnIndex = columnIndex;
                else
                    var nextColumnIndex = columnIndex - 1
            }else if (key === 'ArrowUp') {
                var nextRowIndex = currentCellRef.row.innerProperty.rowIndex - 1
                if(nextRowIndex < 0)
                    nextRowIndex = rowIndex
                var nextColumnIndex = columnIndex
            }
            else if (key === 'ArrowDown') {
                var nextRowIndex = currentCellRef.row.innerProperty.rowIndex + 1
                if(nextRowIndex >= this.dataList.length)
                    this.addNewLine()
                var nextColumnIndex = columnIndex
            }
            else if(key == "Backspace"){
              var selectedRowIndex = this.getSelectedRowIndex()
              if(selectedRowIndex != null && confirm("Confirm To Delete"))
                this.dataList.splice(this.getSelectedRowIndex(), 1);
            }
            event.preventDefault
            this.unFoucs()
            setTimeout(() =>{
              var nextCellRef = this.getCellRefByPosition(nextRowIndex, nextColumnIndex)
              nextCellRef.isSelected = true
              this.$refs.table.setCurrentRow(nextCellRef.row)
            }, 10);
        }
    })
    },
    // addScrollDetector(){
    //   const el = this.$refs.table.$el;
    //   var tableWrapper = el.querySelector('.el-table__body-wrapper');
    //   tableWrapper.addEventListener("scroll", (event)=>{
    //     this.lastScrollYPosition =  tableWrapper.scrollTop;
    //   })
    // },
    getSelectedRowIndex(){
      var object = this.dataList.find(f => f.innerProperty.isSelected)
      if(object != null)
        return object.innerProperty.rowIndex
    },
    isValidKey(key){
      return key == "ArrowRight" || key == "Tab" || key == "ArrowLeft" || key == "ArrowUp" || key == "ArrowDown" || key == "Backspace"
    },
    isSelecting(){
        for (let key in this.$refs) {
            if(key.includes("el-table") && this.$refs[key][0].isSelected)
                return true
        }
        return false
    },
    isEditing(){
        for (let key in this.$refs) {
            if(key.includes("el-table") && this.$refs[key].length > 0 && this.$refs[key][0].isEditing)
                return true
        }
        return false
    },
    getCellRefByPosition(rowIndex, columnIndex){
        return this.$refs['el-table_' + 'column_' + columnIndex  + "_row_index_" + rowIndex  + "_"][0]
    },
    getSelectedCellRef(){
        for (let key in this.$refs) {
            if(key.includes("el-table") && this.$refs[key][0].isSelected)
                return this.$refs[key][0]
        }
        return null
    },
    tableRowClassName({row, rowIndex}){
      if(row.innerProperty == null)
        row.innerProperty = {};
      row.innerProperty.rowIndex = rowIndex
      if(!row.innerProperty.hasOwnProperty("isCreatedRow"))
        row.innerProperty.isCreatedRow = false
      if(!row.innerProperty.hasOwnProperty("isSelected"))
        row.innerProperty.isSelected = false
      if(row.innerProperty.isSelected)
        return "selected-row"
    },
    tableCellClassName({row, column, rowIndex, columnIndex}){
      column.index = columnIndex
    },
    handleCellClick(row, column, cell, event){
      var cellRef = this.getCellRef(row,column, event)
      this.dataList.forEach(f => f.innerProperty.isSelected = false)
      if(column.index == 0)
        cellRef.row.innerProperty.isSelected = true
      this.removeUnselectedCellFocus(row,column, event)
      cellRef.isSelected = true
    },
    handleCellUpdate(value, columnProp, updatedRow, row){ 
      if(this.cellUpdate != null){
        var updatedRow = this.cellUpdate(value, columnProp, updatedRow, row)
      }
      var index = this.dataList.findIndex(f => f.innerProperty.rowIndex == updatedRow.innerProperty.rowIndex)
      this.dataList[index] = updatedRow
      this.$refs.table.setCurrentRow(this.dataList[index])
    },
    handleClickOutside(event){
        this.unFoucs()
    //   var refList = this.getEditingCellRefs()
    //   var result = {}
    //   if(refList.length > 0)
    //     result = Object.assign({},refList[0].row)
    //   refList.forEach(f => {
    //     f.unFocus()
    //   })
    //   refList.forEach(f => {
    //     this.assignDeepValue(result, f.columnProp, f.localValue)
    //   })
    //   this.rowUpdate(result, refList[0].row)
    },
    getEditingCellRefs(){
      var result = []
      for (let key in this.$refs) {
        if(key.includes("el-table")){
          result.push(this.$refs[key][0])
        }
      }
      result = result.filter(f => f.isEditing == true)
      return result
    },
    focusCell(row, column, event){
      try{
        var rowRefList = this.getRowRefs(row,column, event)
        var cellRef = this.getCellRef(row,column, event)
        rowRefList.forEach(f =>{
          f.sibilingRefList = rowRefList
        })
        cellRef.isEditing = true
        setTimeout(()=>{
          cellRef.focus()
          cellRef.sibilingRefList = rowRefList
        }, 10);
      }catch(e){
        console.log(e);
      }
    },
    removeUnselectedRowFocus(row, column, event){
      var selectedRefNameList = []
      var rowClass = this.getRowClass(row,column, event)
      for(let i = 0; i < this.totalColumnNumber; i++){
        selectedRefNameList.push('el-table_' + 'column_' + i   + "_" +rowClass  +"_")
      }
      for (let key in this.$refs) {
        if(!selectedRefNameList.includes(key) && key.includes("el-table")){
          this.$refs[key][0].unFocus()
        }
      }
    },
    removeUnselectedCellFocus(row, column, event){
      var rowClass = this.getRowClass(row,column, event)
      var selectedCellRefName = 'el-table_' + 'column_' + column.index  + "_" + rowClass + "_"
      for (let key in this.$refs) {
        if(selectedCellRefName != key && key.includes("el-table")){
          try{
            this.$refs[key][0].unFocus()
          }catch(e){
            console.log(e);
          }
        }
      }
    },
    getRowClass(row,column, event){
      return "row_index_" + row.innerProperty.rowIndex
    },
    getCellRef(row, column,event){
      return this.$refs["el-table_column_" + column.index + "_" + this.getRowClass(row,column, event) + "_"][0]
    },
    getRowRefs(row, column,event){
      var result = []
      var rowClass = this.getRowClass(row,column, event)
      for(let i = 0; i < this.totalColumnNumber; i++){
        result.push(this.$refs["el-table_column_" + i + "_" + rowClass + "_"][0])
      }
      return result;
    },
    unFoucs(){
      for (let key in this.$refs) {
        if(key.includes("el-table")){
          this.$refs[key][0].unFocus()
        }
      }
    },
    handleRowDoubleClick(row, column, event){
      this.focusCell(row, column, event)
    },
    handleRowClick(row, column, event){
      this.$emit("row-click",row, column, event)
    },
    handleEnterChange() {
      if (this.confirmedSearch != this.search){
        this.confirmedSearch = this.search;
        this.handleRefresh()
      }
    },
    handleDefaultSorting() {
      if (this.defaultSortProp != null && this.defaultSortProp != "") {
        if (this.defaultSort == "descending"){
          this.dataList = this.dataList.sort((a, b)=> {return (""+ this.getPropByString(b, this.defaultSortProp)).localeCompare("" + this.getPropByString(a, this.defaultSortProp))})
        }
        else
          this.dataList = this.dataList.sort( (a, b)=> {return (""+this.getPropByString(a, this.defaultSortProp)).localeCompare("" + this.getPropByString(b, this.defaultSortProp))})
      }
    },
    sortChange: function (column) {
      if (column.order == "descending") 
        this.dataList = this.dataList.sort((a, b)=> {return (""+ this.getPropByString(b, column.prop)).localeCompare("" + this.getPropByString(a, column.prop))})
      else
        this.dataList = this.dataList.sort( (a, b)=> {return (""+this.getPropByString(a, column.prop)).localeCompare("" + this.getPropByString(b, column.prop))})
    },
    getPropByString(instance, prop){
      prop.split(".").forEach(f => {
        instance = instance[f]
        if(instance == null) return instance;
      })
      return instance;
    },
    async handleRefresh(isDefaultSorting = true) {
      Util.loading();
      try {
        var parameters = this.parameters
        if(this.isCustomRequest){
          this.$emit("customRequest",parameters,(result, totalRow) => {
            this.dataList = result
          })
        }else{
          var result = await Request.postAsync(this, "get_" + this.tableName + "_all", parameters, {showLoading: false});
          this.dataList = result.data[this.tableName.toString()]
        }
      } catch (error) {
        console.log(error)
        this.dataList = [];
      }finally{
        Util.loading().close();
      }
    },
    addNewLine(){
      this.dataList.push({
        innerProperty: {
          isCreatedRow : true
        }
      })
      setTimeout(() =>{
         this.scrollToBottom()
      }, 10);
    },
    scrollToBottom(){
      try{
      const el = this.$refs.table.$el;
      var innerTable = el.querySelector('.el-table__body');
      var innerTbody = innerTable.querySelector('tbody');
      var lastRow = innerTbody.querySelector('tr:last-child');
      if (lastRow) 
        lastRow.scrollIntoView(true);
      }catch(e){
        console.log(e);
      }
    },
    // scrollToLastPosition(){
    //   const el = this.$refs.table.$el;
    //   var tableWrapper = el.querySelector('.el-table__body-wrapper');
    //   tableWrapper.scrollTop = this.lastScrollYPosition
    // },
  },
  computed: {
    visibleColumn: function(){
      var indexColumn = {
        label: "",
        type: String,
        width: 40,
        showValue: (column, row, columnIndex, rowIndex) => {
          return rowIndex + 1
        },
        sortable: false,
        isEditable: false
      }
      return [indexColumn].concat(this.columnList.filter(f => !f.isHidden || false))
    }
  },
};
</script>
<style scoped lang="sass">
::v-deep .el-table__body-wrapper .cell
    padding-left: 0
    padding-right: 0
    min-height: 2em
::v-deep .el-table__body-wrapper td:first-child .cell
    padding-left: 0
::v-deep .el-table .selected-row 
  td
    border-top: 1px solid green
    border-bottom: 1px solid green
#base-table
    .word-break
        word-break: break-word
    .el-table
        font-size: .7rem
        ::v-deep  td, th
          padding: 0
    .el-table__row
        word-break: break-word
    h1
        font-size: 1.5rem
        margin-top: .2em
        margin-bottom: .2em
    .title-font
        font-size: 1rem
    .row
        display: flex
        align-items: center
</style>