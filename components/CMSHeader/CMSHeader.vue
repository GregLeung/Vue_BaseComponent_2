<template>
  <div class="window-container">
    <navigation-bar
      :openStyle="openStyle"
      :path="currentPath"
      title="Client Management System"
      :menu="menu"
    ></navigation-bar>
    <el-col>
      <div class="main-page" :class="classObj">
        <c-m-s-header :style="headerStyle">
          <div slot="left">
            <navigation-bar-toggle-button
              :isActive="isNavigationBarOpened"
              :toggleClick="toggleNavigationBarChange"
              class="margin-left-14"
            ></navigation-bar-toggle-button>
          </div>
          <div slot="right">
            <el-button class="text-button margin-right-14" type="text">William</el-button>
            <el-button @click="handleLogOut" class="margin-right-14">Log out</el-button>
          </div>
        </c-m-s-header>
        <div class="page">
          <transition name="slide-fade">
            <nuxt />
          </transition>
        </div>
      </div>
    </el-col>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import NavigationBar from "@/components/NavigationBar";
import NavigationBarToggleButton from "@/components/NavigationBarToggleButton/NavigationBarToggleButton";
import CMSHeader from "@/components/CMSHeader/CMSHeader";
import { BaseFooter } from "vue_basecomponent";
import variables from "@/static/variables.scss";
export default {
  components: {
    NavigationBar,
    CMSHeader,
    NavigationBarToggleButton
  },
  computed: {
    ...mapGetters(["isNavigationBarOpened"]),
    classObj() {
      return {
        hideSidebar: !this.isNavigationBarOpened
      };
    },
    headerStyle() {
      return {
        width: this.isNavigationBarOpened
          ? variables["cms-header-width"]
          : variables["cms-header-width-with-collapse-navigation-bar"]
      };
    },
    openStyle() {
      return {
        width: variables["navigation-bar-width"]
      };
    }
  },
  data() {
    return {
      currentPath: $nuxt.$route.path,
      menu: [
        {
          path: "/crm/staff",
          name: "Staff Management",
          icon: "el-icon-user"
        },
        {
          path: "/crm/client",
          name: "Client Management",
          icon: "el-icon-s-custom"
        },
        {
          name: "Event System",
          icon: "el-icon-menu",
          children: [
            {
              path: "/crm/roi",
              name: "ROI Management",
              icon: "el-icon-user"
            },
            {
              path: "/crm/booking",
              name: "Booking Management",
              icon: "el-icon-s-order",
            },
            {
              path: "/crm/event",
              name: "Events Management",
              icon: "el-icon-tickets",
            }
          ]
        }
      ]
    };
  },
  methods: {
    toggleNavigationBarChange() {
      this.$store.dispatch("toggleSideBar");
    },
    handleLogOut(){
      this.$router.push({ path: "/crm/login" });
    }
  }
};
</script>

<style scoped lang="sass">
@import "@/static/main.sass"
@import "@/static/variables.scss"

.window-container
  display: flex
  height: 100%
  width: 100%

.table-title
  font-size: 24px
.main-page
  margin-left: $navigation-bar-width
  height: 100%
  &.hideSidebar
    margin-left: 64px
  .page
    
    padding: 8px
    padding-top: 50px
    height: calc(100% - 58px)

.text-button
  color: white
</style>
