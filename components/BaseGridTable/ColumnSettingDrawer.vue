<template>
  <el-drawer
    title="Column Settings"
    :visible="visible"
    size="90%"
    direction="btt"
    @close="handleClose"
  >
  <div class="row space-between-row">
    <div></div>
    <el-button type="primary" class="save-button" @click="handleSave">Save</el-button>
  </div>
    <half-row>
      <div slot="first" class="column">
        <p>Used Column</p>
        <draggable
          :list="columnList"
          v-bind="dragOptions"
          group="people"
          :disabled="!enabled"
          @start="dragging = true"
          @end="dragging = false"
          class="draggable"
        >
          <div v-for="element in columnList" :key="element.name">
            <el-card>
              <p>{{ element.label }}</p>
            </el-card>
          </div>
        </draggable>
      </div>
      <div slot="second" class="column">
        <p>Unused Column</p>
        <draggable
          :list="unusedList"
          v-bind="dragOptions"
          group="people"
          :disabled="!enabled"
          @start="dragging = true"
          @end="dragging = false"
          class="draggable"
        >
          <div v-for="element in unusedList" :key="element.name">
            <el-card>
              <p>{{ element.label }}</p>
            </el-card>
          </div>
        </draggable>
      </div>
    </half-row>
  </el-drawer>
</template>

<script lang="js">
import Vue from "vue";
import draggable from 'vuedraggable'
export default {
    components: {
        draggable
    },
    watch:{
      visible(val, oldVal){
        if(val)
          this.filterUnusedList()
      },
    },
    mounted(){
      this.filterUnusedList()
    },
    props: {
        visible: {
            type: Boolean,
            required: true,
            default: false
        },
        columnList: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        originalColumnList: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        },
    },
    methods: {
        handleClose(){
            this.$emit('update:visible', false)
        },
        filterUnusedList(){
            var labelList = this.columnList.map(f => f.label);
            var result = [];
            this.unusedList.forEach(f => {
                var index = labelList.indexOf(f.label)
                if(index == -1)
                    result.push(f)
            });
            this.unusedList = result.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
        },
        handleSave(){
          this.successPrompt()
          this.$emit("confirm", this.columnList)
          this.handleClose()
        }
    },
    data(){
        return {
            enabled: true,
            dragging: false,
            unusedList: []
        }
    }
}
</script>

<style lang="sass" scoped>
.column
    display: flex
    flex-direction: column
    align-items: center
    .draggable
        width: 100%
::v-deep .el-card__body
    padding: 0px
    padding-left: .5em
    padding-right: .5em
.save-button
  margin-right: 2em
</style>
