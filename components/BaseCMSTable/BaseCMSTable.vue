<template>
  <div>
    <h1>{{name}}</h1>
    <base-table :columnList="columnList" :dataList="dataList" :tableName="dataModel" :manipulationColumn="manipulationColumn">
    <template v-slot="slotProps">
      <slot :row="slotProps.row"></slot>
    </template>
    </base-table>
  </div>
</template>

<script lang="js">
import Vue from "vue";
import BaseTable from "../BaseTable/BaseTable.vue";
import Request from "../../util/request.js"


export default Vue.extend({
  mounted() {
    this.handleRefresh()
  },
  components: {
    BaseTable
  },
  props: {
    name: {
      type: String,
      required: true
    },
    dataModel: {
      type: String,
      required: true
    },
    columnList: {
      type: Array,
      required: true
    },
    manipulationColumn:{
      type: Object,
      required: true
    }
  },

  data() {
    return {
      fullscreenLoading: false,
      dataList: []
    };
  },
  methods: {
    handleRefresh() {
      Request.get(this, "get_" + this.dataModel + "_all", {}, res => {
        this.dataList = res.data[this.dataModel.toString()];
      });
    }
  }
});
</script>

<style lang="sass">
#my_file
  visibility: hidden
.row
  display: flex
</style>