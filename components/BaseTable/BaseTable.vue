<template>
  <div class="container">
      <h1>{{title}}</h1>
    <el-input
      class="margin-bottom-24 search-input"
      v-model="search"
      size="medium"
      placeholder="Search"
    />
    <div class="table-wrapper">
      <el-table
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
        class="table margin-bottom-24"
        border
        height="100%"
        :data="dataListForShow"
        style="width: 100%"
        :cell-style="cellStyle"
        ref="table"
        :header-cell-style="{background:'#333333', color: 'white'}"
      >
    <el-table-column
        v-if="isBatchSelection"
        type="selection"
        width="55">
    </el-table-column>
        <el-table-column
          :label="column.label"
          v-for="(column, index) in columnList"
          v-bind:key="index"
          sortable="custom"
          :min-width="column.width"
          :prop="column.prop"
          :fixed="column.fixed"
        >
          <template slot-scope="scope">
            <span
              v-if="column.hasOwnProperty('parseValue') && parseData(scope.row, column,column.prop) != null"
            >
              <el-tag
                :type="parseData(scope.row, column,column.prop).type"
              >{{ parseData(scope.row, column,column.prop).label }}</el-tag>
            </span>
            <span v-else>{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Manipulation" fixed="right" :min-width="manipulationColumn.width">
          <template slot-scope="scope">
            <slot :row="scope.row"></slot>
            <el-button type="success" size="mini" @click="handleEdit(scope.row)">Edit</el-button>
            <el-popconfirm
              @onConfirm="handleDelete(scope.row)"
              :title="'Confirm to delete ID: ' + scope.row.ID "
              confirmButtonText="Confirm"
              cancelButtonText="Cancel"
            >
              <el-button slot="reference" size="mini" type="danger">Delete</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-if="currentSelection != null"
        title="修改"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-row
          class="margin-bottom-24"
          type="flex"
          align="middle"
          justify="center"
          v-for="(item, index) in columnList"
          :key="index"
        >
          <el-col :span="4">
            <span class="title-font">{{item.label}}</span>
          </el-col>
          <el-col :span="20">
            <p v-if="item.label=='ID'">{{currentSelection[item.prop]}}</p>
            <el-select
              v-else-if="item.hasOwnProperty('parseValue')"
              v-model="currentSelection[item.prop]"
              placeholder="Please Select"
            >
              <el-option
                v-for="item in item.parseValue"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input-number
              v-else-if="item.type==Number"
              v-model="currentSelection[item.prop]"
              :placeholder="item.prop"
            ></el-input-number>
            <el-date-picker
              v-else-if="item.type=='DateTime'"
              v-model="currentSelection[item.prop]"
              type="datetime"
              value-format="yyyy-MM-dd hh:mm:ss"
              :placeholder="item.prop"
            ></el-date-picker>
            <el-input v-else v-model="currentSelection[item.prop]" :placeholder="item.prop"></el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleUpdate">Confirm</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="pagination-wrapper">
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :total="dataListForShowLength"
        :page-sizes="[10, 50, 100, 500]"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Request from "../../util/request";
import Util from "../../util/util";
export default {
  props: {
    columnList: {
      type: Array,
      required: true
    },
    tableName: {
      type: String,
      required: true
    },
    manipulationColumn:{
      type: Object,
      required: true
    },
    title: {
        type: String,
        required: false
    },
    isBatchSelection: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted() {
    this.handleRefresh()
  },
  data() {
    return {
      search: "",
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      currentSelection: null,
      multipleSelection: [],
      dataList: []
    };
  },
  methods: {
    cellStyle({row, column, rowIndex, columnIndex}){
        if(columnIndex === this.$refs.table.columns.length - 1){ //指定坐            
            return 'background:#EEEEEE'
        }
    },
    handleBatchSendEmail(){
        if(this.multipleSelection.length < 1){
            this.$message.error('請選取多於一項資料');
            return
        }
        Request.get(this, "send_batch_invitation_email", {IDList: this.multipleSelection.map(f => f.ID)}, res => {
            this.$notify({
                title: "發送批次電郵成功",
                message: "",
                type: "success"
            });
            this.handleRefresh()
        })
    },
    handleSelectionChange(val){
        this.multipleSelection = val;
    },
    sortChange: function(column, prop, order) {
      if (column.order == "descending") {
        this.dataList.sort(function(a, b) {
          return ("" + b[column.prop]).localeCompare(a[column.prop]);
        });
      } else {
        this.dataList.sort(function(a, b) {
          return ("" + a[column.prop]).localeCompare(b[column.prop]);
          return a[column.prop] - b[column.prop];
        });
      }
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
      Request.get(this, "delete_" + this.tableName, {ID: row.ID}, res => {
        if (res.code == -1) throw res.data.data;
        this.$notify({
          title: "Success",
          message: "",
          type: "success"
        });
        this.handleRefresh();
      });
    },
    handleRefresh(){
        Request.get(this, "get_" + this.tableName + "_all", {}, res => {
            this.dataList = res.data[this.tableName.toString()];
        });
    },
    handleUpdate() {
      Request.get(this,"update_" + this.tableName , this.currentSelection, res => {
        if (res.code == -1) throw res.data.data;
        this.$notify({
          title: "Success",
          message: "",
          type: "success"
        });
        this.dialogVisible = false
        this.handleRefresh();
      });
    },
    parseData(row, property, currentProp) {
      if (property.hasOwnProperty("parseValue")) {
        var label = property.parseValue.find(item => {
          return item.value == row[currentProp];
        });
        return label;
      }
      return row[currentProp];
    }
  },
  computed: {
    dataListForShow: function() {
      if (this.search == "")
        return this.dataList.slice(
          this.currentPage * this.pageSize - this.pageSize,
          this.currentPage * this.pageSize
        );
      else {
        return this.dataList
          .filter(val => {
            for (let i = 0; i < Object.keys(val).length; i++) {
              if (
                val[Object.keys(val)[i]] != null &&
                val[Object.keys(val)[i]]
                  .toString()
                  .toLowerCase()
                  .includes(this.search.toLowerCase())
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
    dataListForShowLength: function() {
      if (this.search == "") return this.dataList.length;
      else
        return this.dataList.filter(val => {
          for (let i = 0; i < Object.keys(val).length; i++) {
            if (
              val[Object.keys(val)[i]] != null &&
              val[Object.keys(val)[i]]
                .toString()
                .toLowerCase()
                .includes(this.search.toLowerCase())
            )
              return true;
          }
          return false;
        }).length;
    }
  }
};
</script>
<style scoped lang="sass">
.title-font
  font-size: 20px
.table-wrapper
  height: 100%
.container
  height: 60vh
.margin-bottom-24
  margin-bottom: 24px
.margin-top-24
  margin-top: 24px
.search-input
  width: 30%
.pagination-wrapper
  display: flex
  justify-content: flex-end

</style>

