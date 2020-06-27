<template>
<div>
    <video ref="video" id="video" :width="width" :height="height" autoplay muted playsinline />
    <canvas ref="canvas" id="canvas" :width="outputWidth" :height="outputHeight"></canvas>
</div>
</template>

<script lang="js">
export default {
    props:{
        width: {
            type: String,
            requried: false,
            default: "100%"
        },
        height: {
            type: String,
            requried: false,
            default: "480"
        },
        outputWidth: {
            type: String,
            requried: false,
            default: "640"
        },
        outputHeight: {
            type: String,
            requried: false,
            default: "480"
        }
    },
    mounted() {
        this.video = this.$refs.video;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: 'environment'
                }
            }).then(stream => {
                if (video.srcObject !== undefined) {
                    video.srcObject = stream;
                } else if (videoEl.mozSrcObject !== undefined) {
                    video.mozSrcObject = stream;
                } else if (window.URL.createObjectURL) {
                    video.src = window.URL.createObjectURL(stream);
                } else if (window.webkitURL) {
                    video.src = window.webkitURL.createObjectURL(stream);
                } else {
                    video.src = stream;
                }
                // video.srcObject = stream;
                this.video.play();
            });
        }
    },
    methods: {
        capture() {
            this.canvas = this.$refs.canvas;
            var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, this.outputWidth, this.outputHeight);
            console.log(canvas.toDataURL("image/png"));
            
            return canvas.toDataURL("image/png")
        }
    }
}
</script>

<style scoped lang="sass">
#canvas
  display: none
</style>
