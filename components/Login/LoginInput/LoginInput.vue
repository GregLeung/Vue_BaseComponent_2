<template>
    <input v-bind:value="value" @input="handleOnChange" class="un" :type="type" align="center" :placeholder="placeholder" />
</template>
<script lang="js">
export default{
    props: {
        placeholder: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "text"
        },
        value: {
            type: String
        },
    },
    model:{
        prop: "value",
        event: "update"
    },
    methods:{
        handleOnChange(event){
            this.$emit("update", event.target.value)
        }
    }
}
</script>

<style scoped lang="sass">
.un 
  width: 100%
  color: rgb(38, 50, 56)
  font-weight: 700
  font-size: .8rem
  letter-spacing: 1px
  background: rgba(136, 126, 126, 0.04)
  padding: .5rem 1rem
  border: none
  border-radius: 20px
  outline: none
  box-sizing: border-box
  border: 2px solid rgba(0, 0, 0, 0.02)
  text-align: center
  font-family: "Ubuntu", sans-serif
.un:focus
    border: 2px solid rgba(0, 0, 0, 0.18) !important
</style>