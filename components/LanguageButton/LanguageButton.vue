<template>
<el-dropdown trigger="click" @command="handleSetLanguage">
    <i class="icon-language"  :style="{'color': color}"/>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
        <el-dropdown-item :disabled="language==='zh'" command="zh">繁體中文</el-dropdown-item>
        <el-dropdown-item :disabled="language==='cn'" command="cn">簡體中文</el-dropdown-item>
    </el-dropdown-menu>
</el-dropdown>
</template>

<script>
export default {
    props: {
        color: {
            type: String,
            required: false
        }
    },
    computed: {
        language() {
            return this.$store.state.locale
        }
    },
methods: {
        handleSetLanguage(lang) {
            this.$i18n.locale = lang
            this.$store.dispatch('setLocale', lang)
            this.$router.push({
                path: "/" + lang + "/" + this.$router.history.current.path.split("/").filter((f,index) => index > 1 ).join("/"),
                query: this.$router.history.current.query
            })
            location.reload()
        }
    }
}
</script>

<style lang="sass" scoped>
i 
    font-size: 1.5rem
    cursor: pointer 
    color: white
</style>
