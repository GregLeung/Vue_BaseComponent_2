<template>
  <div id="base-table" class="container">
    <div class="table-wrapper" v-click-outside="handleClickOutside" @copy="handleCopy" @paste="handlePaste">
      <el-table :key="key" highlight-current-row :max-height="windowHeight*0.75" @sort-change="sortChange" class="table mb-16" border :data="dataList" style="width: 100%" ref="table" :row-style="rowStyle" @row-click="handleRowClick" @row-dblclick="handleRowDoubleClick" @cell-click="handleCellClick" :row-class-name="tableRowClassName" :cell-class-name="tableCellClassName" :header-cell-style="{ 'padding': '3px 0', 'background-color': '#DDDDDD' }">
        <el-table-column v-for="(column, index) in visibleColumn" v-bind:key="index" :label="column.label" :sortable="(column.sortable != null) ?column.sortable :'custom'" :min-width="column.width" :prop="column.prop" :fixed="column.fixed" show-overflow-tooltip :filters="filterColumnValue(column)" :filter-method="filterHandler">
          <template slot-scope="scope">
            <cell :ref="'el-table_column_' + index + '_row_index_' + scope.$index + '_'" :class="'row_index_' + scope.$index" :columnProp="column.prop" :column="column" :row="scope.row" :columnIndex="index" :columnID="scope.column.id" :cell-update="handleCellUpdate" :showValue="column.showValue != null ? column.showValue(column, scope.row, index, scope.$index): null" :isEditable="column.isEditable" :editConfig="column.editConfig" :cellStyle="column.cellStyle">
                <div :slot="column.prop + '-active'" slot-scope="scope">
                  <slot :name="column.prop  + '-active'" :row="scope.row" :isEditing="scope.isEditing" :isEditable="scope.isEditable" :editConfig="scope.editConfig" :isSelected="scope.isSelected"></slot>
                </div>
                <div :slot="column.prop + '-inactive'" slot-scope="scope">
                  <slot :name="column.prop  + '-inactive'" :row="scope.row" :isEditing="scope.isEditing" :isEditable="scope.isEditable" :editConfig="scope.editConfig" :isSelected="scope.isSelected"></slot>
                </div>
                <div :slot="column.prop + '-popOver'" slot-scope="scope">
                  <slot :name="column.prop  + '-popOver'" :row="scope.row" :isEditing="scope.isEditing" :isEditable="scope.isEditable" :editConfig="scope.editConfig" :isSelected="scope.isSelected"></slot>
                </div>
            </cell>
          </template>
        </el-table-column>
      </el-table>
      <context-menu @right-click="handleRightClick" :divided="true">
        <div v-for="(item, i) in rightClickMenuList" v-bind:key="i">
          <context-menu-item :label="item.label" :value="item.value" @click="(value, label) => {handleMenuItemClick(value, label, item)}" :icon='item.icon' :iconColor="item.iconColor">{{item.label}}</context-menu-item>
        </div>
      </context-menu>
    </div>
    <column-setting-drawer :columnList="columnList" :originalColumnList="originalColumnList" :visible.sync="columnSettingVisible" @confirm="handleColumnListConfirm"></column-setting-drawer>
  </div>
</template>

