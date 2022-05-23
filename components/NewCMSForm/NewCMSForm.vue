<template>
<div>
    <!-- <c-m-s-breadcrumb v-if="breadcrumbItem.length > 0" :item="breadcrumbItem" /> -->
    <div class="form-container" :style="{width: width}">
        <c-m-s-page-header :title='title' :subtitle='subtitle' :icon='icon' :iconSize="iconSize"/>
        <el-card class="mt-4" :header="boxHeader" >
            <div slot="header">
                <div class="base-row">
                    <span style="font-weight: bold">{{boxHeader}}</span>
                    <slot name="header"></slot>
                </div>
            </div>
            <slot></slot>
        </el-card>
    </div>
</div>
</template>
<script lang="js">
import Vue from "vue";
// import CMSBreadCrumb from "../CMSBreadCrumb/CMSBreadCrumb.vue";
// import CMSPageHeader from "../CMSPageHeader/CMSPageHeader.vue";
import {CMSPageHeader} from "vue_basecomponent";
export default {
    components: {
        CMSPageHeader
    },
    props: {
        breadcrumbItem: {
            type: Array,
            required: false,
            default: () => {
                return []
            }
        },
        icon: {
            type: String,
            required: false,
            default: null
        },
        iconSize: {
            type: String,
            required: false,
            default: "2.5rem"
        },
        title: {
            type: String,
            required: false,
            default: ''
        },
        subtitle: {
            type: String,
            required: false,
            default: ''
        },
        titleStyle: {
            type: Object,
            required: false,
            default: () => {
               return {'font-size': '2rem'}
            }
        },
        subtitleStyle: {
            type: Object,
            required: false,
            default: () => {
               return {'font-size': '0.75rem'}
            }
        },
        boxHeader: {
            type: String,
            required: false,
            default: null
        },
        width: {
            type: String,
            required: false,
            default: "80%"
        }
    }
}
</script>
<style lang="sass" scoped>
.form-container
    width: 100% 
    margin-left: auto
    margin-right: auto
    padding-top: 1%   
    // padding-left: 10%   
    // padding-right: 10%   
    .base-row
        display: flex
        align-items: center
        justify-content: space-between
</style>