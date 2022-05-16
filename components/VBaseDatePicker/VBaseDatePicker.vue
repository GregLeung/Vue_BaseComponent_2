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
      @change="handleChange"
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
            required: true,
            default: null
        },
        range: {
            type: Boolean,
            required: true,
            default: false
        },
        type: {
            type: String,
            required: false,
            default: "date"
        }
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
        }
    },
    data(){
        return {
            menu1: false,
        }
    }
}
</script>
<style lang="sass" scoped>
</style>