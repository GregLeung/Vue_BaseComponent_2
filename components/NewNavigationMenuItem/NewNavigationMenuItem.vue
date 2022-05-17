<template>
  <v-list-group
    v-if="
      isAuth &&
      menuItem != null &&
      menuItem.hasOwnProperty('children') &&
      Array.isArray(menuItem['children'])
    "
    :index="menuItem['name']"
    prepend-icon="mdi-ticket"
  >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>{{ menuItem["name"] }}</v-list-item-title>
      </v-list-item-content>
    </template>
    <div v-for="(child, index) in menuItem['children']" v-bind:key="index" class="ml-4">
      <new-navigation-menu-item
        v-if="child.hasOwnProperty('children')"
        :menuItem="child"
      ></new-navigation-menu-item>
      <v-list-item
        @click="handleGoPath(child.path)"
        v-else-if="!child.hasOwnProperty('auth') || child['auth']"
        link
      >
        <v-list-item-icon>
          <v-icon>{{child.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ child.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-list-group>
  <v-list-item v-else-if="isAuth && menuItem != null" link @click="handleGoPath(menuItem.path)">
    <v-list-item-icon>
      <v-icon>{{menuItem.icon}}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ menuItem.name }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>
<script lang="js">
import Vue from "vue";
import NewNavigationMenuItem from "vue_basecomponent"
export default{
    props: {
        menuItem: {
            required: false
        },
    },
    components: {
        NewNavigationMenuItem
    },
    computed: {
        isAuth(){
            return !this.menuItem.hasOwnProperty('auth') || this.menuItem['auth']
        }
    },
    methods: {
        handleGoPath(path){
            this.$router.push({ path: '/' + this.$i18n.locale + path });
        }
    }
}
</script>
<style lang="sass" scoped>
</style>