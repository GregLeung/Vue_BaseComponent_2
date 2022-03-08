<template>
<div>
    <el-upload 
        :http-request="handleUploadPicture" 
        action="#" 
        :on-change="handleUpload" 
        list-type="picture-card"
        :file-list="fileList" 
        :on-success="handleSuccess" 
        :on-remove="handleRemove" 
        :on-preview="handlePictureCardPreview" 
        :on-exceed="handleExceed" 
        :limit="limit" 
        :class="{hide:hideUpload || processing}"
    >
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
            <img :src="file.url" alt="" style="object-fit:cover;height:150px;width:150px">
            <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                    <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete"></i>
                </span>
            </span>
        </div>
    </el-upload>
    <div class="el-upload__tip" slot="tip" style="float:right">File Type : .jpg, .jpeg, .png </div>
    <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
</template>

<script>
import Vue from "vue";
import {Util, Request} from "vue_basecomponent";
export default {
    components: {
        Util,
        Request
    },
    props: {
        photoPath: {
            type: Array,
            required: true
        },
        limit: {
            type: Number,
            required: false,
            default: 3
        },
    },
    computed: {
        hideUpload(){
            if(this.fileList.length >= this.limit)
                return true; 
            else
                return false;
        }
    },
    methods: {
        handleUploadPicture(){
            Request.uploadFile(
                this,
                "upload_file",
                this.selectedFile.raw,
                2,
                ["image/png", "image/jpg", "image/jpeg"],
                res => {
                    if(res.code == 200){
                        this.handleSuccess(res, this.selectedFile, this.fileList)
                        this.$emit("success")
                    }
                }
            )
            
        },
        handleUpload(file, fileList) {
            this.processing = true
            this.selectedFile = file
        },
        handleSuccess(response, file, fileList) {
            var url = this.$store.state.baseUrlStatic + "img/" +  response.data
            this.fileList.push(file)
            this.photoPath.push(url);
            this.processing = false
            console.log(this.fileList);
        },
        handleRemove(file, fileList) {
            this.processing = true
            var index = this.fileList.indexOf(file)
            this.fileList.splice(index, 1);
            this.photoPath.splice(index, 1);
            if(this.fileList.length > 0)
                setTimeout(() => this.processing = false, 650); // Maybe can do better
            else
                this.processing = false
            this.$emit("remove")
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleExceed(files, fileList) {
            this.$message.warning('You are not allowed upload more than ' + this.limit + ' files');
        },
        async convertURLToFile(url){
            try{
                console.log(url);
                let response = await fetch(url);
                let data = await response.blob();
                let metadata = {
                    type: 'image/jpg'
                };
                return new File([data], "test.jpg", metadata);
            }catch(error){
                console.log(error);
            }
        }
    },
    mounted(){
         this.fileList = this.photoPath.map(f => {
            return {
                name: f,
                url: f
            }
        })
    },
    data(){
        return{
            dialogVisible: false,
            dialogImageUrl: '',
            processing: false,
            fileList: []
        }
    }
};
</script>
<style>
.hide .el-upload--picture-card {
    display: none;
}
</style>
