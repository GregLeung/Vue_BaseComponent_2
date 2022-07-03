<template>
  <v-container>
    <v-card>
        <v-card-title>
            {{title}}
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            label="Search"
            single-line
            hide-details
            @keydown="handleKeyDown"
        >
            <template v-slot:append>
                <v-btn
                    icon
                    color="primary"
                    @click="handleSearch"
                >
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn
                    icon
                    color="success"
                    @click="visible = true"
                >
                    <v-icon>mdi-cog-outline</v-icon>
                </v-btn>
            </template>
        </v-text-field>
        </v-card-title>
        <v-data-table
            dense
            :headers="headers"
            :items="items"
            :options.sync="options"
            :items-per-page.sync="pageSize"
            :server-items-length="totalRows"
            class="elevation-1"
            :sort-by="defaultSortProp"
            :sort-desc="defaultSort == 'descending' ? true : false"
            @click:row="handleClickRow"
            :footer-props="{
                'items-per-page-options': [20, 50, 100, 500]
            }"
        >
            <template v-for="(header,index) in headers.filter(f => f.isSlot == true)" :slot="'item.' + header.value" slot-scope="scope">
                <td :key="index">
                    <slot :name="header.value" :row="scope.item"></slot>
                </td>
            </template>
        </v-data-table>
    </v-card>
    <mobile-advanced-search-dialog :visible.sync="visible" :headers="headers" :parameters="parameters" :tableName="tableName" @confirm="handleAdvancedSearchConfirm" :paging="{
      page: 1, pageSize: this.pageSize, sort: {order: this.currentSortOrder, prop:this.currentSortProp }
    }"/>
  </v-container>
</template>
<script lang="js">
import Vue from "vue";
import {NewRequest as Request, MobileAdvancedSearchDialog} from "vue_basecomponent"
export default{
    props: {
        columnList: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        tableName: {
            type: String,
            required: true,
        },
        parameters: {
            type: Object,
            required: false,
            default: () => {
                return {}
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
        title: {
            type: String,
            required: true,
            default: ""
        }
    },
    components: {
        MobileAdvancedSearchDialog
    },
    mounted(){
        this.convertColumnListToHeader()
    },
    watch: {
      options: {
        async handler () {
          await this.getDataFromApi()
        },
        deep: true,
      },
    },
    methods: {
        convertColumnListToHeader(){
            this.headers = this.columnList.map(f => {
                return {
                    text: f.label,
                    align: 'start',
                    sortable: true,
                    value: f.prop,
                    isSlot: f.isSlot,
                    advancedSearch: f.advancedSearch
                }
            })
        },
        async handleRefresh(){
            await this.getDataFromApi()
        },
        async getDataFromApi () {
            this.loading = true
            const { sortBy, sortDesc, page, itemsPerPage } = this.options
            if(sortDesc == true || sortDesc == "true")
                var sortOrder = "descending"
            else
                var sortOrder = "ascending"
            if(sortBy.length == 0)
                var sortProp = null
            else
                var sortProp = sortBy[0]
            this.currentSortOrder = sortOrder
            this.currentSortProp = sortProp
            this.pageSize = itemsPerPage
            var parameters ={
                paging: {page: this.currentPage, pageSize: this.pageSize, search: this.search, sort: {order: this.currentSortOrder, prop: this.currentSortProp }},
            }
            parameters = Object.assign(parameters, this.parameters)
            var res = await Request.post("get_" + this.tableName + "_all", parameters)
            this.items = res.data[this.tableName].data
            this.totalRows = res.data[this.tableName].totalRow
            this.loading = false
        },
        handleClickRow(row){
            this.$emit("rowClick", row)
        },
        handleSearch(){
            this.getDataFromApi()
        },
        handleKeyDown(keyEvent){
            if(keyEvent.key == "Enter"){
                this.handleSearch()
            }
        },
        handleAdvancedSearchConfirm(dataList, totalRow, searchFilterSet){
            this.currentPage = 1
            this.items = dataList
            this.totalRows = totalRow
        },
    },
    data(){
        return {
            headers: [],
            items: [],
            options: {},
            loading: true,
            currentPage: 1,
            pageSize: 20,
            totalRows: 0,
            search: null,
            visible: false,
            currentSortOrder: null,
            currentSortProp: null
        }
    }
}
</script>
<style lang="sass" scoped>
</style>