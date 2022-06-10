<template>
  <v-dialog v-model="visible" :width="width" :fullscreen="fullscreen" :persistent="persistent" :retain-focus="false" no-click-animation>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <slot></slot>
      <v-card-actions>
        <slot name="actionSlot"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="js">
import Vue from "vue";
export default{
    props: {
        visible: {
            type: Boolean,
            required: true,
            default: false,
        },
        title: {
            type: String,
            required: false,
            default: ""
        },
        width: {
            type: String,
            required: false,
            default: "50%"
        },
        icon: {
            type: String,
            required: false,
            default: null
        },
        width: {
            type: String,
            required: false,
            default: "700"
        },
        fullscreen: {
            type: Boolean,
            required: false,
            default: false
        },
        persistent: {
          type: Boolean,
          required: false,
          default: true
        }
    },
    methods: {
        handleClose(){
            this.$emit("update:visible", false)
            this.$emit("close")
        },
    },
}
</script>
<style lang="sass" scoped>
</style>