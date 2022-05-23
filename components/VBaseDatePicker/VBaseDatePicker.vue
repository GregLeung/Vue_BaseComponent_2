<template>
  <v-menu
    ref="menu1"
    v-model="menu1"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="formattedDateText"
        :label="label"
        prepend-icon="mdi-calendar"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="value"
      :range="range"
      :type="type"
      no-title
      :min="min"
      :max="max"
      @input="handleChange"
    ></v-date-picker>
  </v-menu>
</template>
<script lang="js">
import Vue from "vue";
export default{
    props: {
        value: {
            required: true,
            default: null
        },
        label: {
            type: String,
            required: false,
            default: null
        },
        range: {
            type: Boolean,
            required: false,
            default: false
        },
        type: {
            type: String,
            required: false,
            default: "date"
        },
        min: {
            type: String,
            required: false,
            default: null
        },
        max: {
            type: String,
            required: false,
            default: null
        },
    },
    model: {
        prop: "value",
        event: "update"
    },
    computed: {
        formattedDateText(){
            if(Array.isArray(this.value))
                return this.value.join(' ~ ')
            return this.value
        }
    },
    methods: {
        handleChange(value){
            this.$emit('change', value)
            this.$emit('update',value)
        }
    },
    data(){
        return {
            menu1: false,
            // localValue: null
        }
    }
}
</script>
<style lang="sass" scoped>
</style>