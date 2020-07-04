<template>
    <input v-model="value" class="un" :type="type" align="center" :placeholder="placeholder" />
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
        }
    },
    data(){
        return{
            value: ""
        }
    }
}
</script>

<style scoped lang="sass">
.un 
  width: 76%
  color: rgb(38, 50, 56)
  font-weight: 700
  font-size: 14px
  letter-spacing: 1px
  background: rgba(136, 126, 126, 0.04)
  padding: 10px 20px
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