<script>
import Cell from "./Cell";
import ContextMenu from "./ContextMenu"
import ContextMenuItem from "./ContextMenuItem"
import ColumnSettingDrawer from "./ColumnSettingDrawer"
export default {
  components: {
    Cell,
    ContextMenu,
    ContextMenuItem,
    ColumnSettingDrawer
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
    cellUpdate: {
      type: Function,
      required: false,
    },
    rowUpdate: {
      type: Function,
      required: false,
    },
    dataList: {
      type: Array,
      required: true,
      default: function(){
        return []
      }
    },
    createDefaultValue: {
      type: Function,
      required: false,
    },
    isAllowCreate: {
      type: Function,
      required: false,
      default: () => {
        return false
      }
    },
    indexWidth: {
      type: String,
      required: false,
      default: "60"
    },
    extraRowMenuList: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    }
  },
  async mounted() {
    this.init()
    // this.addScrollDetector()
  },
  watch: {
    dataList(value, oldVal){
      if(this.isAllowCreate(this.dataList) && this.dataList.length == 0){
        this.$nextTick(()=>{
          this.addNewLine()
        })
      }
    }
  },
  data() {
    return {
      lastSubSelectedCellRef: null,
      windowHeight: window.innerHeight,
      currentSortProp: null,
      visibleAdvancedSearchDialog: false,
      currentSortOrder: "ascending",
      key: "",
      rowMenuList: [],
      headerMenuList: [{label: "Column Settings", value: "Column Settings", icon: "el-icon-setting", iconColor: "blue"}],
      rightClickMenuList: [],
      rightClickSelectedRow: {},
      columnSettingVisible: false,
      originalColumnList: []
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
    init(){
      this.handleDefaultSorting()
      this.addKeyListener()
      this.originalColumnList = this.deepClone(this.columnList)
    },
    async handlePaste(event){
      try{
        var pasteValue = await navigator.clipboard.readText();
        pasteValue = pasteValue.split("\n")
        pasteValue = pasteValue.map(f => f.split("\t"))
        pasteValue.forEach(f => {
          if(f.at(-1) == "")
            f.pop()
        })
        var cellRef = this.getSelectedCellRef()
        var rowIndex = cellRef.getRowIndex()
        var columnIndex = cellRef.columnIndex
        var currentRow = 0;
        var currentColumn = 0;
        for(let i = 0; i<pasteValue.length; i++){
          var rowPasteValue = pasteValue[i]
          for(let j = 0; j<rowPasteValue.length; j++){
            var f = rowPasteValue[j]
            var currentCellRef = this.getCellRefByPosition(Number(rowIndex) + Number(currentRow), Number(columnIndex) + Number(currentColumn))
            if(currentCellRef != null){
              currentCellRef.localValue = f
              await currentCellRef.editSubmit()
              currentColumn += 1
            }
          }
          currentRow += 1
          currentColumn = 0
        }
      }catch(e){
        console.log(e);
      }
    },
    async handleCopy(){
      try{
        if(this.lastSubSelectedCellRef != null){
          var result = "";
          var cellRefList = this.getAllSelectedCellRefList()
          var rowIndex = null
          cellRefList.forEach(f => {
            f.isCopy = true
            if(rowIndex != null && rowIndex != f.getRowIndex())
              result += "\n" + f.getDisplay() + "\t"
            else
              result += f.getDisplay() + "\t"
            rowIndex = f.getRowIndex()
          })
          await navigator.clipboard.writeText(result)
        }else{
          var cellRef = this.getSelectedCellRef()
          cellRef.isSelected = true
          cellRef.isCopy = true
          await navigator.clipboard.writeText(cellRef.getDisplay())
        }
      }catch(e){
        console.log(e);
      }
    },
    filterColumnValue(column){
      var result = this.filterUnique(this.dataList, column.prop).map(f => {
        if(f[column.prop] != null)
          return {
            text: f[column.prop].toString() ?? "",
            value: f[column.prop].toString() ?? ""
          }
        else
          return {
            text: "",
            value: ""
          }
      })
      result.sort((a,b) => a.text.localeCompare(b.text))
      return result
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] == value;
    },
    handleDelete(rowIndex){
      this.dataList.splice(rowIndex, 1);
      this.$emit("update:dataList",this.dataList)
    },
    handleColumnListConfirm(columnList){
      this.columnList = columnList
    },
    async handleMenuItemClick(value, label, config){
      switch(value){
        case "Delete":
          if(await this.confirm("Confirm To Delete"))
            this.handleDelete(this.rightClickSelectedRow.innerProperty.rowIndex, 1)
          break;
        case "Add New Line":
            this.addNewLine()
          break;
        case "Copy":
            this.handleCopy()
          break;
        case "Paste":
          this.handlePaste()
        break;
        case "Column Settings":
          this.columnSettingVisible = true
          break;
        default:
          if(config.click != null)
            config.click(value, label, this.rightClickSelectedRow, this.dataList)
      }
    },
    handleRightClick(event){
      try{
        var rowClassName = event.path.find(f => f.className.includes("cell-container") && f.className.includes("row_index_")).className.trim()
        var rowIndex = rowClassName.split("_").at(-1)
        var cellRef = this.getCellRefByPosition(rowIndex, 0)
        this.rightClickSelectedRow = cellRef.row
        var rowMenu = this.deepClone(this.rowMenuList)
        if(this.isAllowCreate(this.dataList)){
          rowMenu.push({label: "Delete", value: "Delete", icon: "el-icon-delete-solid", iconColor: "red"})
          rowMenu.push({label: "Add New Line", value: "Add New Line", icon: "el-icon-plus", iconColor: "blue"})
          rowMenu.push({label: "Copy", value: "Copy", icon: "el-icon-document-copy", iconColor: "green"})
          rowMenu.push({label: "Paste", value: "Paste", icon: "el-icon-s-order", iconColor: "red"})
        }
        rowMenu = rowMenu.concat(this.extraRowMenuList)
        this.rightClickMenuList = rowMenu
      }catch(e){
        console.log(e);
        this.rightClickMenuList = this.headerMenuList
        this.rightClickSelectedRow = {}
      }
    },
    addKeyListener(){ 
      document.addEventListener('keydown', event => {
        if(this.isSelecting() && !this.isEditing() && this.isValidKey(event.key)){
            const key = event.key
            var currentCellRef = this.getSelectedCellRef()
            var columnIndex = currentCellRef.columnIndex
            var rowIndex = currentCellRef.row.innerProperty.rowIndex
            var nextRowIndex = rowIndex
            var nextColumnIndex = columnIndex
            if (key === 'ArrowRight') {
                nextRowIndex = rowIndex
                if(columnIndex + 1 >= this.totalColumnNumber)
                    nextColumnIndex = columnIndex;
                else
                    nextColumnIndex = columnIndex + 1
                this.moveCursor(nextRowIndex, nextColumnIndex, event.shiftKey, key)
            }else if(key === 'ArrowLeft'){
                nextRowIndex = rowIndex
                if(columnIndex - 1 < 0)
                    var nextColumnIndex = columnIndex;
                else
                    var nextColumnIndex = columnIndex - 1
                this.moveCursor(nextRowIndex, nextColumnIndex, event.shiftKey, key)
            }else if (key === 'ArrowUp') {
                nextRowIndex = currentCellRef.row.innerProperty.rowIndex - 1
                if(nextRowIndex < 0)
                    nextRowIndex = rowIndex
                nextColumnIndex = columnIndex
                this.moveCursor(nextRowIndex, nextColumnIndex, event.shiftKey, key)
            }
            else if (key === 'ArrowDown') {
                if(currentCellRef.row.innerProperty.rowIndex + 1 >= this.$refs.table.tableData.length){
                  if(this.isAllowCreate(this.dataList)){
                    this.addNewLine()
                    nextRowIndex = currentCellRef.row.innerProperty.rowIndex + 1
                  }
                }else{
                  nextRowIndex = currentCellRef.row.innerProperty.rowIndex + 1
                }
                var nextColumnIndex = columnIndex
                this.moveCursor(nextRowIndex, nextColumnIndex, event.shiftKey, key)
            }
            else if(key == "Backspace" || event.keyCode == 46){
              var selectedRowIndex = this.getSelectedRowIndex()
              if(selectedRowIndex != null && confirm("Confirm To Delete"))
                this.handleDelete(this.getSelectedRowIndex(), 1)
              this.moveCursor(nextRowIndex, nextColumnIndex, event.shiftKey, key)
            }
            else if(key == "Enter"){
              this.focusCell(currentCellRef.row, Object.assign(currentCellRef.column, {index: columnIndex}), event)
            }
            event.preventDefault()
        }
    })
    },
    moveSubCursor(nextRowIndex, nextColumnIndex, key){
      var currentCellRef = this.getSelectedCellRef()
      if(this.lastSubSelectedCellRef == null){
          var nextCellRef = this.getCellRefByPosition(nextRowIndex, nextColumnIndex)
          this.lastSubSelectedCellRef = nextCellRef
      }else{
        switch(key){
          case "ArrowRight":
              var nextCellRef = this.getCellRefByPosition(this.lastSubSelectedCellRef.getRowIndex(), this.lastSubSelectedCellRef.columnIndex + 1);
              break;
          case "ArrowLeft":
              var nextCellRef = this.getCellRefByPosition(this.lastSubSelectedCellRef.getRowIndex(), this.lastSubSelectedCellRef.columnIndex - 1);
              break;
          case "ArrowUp":
              var nextCellRef = this.getCellRefByPosition(this.lastSubSelectedCellRef.getRowIndex() - 1, this.lastSubSelectedCellRef.columnIndex);
              break;
          case "ArrowDown":
              var nextCellRef = this.getCellRefByPosition(this.lastSubSelectedCellRef.getRowIndex() + 1, this.lastSubSelectedCellRef.columnIndex);
              break;
          }
          this.lastSubSelectedCellRef = nextCellRef
      }
      this.setSubFocus(currentCellRef,this.calculateCellDistanceDiff(currentCellRef, nextCellRef))
    },
    setSubFocus(currentCellRef, distanceMap){
      this.unFocusSubSelect()
      var xAxisElementList = [0]
      var yAxisElementList = [0]
      if(distanceMap.xAxis > 0){
        for(let i = 1; i <= distanceMap.xAxis; i++){
          xAxisElementList.push(i)
        }
      }
      else if(distanceMap.xAxis < 0){
        for(let i = -1; i >= distanceMap.xAxis; i--){
          xAxisElementList.push(i)
        }
      }
      if(distanceMap.yAxis > 0){
        for(let i = 1; i <= distanceMap.yAxis; i++){
          yAxisElementList.push(i)
        }
      }
      else if(distanceMap.yAxis < 0){
        for(let i = -1; i >= distanceMap.yAxis; i--){
          yAxisElementList.push(i)
        }
      }
      xAxisElementList.forEach(x => {
        yAxisElementList.forEach(y => {
          if(y != 0 || x != 0){
            var cellRef = this.getCellRefByPosition(currentCellRef.getRowIndex() + y, currentCellRef.columnIndex + x)
            cellRef.isSubSelected = true
          }
        })
      })
    },
    calculateCellDistanceDiff(cellRef1, cellRef2){
      return {
        xAxis: cellRef2.columnIndex - cellRef1.columnIndex,
        yAxis: cellRef2.getRowIndex() - cellRef1.getRowIndex(),
      }
    },
    moveCursor(nextRowIndex, nextColumnIndex, isShift, key){
      if(!isShift){
        this.unFocus()
        setTimeout(() =>{
          var nextCellRef = this.getCellRefByPosition(nextRowIndex, nextColumnIndex)
          nextCellRef.isSelected = true
          this.$refs.table.setCurrentRow(nextCellRef.row)
          this.scollIntoElement(nextCellRef.$el, key)
        }, 10);
      }else{
        this.moveSubCursor(nextRowIndex, nextColumnIndex, key)
      }
    },
    scollIntoElement(element, key = null){
      if(!this.isInViewport(element)){
        element.scrollIntoView();
        if(key == "ArrowLeft")
          document.getElementsByClassName("el-table__body-wrapper")[0].scrollBy(-100, 0)
      }
    },
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 300 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    getSelectedRowIndex(){
      var object = this.dataList.find(f => f.innerProperty.isSelected)
      if(object != null)
        return object.innerProperty.rowIndex
    },
    isValidKey(key){
      return key == "ArrowRight"  || key == "ArrowLeft" || key == "ArrowUp" || key == "ArrowDown" || key == "Backspace" || key == "Enter"
    },
    isSelecting(){
        for (let key in this.$refs) {
            if(key.includes("el-table") &&  this.$refs[key].length > 0 &&  this.$refs[key][0].isSelected)
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
      try{
        return this.$refs['el-table_' + 'column_' + columnIndex  + "_row_index_" + rowIndex  + "_"][0]
      }catch(e){
        console.log(e);
        return null
      }
    },
    getSelectedCellRef(){
        for (let key in this.$refs) {
            if(key.includes("el-table") && this.$refs[key].length > 0 && this.$refs[key][0].isSelected)
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
      this.unFocus()
      cellRef.isSelected = true
      this.$emit("cell-click", row, column, cell, event)
      this.triggerRowClassName()
    },
    handleCellUpdate(value, columnProp, updatedRow, row, column){ 
      if(column.update != null)
        var updatedRow = column.update(value, columnProp, updatedRow, row, column);
      else if(this.cellUpdate != null)
        var updatedRow = this.cellUpdate(value, columnProp, updatedRow, row, column)
      if(updatedRow instanceof Promise)
        updatedRow.then(res => {
          var index = this.dataList.findIndex(f => f.innerProperty.rowIndex == res.innerProperty.rowIndex)
          this.dataList[index] = res
          this.$refs.table.setCurrentRow(this.dataList[index])
        })
      else{
        var index = this.dataList.findIndex(f => f.innerProperty.rowIndex == updatedRow.innerProperty.rowIndex)
        this.dataList[index] = updatedRow
        this.$refs.table.setCurrentRow(this.dataList[index])
      }
      this.$emit("after-update",value, columnProp, updatedRow, row, column)
    },
    handleClickOutside(event){
        this.unFocus()
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
    getAllSelectedCellRefList(){
      var result = []
      for (let key in this.$refs) {
        if(key.includes("el-table") &&  this.$refs[key].length > 0){
          if(this.$refs[key][0].isSelected || this.$refs[key][0].isSubSelected)
            result.push(this.$refs[key][0])
        }
      }
      return result
    },
    unFocusSubSelect(){
      for (let key in this.$refs) {
        if(key.includes("el-table") &&  this.$refs[key].length > 0){
          this.$refs[key][0].isSubSelected = false
          this.$refs[key][0].isCopy = false
        }
      }
    },
    unFocus(){
      for (let key in this.$refs) {
        if(key.includes("el-table") &&  this.$refs[key].length > 0){
          this.$refs[key][0].unFocus()
        }
      }
      this.lastSubSelectedCellRef = null
    },
    handleRowDoubleClick(row, column, event){
      this.focusCell(row, column, event)
    },
    handleRowClick(row, column, event){
      this.$emit("row-click",row, column, event)
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
    addNewLine(lineObject = null){
        var newObject = lineObject
        if(newObject == null)
          this.dataList.push(Object.assign(this.createDefaultValue == null ? {} : this.createDefaultValue(), {
            innerProperty: {
              isCreatedRow : true,
              isSelected: false,
              rowIndex: this.dataList.length + 1
            }
          }))
        else{
          this.dataList.push(Object.assign(newObject, {
            innerProperty: {
              isCreatedRow : true,
              isSelected: false,
              rowIndex: this.dataList.length + 1
            }
          }))
        }
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
    triggerRowClassName(rowIndex){
      this.$refs.table.setCurrentRow()
      this.$refs.table.setCurrentRow(rowIndex)
    }
  },
  computed: {
    visibleColumn: function(){
      var indexColumn = {
        label: "",
        type: String,
        showValue: (column, row, columnIndex, rowIndex) => {
          return rowIndex + 1
        },
        sortable: false,
        isEditable: false,
        width: this.indexWidth,
        fixed: true,
        cellStyle: {
          "width": "100%",
          "padding": "1px"
        }
      }
      return [indexColumn].concat(this.columnList.filter(f => !f.isHidden || false))
    },
    totalColumnNumber: function(){
      return this.columnList.length + 1
    }
  },
};
</script>
<style scoped lang="sass">
.ghost
    opacity: 0.5
    background: #c8ebfb

::v-deep .el-table .el-table__header thead tr th:first-child
  background-color: #BBBBBB !important
::v-deep .el-table__body-wrapper td:first-child .cell, ::v-deep .el-table__fixed-body-wrapper td:first-child .cell
    padding-left: 0px
    padding-right: 0px
    background: #CCCCCC
    color: #909399
    font-size: .8rem
    font-weight: bold
    text-align: center
    // span
    //   margin-left: .8em
::v-deep .el-table__body-wrapper .cell
    padding-left: 0px
    padding-right: 0px
    .word-break
      margin-left: .8em
::v-deep .el-table__body-wrapper
  padding-bottom: 0px !important
::v-deep .el-table .el-table__row
  overflow: hidden
  td
    overflow: hidden

::v-deep .el-table .selected-row 
  td
    border-top: 1px solid green
    border-bottom: 1px solid green
::v-deep .el-table .el-table__header-wrapper .cell
  word-break: normal
  overflow: initial
  white-space: nowrap
::v-deep .el-table .el-table__body tbody tr td:first-child
  background: #CCCCCC
#base-table
    .word-break
        word-break: break-word
    .el-table
        font-size: .8rem
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
    // .table-wrapper
    //     height: 70vh
    //     overflow: scroll
    .row
        display: flex
        align-items: center
</style>