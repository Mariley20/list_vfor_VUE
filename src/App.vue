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
      <v-spacer />

      <v-btn
        fab
        icon
        @click="handleClose"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
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
  }),
  methods: {
    handleClose () {
      window.location.reload()
    }
  }
}
</script>
