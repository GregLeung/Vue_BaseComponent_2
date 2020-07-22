<template>
  <el-row>
    <el-col :span="12">
      <div class="padding">
        <slot name="first"></slot>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="padding">
        <slot name="second"></slot>
      </div>
    </el-col>
  </el-row>
</template>
<script>
</script>
<style scoped lang="sass">
.padding
    padding-right: 8px
</style>