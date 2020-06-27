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
        url: {
            type: String,
            required: true
        },
        successCallback: {
            type: Function,
            required: false,
            default: function (res) {

            }
        },
        errorCallback: {
            type: Function,
            required: false,
            default: function (res) {

            }
        },
        isBeforeUploadValid: {
            type: Function,
            required: false,
            default: () => {
                return true
            }
        }
    },
    methods: {
        handleImport(evt) {
            document.getElementById("my_file").click();
        },
        handleFileUpload() {         
            if (this.isBeforeUploadValid(this.$refs.file.files[0])) {
                Request.uploadFile(this.$refs.file.files[0], this.url, res => {
                    this.successCallback(res)
                }, error => {
                    this.errorCallback(error)
                });
            }else{
                 this.errorCallback("Upload not valid")
            }
            document.getElementById("my_file").value = null;
        },
    }
};
</script>

<style lang="sass" scoped>
.file-upload-input
    position: absolute
    visibility: hidden
.base-upload-button
    display: inline-flex
</style>
