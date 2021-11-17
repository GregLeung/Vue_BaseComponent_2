<template>
    <div class="footer-container">
        <div class="footer-inner">
            <span>&copy; {{ new Date().getFullYear() }} Powered by Clear Future Technologies (ver 1.0.0)</span>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style scoped lang="sass">
.footer-container
    position: fixed
    left: 0
    bottom: 0
    height: 36px
    width: 100%
    background-color: black
    color: white
.footer-inner
    display: flex
    height: 36px
    padding: 0 14px
    align-items: center
    justify-content: flex-end
</style>
