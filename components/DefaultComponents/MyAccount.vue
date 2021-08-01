<template>
  <c-m-s-form :title="$t('Staff')" class="ml-24 mr-24 mt-12" v-if="isMounted">
    <div class="p-12">
      <c-m-s-form-input
        class="mt-12"
        :label-width="cms_label_width"
        v-model="data.name"
        :label="$t('User Name')"
      />
      <c-m-s-form-input
        :label-width="cms_label_width"
        class="mt-12"
        v-model="data.loginName"
        :label="$t('Login Name')"
      />
      <el-divider></el-divider>
      <div class="space-between-row">
        <div>
          <el-button
            type="info"
            icon="el-icon-lock"
            @click="goChangePassword"
            >{{ $t("Change Password") }}</el-button
          >
        </div>
        <el-button type="primary" @click="handleSubmit">{{
          $t("Confirm")
        }}</el-button>
      </div>
    </div>
  </c-m-s-form>
</template>

<script lang="js">
import Vue from "vue";
import sha256 from "js-sha256"
import {
    Request,
} from "vue_basecomponent";
export default {
    data() {
        return {
            cms_label_width: '7em',
            data: {
                userName: null,
                password: null,
            },
            isMounted: false,
        }
    },
    async mounted() {
        var res = await Request.getAsync(this, "get_self")
        this.data = res.data
        this.isMounted = true
    },
    methods: {
        handleSubmit() {
            if(confirm(this.$t('Confirm To Save?'))){
                if (this.checkValidate([{
                            value: this.data.loginName,
                            rules: [{
                                type: "REQUIRED",
                                message: this.$t('Login Name') + " " + this.$t("Cannot Be Empty")
                            }]
                        },
                        {
                            value: this.data.userName,
                            rules: [{
                                type: "REQUIRED",
                                message: this.$t('User Name') + " " + this.$t("Cannot Be Empty")
                            }]
                        },
                    ])) {
                        this.handleUpdate()
                }
            }
        },
        handleUpdate() {
            Request.post(this, "update_self", this.data, res => {
                this.successPrompt()
            })
        },
        goChangePassword() {
            this.$router.push({
                path: "/changePassword",
            });
        }
    }
}
</script>

<style lang="sass" scoped>
</style>
