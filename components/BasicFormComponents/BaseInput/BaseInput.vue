<template>
  <div>
    <div :class="{'form-row': direction == 'row'}">
      <div class="name input-title" :style="titleStyle">{{title}}</div>
      <div class="value">
        <div class="input-group">
          <input  @input="change(value)" v-model="value" class="input--style-5" type="text" name="name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    validateMessage:String,
    direction: {
      type: String,
      default: "row"
    },
    change: {
      type: Function,
      default: text => {}
    },
    titleStyle: {
      type: Object,
      default: {}
    }
  },
  data: () => {
    return {
      value: ""
    };
  }
};
</script>
<style scoped lang="sass">
@import '../css/main.css'
.validation-text
    padding-left: 125px
    color: red
    font-size: 24px
.name
  color: #555
  font-size: 28px
  font-weight: 700
</style>
