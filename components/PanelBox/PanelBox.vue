<template>
  <div :class="cardPanelClass" :style="cardPanelCssVal">
    <div @mouseover="handleMouseOver" @mouseleave="handleMouseLeave" class="card-panel-icon-wrapper" :style="wrapperStyle">
      <i :class="[iconClass, icon]" :style="iconStyle"></i>
    </div>
    <div class="card-panel-description">
      <div :class="cardPanelTextClass">{{title}}</div>
      <count-to
        v-if="customWord == null"
        :start-val="0"
        :end-val="quantity"
        :duration="3000"
        :class="cardPanelNumClass"
      />
      <p v-else class="custom-word">{{customWord}}</p>
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
            default: "18em"
        },
        title: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: false
        },
        icon: {
            type: String,
            required: true
        },
        boxStyle: {
          type: String,
          required: false,
          default: "default"
        },
        customWord: {
          type: String,
          required: false,
          default: null
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
          if(this.boxStyle == "default"){
            if(this.isHover)
                return {'background-color': this.color}
            else
                return {}
          }
        },
        iconStyle(){
          if(this.boxStyle == "default"){
            if(this.isHover)
                return {'color': 'white'}
            else
                return {'color': this.color}
          }
        },
        cardPanelCssVal() {
            return {
                '--color': this.color,
                '--width': this.width,
            }
        }
    },
    data(){
        return {
            isHover: false,
            cardPanelClass: {
              'card-panel': true,
              'filled': this.boxStyle == "filled"
            },
            iconClass: {
              'card-panel-icon': true,
              'filled': this.boxStyle == "filled"
            },
            cardPanelTextClass: {
              'card-panel-text': true,
              'filled': this.boxStyle == "filled"
            },
            cardPanelNumClass: {
              'card-panel-num': true,
              'filled': this.boxStyle == "filled"
            }
        }
    }
}
</script>
<style lang="sass" scoped>
.card-panel 
  height: 108px
  width: var(--width)
  cursor: pointer
  font-size: .8rem
  position: relative
  overflow: hidden
  color: #666
  background: #fff
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05)
  border-color: rgba(0, 0, 0, .05)
  border-radius: 8px
  display: flex
  justify-content: space-around
  align-items: center
  &.filled
    background: var(--color)
  &:hover 
    .card-panel-icon-wrapper 
      color: #fff

  .card-panel-icon-wrapper 
    float: left
      // margin: 14px 0 0 14px
    padding: .8em
    transition: all 0.38s ease-out
    border-radius: 6px

  .card-panel-icon 
    float: left
    font-size: 2.5rem
    &.filled
      color: white
    
  .card-panel-description 
    float: right
    font-weight: bold
    margin: 4px
    margin-left: 0px

    .card-panel-text 
      line-height: 18px
        // color: rgba(0, 0, 0, 0.45)
      font-size: 1rem
      margin-bottom: 12px
      &.filled
        color: white

    .card-panel-num 
      font-size: 1.3rem
      &.filled
        color: white
.custom-word
  color: white
  font-size: 1.3rem
</style>