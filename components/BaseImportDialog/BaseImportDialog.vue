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
            <v-btn text color="primary" @click="handleSubmit">
              {{ $t("編輯") }} <v-icon right> mdi-check-circle </v-icon>
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
            :title="$t('Records')"
            :defaultSortProp="defaultSortProp"
            :defaultSort="defaultSort"
            :createDefaultValue="
              () => {
                return {};
              }
            "
          />
        </v-container>
      </v-main>
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
        }
    },
    methods: {
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
            this.file = null
            this.importData = []  
        },
    },
    data(){
        return {
            file: null,
            importData: []
        }
    }
}
</script>
<style lang="sass" scoped>
</style>