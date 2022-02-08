<template>
    <div>
        <h3 v-if="!isSelected" class="title">Advanced Search</h3>
        <div v-else>
            <span class="title" v-for="(item, index) in columnList.filter(f => f.hasOwnProperty('advancedSearch'))" :key="index">
                <span v-if="value[item.prop] != null && Array.isArray(value[item.prop].value)">
                    <span v-for="(selectedValue, selectedKey) in value[item.prop].value" :key="selectedKey" >
                        <el-tag v-if="selectedValue != null" @close="handleCloseTag(value[item.prop], value, selectedValue)" class="mr-4" closable>{{convertValueToLabel(selectedValue, item)}}</el-tag>
                    </span>
                </span>
                <span v-else-if="value[item.prop] != null && value[item.prop].value != ''">
                    <el-tag @close="handleCloseTagString(value[item.prop], value, value[item.prop].value)" class="mr-4" closable>{{formatValue(value[item.prop].value, item)}}</el-tag>
                </span>
            </span>
            <el-button type="text" @click="handleReset">Reset</el-button>
        </div>
    </div>
</template>
<script lang="js">
import Vue from "vue";
export default{
    props: {
        value: {
            type: Object,
            required: true
        },
        columnList: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        }
    },
    computed: {
        isSelected(){
            for (const [key, object] of Object.entries(this.value)) {
                if(object.value != [] && object.value != "")
                    return true
            }
            return false
        }
    },
    model:{
        prop: "value",
        event: "update"
    },
    methods: {
        handleCloseTag(searchFilterItem, searchFilterSet, selectedValue){
            if(searchFilterItem.type == "TIME-RANGE")
                searchFilterItem.value = []
            else
                searchFilterItem.value = searchFilterItem.value.filter(f => f != selectedValue)
            this.$emit("update", searchFilterSet)
        },
        handleCloseTagString(searchFilterItem, searchFilterSet, selectedValue){
            searchFilterItem.value = ""
            this.$emit("update", searchFilterSet)
        },
        convertValueToLabel(value, column){
            try{
                if(column.advancedSearch.hasOwnProperty("options"))
                    value = column.advancedSearch.options.find(f => f.value == value).label
                return this.formatValue(value, column)
            }catch(e){
                console.log(e)
                return value
            }
        },
        formatValue(value, column){
            try{
                if(column.advancedSearch.hasOwnProperty("format"))
                    return column.advancedSearch.format(value)
                return value
            }catch(e){
                console.log(e)
                return value
            }
        },
        handleReset(){
            for (const [key, object] of Object.entries(this.value)) {
                if(Array.isArray(object.value))
                    object.value = []
                else
                    object.value = ""
            }
        }
    }
}
</script>
<style lang="sass" scoped>
.title
    color: white
</style>