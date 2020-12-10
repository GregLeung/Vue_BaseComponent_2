<template>
  <div
    class="container"
    :style="{ width: width, height: height }"
    @touchend="(event) => this.$emit('drawEnd', event)"
    @mouseleave="(event) => this.$emit('drawEnd', event)"
    @mouseup="(event) => this.$emit('drawEnd', event)"
  >
    <button class="button" type="button" @click="clearSignature"></button>
    <VueSignaturePad
      ref="signature_pad"
      :width="width"
      :height="height"
      :options="{
        onBegin: () => {
          $refs.signature_pad.resizeCanvas();
        },
      }"
    />
  </div>
</template>

<script lang="js">
import Vue from "vue";
import VueSignaturePad from "./VueSignaturePad/VueSignaturePad"
export default {
    components: {
        VueSignaturePad
    },
    props: {
        width: {
            type: String,
            required: true
        },
        height: {
            type: String,
            required: true
        }
    },
    methods: {
        getSignatureData(){
            return this.isEmpty() ? null : this.dataURLtoFile(this.$refs.signature_pad.saveSignature().data, "signature.png")
        },
        resizeCanvas(){            
            this.$refs.signature_pad.resizeCanvas()
        },
        downloadSignature(fileName) {
            var {
                isEmpty,
                data
            } = this.$refs.signature_pad.saveSignature()
            var a = document.createElement("a");
            a.href = data;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        },
        clearSignature(){
            this.$refs.signature_pad.clearSignature()
        },
        isEmpty(){
            return this.$refs.signature_pad.isEmpty()
        },
        dataURLtoFile(dataurl, filename) {
            if(dataurl.split(':')[1] != ","){
                var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, {
                    type: mime
                });
            }
        },
    }
}
</script>

<style lang="sass" scoped>
.container
    border: double 3px black
    border-radius: 5px
    background-origin: border-box
    background-clip: content-box, border-box
    .button
        display: inline-block
        text-align: center
        vertical-align: middle
        padding: 0px .3em
        border: 1px solid #000000
        border-radius: 100px
        background: #fffdfc
        background: -webkit-gradient(linear, left top, left bottom, from(#fffdfc), to(#fffdfc))
        background: -moz-linear-gradient(top, #fffdfc, #fffdfc)
        background: linear-gradient(to bottom, #fffdfc, #fffdfc)
        font: normal normal normal 1rem arial
        color: #ffffff
        text-decoration: none
        margin-left: .2em
        margin-top: .2em
        position: absolute
    .button:before
        content: "\0000a0"
        display: inline-block
        height: .6em
        width: .6em
        line-height: .6em
        position: relative
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAd0lEQVQYlXXOwQkCMRAF0KcHK9hDsDFrtIDFEjyJB9nDsi1YgSzqZQKziQ6EkJ8H83e44IATnrYz4IwXPPCJe2hQ/nPEEsGEEmeKbAmj4jnhiuaMfuEO7RN8Y03vNbLNtJ3azh2q69rOBW5/imd8hzFw0U/BFeMXwJIwTwrXKdAAAAAASUVORK5CYII=") no-repeat left center transparent
        background-size: 100% 100%
</style>
