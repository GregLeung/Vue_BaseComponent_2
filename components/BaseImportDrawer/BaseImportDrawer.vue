<template>
    <new-standard-dialog
      icon="el-icon-folder-add"
      :visible="visible"
      :title="label"
      fullscreen
      @close="handleClose"
    >
      <v-main class="v-application">
        <v-container>
          <v-row class="justify-end">
            <v-btn
              v-if="errorList.length > 0"
              text
              color="red"
              @click="handleOpenErrorDialog"
            >
              {{ $t("Show Error") }} <v-icon right> mdi-check-circle </v-icon>
            </v-btn>
            <v-btn text color="primary" @click="handleSubmit">
              {{ $t("Save") }} <v-icon right> mdi-check-circle </v-icon>
            </v-btn>
          </v-row>
          <v-file-input
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet .csv application/vnd.ms-excel"
            label="File input"
            v-model="file"
            @change="importExcel"
          ></v-file-input>
          <base-grid-table
            v-if="importData.length <= 500"
            ref="table"
            :isAllowCreate="() => true"
            :dataList="importData"
            :columnList="columnList"
            :defaultSortProp="defaultSortProp"
            :defaultSort="defaultSort"
            :createDefaultValue="
              () => {
                return {};
              }
            "
          />
          <simple-table v-else :dataList="importData">
            <el-table-column v-for="(column, index) in columnList" :key="index" :prop="column.prop" :label="column.label"/>
          </simple-table>
          <slot></slot>
        </v-container>
      </v-main>
      <new-standard-dialog
        icon="el-icon-s-release"
        :visible="errorMessageVisible"
        title="Error Message"
        width="95%"
        appendToBody
        @close="handleErrorDialogClose"
      >
        <div>
          <h4 style="color: red">Error Message</h4>
          <p v-for="(error, index) in errorList" :key="index">
            Row: {{ error.rowIndex + 1 }}, Message: {{ error.errorMessage }}
          </p>
        </div>
      </new-standard-dialog>
    </new-standard-dialog>

</template>
<script lang="js">
import Vue from "vue";
import ExcelJS from "exceljs"
export default{
    props: {
        visible: {
            type: Boolean,
            required: true,
            default: false
        },
        label: {
            type: String,
            required: true,
            default: "Import Excel"
        },
        columnList: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
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
        importEachRowCallback: {
            type: Function,
            required: true
        },
        errorList: {
          type: Array,
          required: true,
          default: () => {
            return []
          }
        }
    },
    methods: {
        handleOpenErrorDialog(){
          this.errorMessageVisible = true
        },
        handleSubmit(){
            this.$emit("submit", this.importData)
        },
        async importExcel(){
            if(this.file != null){
                if(this.file.type == "application/vnd.ms-excel"){
                  this.alert("Please convert to CSV format or xlsx format")
                  this.file = null
                }else if(this.file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
                  const wb = new ExcelJS.Workbook();
                  const reader = new FileReader()
                  reader.readAsArrayBuffer(this.file)
                  reader.onload = () => {
                      var result = []
                      const buffer = reader.result;
                      wb.xlsx.load(buffer).then(workbook => {
                          workbook.eachSheet((sheet, id) => {;
                              sheet.eachRow((row, rowIndex) => {
                                result.push(this.importEachRowCallback(row.values))
                              })
                          })
                          this.importData = result
                      }).catch(e => {
                        this.alert(e)
                      })
                      this.file = null
                  }
                }else if(".csv"){
                  const reader = new FileReader()
                  reader.readAsText(this.file);
                  var result = []
                  reader.onload = () => {
                    const buffer = reader.result;
                    var rows = buffer.split("\n")
                    rows = rows.map(row => {
                      return row.split(",")
                    })
                    rows.forEach(row => {
                      result.push(this.importEachRowCallback(row))
                    })
                    this.importData = result
                    this.file = null
                  }
                }
            }
        },
        handleClose(){
            this.$emit("update:visible", false)
            this.$emit("close", false)
            this.file = null
            this.importData = []
        },
        handleErrorDialogClose(){
          this.errorMessageVisible = false
        }
    },
    data(){
        return {
            file: null,
            importData: [],
            errorMessageVisible: false
        }
    }
}
</script>
<style lang="sass" scoped>
.v-main
  padding: 0px !important
</style>