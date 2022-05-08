<template>
  <div>
    <c-m-s-breadcrumb v-if="breadcrumbItem.length > 0" :item="breadcrumbItem" />
    <v-container>
      <c-m-s-page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
        :iconSize="iconSize"
      />
      <v-row>
        <v-col v-if="leftCols != null" :cols="12" :xl="leftCols" :lg="leftCols" :md="leftCols" :sm="12">
            <slot name="left"></slot>
        </v-col>
        <v-col :cols="12" :xl="mainCols" :lg="mainCols" :md="mainCols" :sm="12">
          <el-card class="mt-4" :header="boxHeader">
            <div slot="header">
              <div class="d-flex align-center justify-space-between">
                <span style="font-weight: bold">{{ boxHeader }}</span>
                <slot name="header"></slot>
              </div>
            </div>
            <slot></slot>
          </el-card>
        </v-col>
        <v-col v-if="rightCols != null" :cols="12" :xl="rightCols" :lg="rightCols" :md="rightCols" :sm="12">
            <slot name="right"></slot>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="js">
import Vue from "vue";
import {CMSPageHeader, CMSBreadcrumb} from "vue_basecomponent";
export default {
    components: {
        CMSBreadcrumb,
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
        },
        leftCols: {
            required: false,
            default: null
        },
        rightCols: {
            required: false,
            default: null
        },
        mainCols: {
            required: false,
            default: 12
        }
    }
}
</script>
<style lang="sass" scoped>
</style>