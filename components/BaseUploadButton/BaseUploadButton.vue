<template>
  <div class="base-upload-button">
    <div @click="handleImport">
      <slot></slot>
    </div>
    <input class="file-upload-input" type="file" id="my_file" ref="file" @change="handleFileUpload" />
  </div>
</template>
<script lang="js">
import Vue from "vue";
import Request from "../../util/request";
export default {
    props: {
        url:{
            type: String,
            required: true
        },
        successCallback: {
            type: Function,
            required: false,
            default: function(res){
                this.$notify({
                    title: "Success",
                    message: "",
                    type: "success"
                });
            }
        },
        errorCallback: {
            type: Function,
            required: false,
            default: function(res){
                this.$notify({
                    title: "Success",
                    message: "",
                    type: "success"
                });
            }
        }
    },
    methods: {
        handleImport(evt) {
            document.getElementById("my_file").click();
        },
        handleFileUpload() {
            Request.uploadFile(this.$refs.file.files[0], this.url, res => {
                this.successCallback(res)
            }, error =>{
                this.errorCallback(error)
            });
        }
  }
};
</script>
<style scoped lang="sass">
.file-upload-input
    position: absolute
.base-upload-button
    display: inline-flex
</style>
