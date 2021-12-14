<template>
<div>
    <div class="row">
        <div style="width: 30%"><el-tag effect="dark">{{fieldName}}</el-tag></div>
        <div style="width: 20%" class="value-text-wrapper">
            <el-tooltip v-if="oldValue != null && oldValue != ''" class="item" effect="dark" :content="oldValue" placement="top-start">
                <el-tag class="value-text" type="danger">{{oldValue}}</el-tag>
            </el-tooltip>
        </div>
        <i class="el-icon-right "></i>
        <div style="width: 20%" class="value-text-wrapper">
            <el-tooltip v-if="newValue != null && newValue != ''" class="item" effect="dark" :content="newValue" placement="top-start">
                <el-tag type="success">{{newValue}}</el-tag>
            </el-tooltip>
        </div>
        <div style="width: 30%; text-align: right">
            <span :style="{'font-weight': 'bold'}">{{name}}</span>
        </div>
    </div>
    <el-divider v-if="withDivider"/>
</div>
</template>
<script lang="js">
import Vue from "vue";
export default Vue.extend({
    props: {
        name: {
            type: String,
            required: false,
        },
        hasDivider: {
            type: Boolean,
            required: false,
        },
        fieldName: {
            type: String,
            required: true,
            default: ""
        },
        oldValue: {
            type: String,
            required: true,
            default: ""
        },
        newValue: {
            type: String,
            required: true,
            default: ""
        },
        createdDate: {
            type: String,
            required: true,
            default: ""
        },
        withDivider: {
            type: Boolean,
            required: false,
            default: true
        }
    }
})
</script>
<style lang="sass" scoped>
.row
    display: flex
    align-items: center
.value-text-wrapper
    overflow: hidden
.value-text
    text-decoration: line-through
    color: #BBBBBB
    text-overflow: ellipsis
    overflow: hidden

</style>