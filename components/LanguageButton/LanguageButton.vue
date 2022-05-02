<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark text :color="color" v-bind="attrs" v-on="on">
          <v-icon>mdi-translate</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-if="$i18n.locale !== 'en'" link>
          <v-list-item-title  @click="handleClick('en')">
            English
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$i18n.locale !== 'zh'" link>
          <v-list-item-title  @click="handleClick('zh')">
            繁體中文
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$i18n.locale !== 'cn'"  link>
          <v-list-item-title @click="handleClick('cn')">
            簡體中文
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true,
      default: "primary"
    }
  },
  methods: {
    handleClick(localeCode) {
      this.$i18n.setLocale(localeCode);
      // location.reload()
    },
  },
};
</script>

<style lang="sass" scoped>
</style>
