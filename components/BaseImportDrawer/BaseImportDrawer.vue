<template>
  <v-app>
    <standard-drawer
      icon="el-icon-folder-add"
      :visible="visible"
      :title="label"
      size="95%"
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
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            label="File input"
            v-model="file"
            @change="importExcel"
          ></v-file-input>
          <base-grid-table
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
          <slot></slot>
        </v-container>
      </v-main>
      <standard-dialog
        icon="el-icon-s-release"
        :visible="errorMessageVisible"
        title="Error Message"
        size="95%"
        appendToBody
        @close="handleErrorDialogClose"
      >
        <div>
          <h4 style="color: red">Error Message</h4>
          <p v-for="(error, index) in errorList" :key="index">
            Row: {{ error.rowIndex + 1 }}, Message: {{ error.errorMessage }}
          </p>
        </div>
      </standard-dialog>
    </standard-drawer>
  </v-app>
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
                const wb = new ExcelJS.Workbook();
                const reader = new FileReader()
                reader.readAsArrayBuffer(this.file)
                reader.onload = () => {
                    var result = []
                    const buffer = reader.result;
                    wb.xlsx.load(buffer).then(workbook => {
                        workbook.eachSheet((sheet, id) => {
                            sheet.eachRow((row, rowIndex) => {
                                result.push(this.importEachRowCallback(row.values))
                            })
                        })
                        this.importData = result
                    })
                    this.file = null
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
</style>