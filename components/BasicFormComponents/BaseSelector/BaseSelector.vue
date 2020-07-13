<template>
  <div>
    <div :class="{'form-row': direction == 'row'}">
      <div class="name input-title" :style="titleStyle">{{title}}</div>
      <div class="select-row">
        <el-select
          @input="handleOnChange"
          :multiple="multiple"
          class="margin-right"
          v-bind:value="value"
          :style="selectStyle"
          :placeholder="placeholder"
        >
          <el-option
            class="input"
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="otherValue" v-if="showOtherInput()"></el-input>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    placeholder: {
      type: String,
      default: "Select"
    },
    options: {
      type: Array,
      default: []
    },
    direction: {
      type: String,
      default: "row"
    },
    showOtherInput: {
      type: Function,
      default: function() {
        return false;
      }
    },
    titleStyle: {
      type: Object,
      default: function() {
        return {};
      },
      required: false
    },
    selectStyle: {
      type: Object,
      default: function() {
        return {};
      },
      required: false
    },
    multiple: {
      type: Boolean,
      default: false,
      required: false
    },
    value:{
        type: [Array, String]
    }
  },
  data() {
    return {
      otherValue: null
    };
  },
  model: {
    prop: "value",
    event: "update"
  },
  methods: {
    handleOnChange(value) {
      this.$emit("update", value)
    }
  }
};
</script>
<style lang="sass" scoped>
@import '../css/main.css'
.el-input__inner
    background-color: #e5e5e5
.el-input__inner::-webkit-input-placeholder
    color: #555
    font-size: 16px
.margin-right
    margin-right: 32px
.select-label
    float: left
.select-suffix
    float: right
    color: #8492a6
    font-size: 13px
.red
    color: red
.green
    color: green
.validation-text
    color: red
    font-size: 20px
.name
    color: #555
    font-size: 28px
    font-weight: 700
.margin-bottom
    margin-bottom: 8px
.select-row
    display: flex
    justify-content: flex-start
    align-items: center
</style>