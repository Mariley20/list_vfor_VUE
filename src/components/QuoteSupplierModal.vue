<template>
  <v-dialog
    v-model="showModal"
    width="500"
  >
    <v-card>
      <v-app-bar
        color="primary"
        dark
        flat
        tile
        :height="40"
      >
        <v-toolbar-title>
          Editar contenido
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          @click="showModal = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="pa-0 fill-height">
        <!-- <v-container
          fluid
        >
          <v-text-field
            v-model.number="itemValue"
            height="32"
            dense
            hide-details="auto"
            outlined
            suffix="%"
          />
        </v-container> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          height="32"
          color="primary"
        >
          Guardar
          <v-icon left>
            mdi-content-save
          </v-icon>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, default: false }
  },
  data () {
    return {
    }
  },
  computed: {
    showModal: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  created () {
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>

</style>
