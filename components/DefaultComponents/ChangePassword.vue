<template>
<c-m-s-form :title="$t('Change Password')" class="ml-24 mr-24 mt-12" >
    <el-card>
        <c-m-s-form-input v-model="password.oldPassword" show-password :label="$t('Old Password')" :label-width="cms_label_width"/>
        <c-m-s-form-input v-model="password.newPassword" show-password class="mt-12" :label="$t('New Password')" :label-width="cms_label_width"/>
        <c-m-s-form-input v-model="password.confirmNewPassword" show-password class="mt-12" :label="$t('Confirm Password')" :label-width="cms_label_width"/>
        <el-divider></el-divider>
        <div class="space-between-row">
            <div></div>
            <el-button type="primary" @click="handleChangePassword">{{$t('Confirm' + ' ' + 'Change Password')}}</el-button>
        </div>
    </el-card>
</c-m-s-form>
</template>

<script lang="js">
import Vue from "vue";
import sha256 from "js-sha256"
import {
    HalfRow,
    CMSFormInput,
    CMSForm,
    CMSSelector,
    Request
} from "vue_basecomponent";
export default {
    layout: "CMSLayout",
    components: {
        CMSFormInput,
        HalfRow,
        CMSForm,
        CMSSelector
    },
    data() {
        return {
            data: [],
            cms_label_width: '12em',
            password:{
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            },
        }
    },
    mounted() {
        Request.get(this, "get_self", {}, res => {
            this.data = res.data
        })
        
    },
    methods: {
        handleHash(){
            var data = Object.assign({}, this.oldPassword)
            data.oldPassword = this.hashPassword(this.oldPassword)
            this.oldPassword = data.oldPassword
        },
        handleChangePassword(){
            if(confirm(this.$t('Confirm To Change The Password?'))){
                if(this.checkValidate([
                    {
                        value: this.password.oldPassword,
                        rules: [{
                            type: "REQUIRED",
                            message: this.$t('Old Password') + ' ' + this.$t('is required') + '!'
                        }]
                    },
                    {
                        value: this.password.newPassword,
                        rules: [{
                            type: "REQUIRED",
                            message: this.$t('New Password') + ' ' + this.$t('is required') + '!'
                        }]
                    },
                    {
                        value: this.password.confirmNewPassword,
                        rules: [{
                            type: "REQUIRED",
                            message: this.$t('Confirm Password') + ' ' + this.$t('is required') + '!'
                        }]
                    },
                ])){
                    var tmpOldPassword = this.hashPassword(this.password.oldPassword)
                    var tmpNewPassword = this.hashPassword(this.password.newPassword)
                    var tmpConfirmNewPassword = this.hashPassword(this.password.confirmNewPassword)
                    if(tmpOldPassword == this.data.password){
                        if(tmpNewPassword == tmpConfirmNewPassword){
                            if(tmpOldPassword != tmpNewPassword){
                                this.data.password = tmpNewPassword
                                Request.post(
                                    this,
                                    "update_self",
                                    this.data,
                                    res => {
                                        this.successPrompt()
                                    }
                                )
                            }else{
                                this.prompt(this.$t("New Password should be different to Old Password"))
                            }
                        }else{
                            this.prompt(this.$t("Error"), this.$t("Confirm Password") + ' ' + this.$t('is not match'))
                        }
                    }else{
                        this.prompt(this.$t("Error"), this.$t("Old Password") + ' ' + this.$t('is not correct'))
                    }
                }
            }
        }
        
    }
}
</script>

<style lang="sass" scoped>
</style>
