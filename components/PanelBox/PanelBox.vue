<template>
  <div class="card-panel" :style="{'width': width}">
    <div @mouseover="handleMouseOver" @mouseleave="handleMouseLeave" class="card-panel-icon-wrapper" :style="wrapperStyle">
      <i :class="['card-panel-icon', icon]" :style="iconStyle"></i>
    </div>
    <div class="card-panel-description">
      <div class="card-panel-text">{{title}}</div>
      <count-to
        :start-val="0"
        :end-val="quantity"
        :duration="3000"
        class="card-panel-num"
      />
    </div>
  </div>
</template>
<script lang="js">
import Vue from "vue";
import countTo from 'vue-count-to';
export default{
    components: { countTo },
    props: {
        color: {
            type: String,
            required: false,
            default: "#36a3f7"
        },
        width: {
            type: String,
            required: false,
            default: "20em"
        },
        title: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        },
        icon: {
            type: String,
            required: true
        }
    },
    methods:{
        handleMouseOver(){
            this.isHover = true
        },
        handleMouseLeave(){
            this.isHover = false
        }
    },
    computed: {
        wrapperStyle(){
            if(this.isHover)
                return {'background-color': this.color}
            else
                return {}
        },
        iconStyle(){
            if(this.isHover)
                return {'color': 'white'}
            else
                return {'color': this.color}
        }
    },
    data(){
        return {
            isHover: false
        }
    }
}
</script>
<style lang="sass" scoped>
  .card-panel 
    height: 108px
    cursor: pointer
    font-size: 12px
    position: relative
    overflow: hidden
    color: #666
    background: #fff
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05)
    border-color: rgba(0, 0, 0, .05)
    border-radius: 8px

    &:hover 
      .card-panel-icon-wrapper 
        color: #fff

    .card-panel-icon-wrapper 
      float: left
      margin: 14px 0 0 14px
      padding: 16px
      transition: all 0.38s ease-out
      border-radius: 6px

    .card-panel-icon 
      float: left
      font-size: 48px
    
    .card-panel-description 
      float: right
      font-weight: bold
      margin: 26px
      margin-left: 0px

      .card-panel-text 
        line-height: 18px
        color: rgba(0, 0, 0, 0.45)
        font-size: 16px
        margin-bottom: 12px

      .card-panel-num 
        font-size: 20px
</style>