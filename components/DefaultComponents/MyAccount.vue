<template>
  <c-m-s-form :title="$t('Staff')" class="ml-24 mr-24 mt-12" v-if="isMounted">
    <div class="p-12">
      <c-m-s-form-input
        :label-width="cms_label_width"
        class="mt-12"
        v-model="data.loginName"
        :label="$t('Login Name')"
      />
      <slot name="content" :data="data"></slot>
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
  props: {
    validateCallback: {
      type: Function,
      required: false,
      default: () => {
        return true
      }
    },
    basePath: {
      type: String,
      required: false,
      default: ""
    }
  },
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
                    ])) {
                    if(this.validateCallback(this.data))
                      this.handleUpdate()
                }
            }
        },
        handleUpdate() {
            Request.post(this, "update_self", this.data, _ => {
              Request.get(this, "get_self", {}, res => {
                this.$store.dispatch('setUser', res.data)
                this.successPrompt()
              })
            })
        },
        goChangePassword() {
            this.$router.push({
                path: this.basePath + "/changePassword",
            });
        }
    }
}
</script>

<style lang="sass" scoped>
</style>
