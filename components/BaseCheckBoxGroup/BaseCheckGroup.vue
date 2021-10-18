<template>
    <el-checkbox-group v-model="selectedLabel" @change="handleChange">
        <el-row>
            <el-col :span="6" v-for="label in labelList" :key="label">
                <el-tooltip :content="label" placement="top">
                    <el-checkbox :style="{width: checkBoxWidth}" :label="label" border></el-checkbox>
                </el-tooltip>
            </el-col>
        </el-row>
    </el-checkbox-group>
</template>

<script lang="js">
import Vue from "vue";
export default {
    props: {
        scaleSize: {
            type: Number,
            required: false,
            default: 1
        },
        checkBoxList: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        value: {
            type: Array,
            default: () => {
                return []
            }
        },
        checkBoxWidth: {
            type: String,
            default: "13vw"
        }
    },
    model:{
        prop: "value",
        event: "update"
    },
    mounted(){
        this.selectedLabel = this.value.map(f => {
            return this.checkBoxList.find(checkBox => checkBox.value == f).label
        })
    },
    methods: {
        handleChange(value){
            this.selectedValue = value.map(f => {
                    return this.checkBoxList.find(checkBox => checkBox.label == f).value
                })
            this.$emit("update", this.selectedValue)
            this.$emit("change", this.selectedValue)
        }
    },
    watch:{
        // selectedLabel(value){
        //     if(value != null){
        //         this.selectedValue = value.map(f => {
        //             return this.checkBoxList.find(checkBox => checkBox.label == f).value
        //         })
        //         this.$emit("update", this.selectedValue)
        //     }
        // },
        value(newValue){
            this.selectedValue = newValue
            this.selectedLabel = newValue.map(f => {
                return this.checkBoxList.find(checkBox => checkBox.value == f).label
            })
        }
    },
    data(){
        return {
            selectedLabel: [],
        }
    },
    computed: {
        size() {
            return (this.scaleSize - 1) * 14 / 2
        },
        containerWidth(){
            return this.scaleSize * 14
        },
        labelList(){
            return this.checkBoxList.map(f => f.label)
        }
    }
}
</script>

<style lang="sass" scoped>
::v-deep
    .el-checkbox
        overflow: hidden
        text-overflow: ellipsis
        margin-bottom: 1em
    .el-checkbox__label
        display: initial
    .el-checkbox.is-bordered+.el-checkbox.is-bordered
        margin-left: 0px !important
</style>
