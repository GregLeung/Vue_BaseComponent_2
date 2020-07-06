<template>
  <div id="base-table" class="container">
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
        :row-style="rowStyle"
        @row-click="rowClick"
      >
        <el-table-column v-if="isBatchSelection" type="selection" width="55"></el-table-column>
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
        <el-table-column v-if="showManipulation" label="Manipulation" fixed="right" :min-width="manipulationColumn.width">
          <template slot-scope="scope">
            <slot :row="scope.row"></slot>
            <el-button type="success" size="mini" @click.stop.native="handleEdit(scope.row)">Edit</el-button>
            <el-popconfirm
              @click.stop.native=""
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
        title="Edit"
        :visible.sync="dialogVisible"
        width="70%"
      >
        <div v-for="(item, index) in columnList" :key="index">
          <el-row v-if="!item['disabled']" class="margin-bottom-24" type="flex" align="middle" justify="center">
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
        </div>
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
    showManipulation:{
      type: Boolean,
      required: false,
      default: true
    },
    columnList: {
      type: Array,
      required: true
    },
    tableName: {
      type: String,
      required: true
    },
    manipulationColumn: {
      type: Object,
      required: false,
      default: () => {width: 150}
    },
    title: {
      type: String,
      required: false
    },
    isBatchSelection: {
      type: Boolean,
      required: false,
      default: false
    },
    customRefresh: {
      type: Function,
      required: false,
      default: null
    },
    rowClick:{
      type: Function,
      required: false,
      default: (row, column, event) =>{}
    },
    rowStyle:{
      type: Function,
      required: false,
      default:({row, Object}) => {}
    }
  },
  mounted() {
    this.handleRefresh();
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
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === this.$refs.table.columns.length - 1) {
        return "background:#EEEEEE";
      }
    },
    handleSelectionChange(val) {
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
      Request.get(this, "delete_" + this.tableName, { ID: row.ID }, res => {
        if (res.code == -1) throw res.data.data;
        this.$notify({
          title: "Success",
          message: "",
          type: "success"
        });
        this.handleRefresh();
      });
    },
    async handleRefresh() {
      try {
        if (this.customRefresh) {
          this.dataList = await this.customRefresh();
        } else {
          Request.get(this, "get_" + this.tableName + "_all", {}, res => {
            this.dataList = res.data[this.tableName.toString()];
          });
        }
      } catch (error) {
        this.dataList = [];
      }
    },
    handleUpdate() {
      var updateData = {
        ID: this.currentSelection["ID"]
      };
      this.columnList.forEach(f => {
        updateData[f.prop] = this.currentSelection[f.prop];
      })
      Request.post(
        this,
        "update_" + this.tableName,
        updateData,
        res => {
          if (res.code == -1) throw res.data.data;
          this.$notify({
            title: "Success",
            message: "",
            type: "success"
          });
          this.dialogVisible = false;
          this.handleRefresh();
        }
      );
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
.container
  height: 70vh
  .table-wrapper
    height: 100%
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
<style lang="sass">
.el-table__row
  cursor: pointer
</style>


