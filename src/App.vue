<template>
  <v-app>
    <v-app-bar
      color="#d72630"
      dense
      dark
      app
      height="56"
    >
      <img
        src="@/assets/southern-logo.jpeg"
        alt=""
        height="56"
        class="mr-4"
      >

      <v-toolbar-title>Cuadro comparativo</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>
