<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { reactive } from 'vue'


import microApps from './microApps'

const subAppState = reactive({
  current: '/sub-vue-vite'
})

const goto = (item: any) => {
  history.pushState(null, item.activeRule, item.activeRule)
  subAppState.current = item.activeRule
}
</script>

<template>
  <div class="main-app-container">
    <header class="header">
      <div class="logo-container">
      </div>
      <img alt="mo logo" class="logo" src="@/assets/mo.png" width="40" height="40" />

      <div class="sub-apps">
        <div class="sub-app-item" v-for="item in microApps" :class="{ active: item.activeRule === subAppState.current }"
          :key="item.name" @click="goto(item)">
          {{ item.name }}
        </div>
      </div>
    </header>

    <div id="layout-wrapper">
      <div id="subapp-viewport"></div>
    </div>


  </div>

  <!-- <RouterView /> -->
</template>

<style scoped lang="scss">
.main-app-container {
  width: 100%;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  max-width: 1024px;
  margin: 0 auto 1.5rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

#layout-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
}

.sub-apps {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;

  .sub-app-item {
    cursor: pointer;
  }

  .active {
    color: white;
  }
}
</style>
