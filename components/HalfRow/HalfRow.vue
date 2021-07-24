<template>
  <el-row :class="[
      isAlignCenter ? 'row align-items-center' : '',
    ]">
    <el-col :span="12">
      <div class="pr-8">
        <slot name="first"></slot>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="pr-8">
        <slot name="second"></slot>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    isAlignCenter: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: {
    classList: ["row", "align-items-center"]
  }
}
</script>
<style scoped lang="sass">
@import "vue_basecomponent/static/main.sass"

</style>