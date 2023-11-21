<template>
  <div
    v-if="!!licitacion"
    class="caption"
  >
    <div class="licitacion-grid">
      <b class="px-3">Número de la licitación :</b>
      <div>{{ licitacion.numero_de_la_licitacion }}</div>
    </div>
    <div class="licitacion-grid">
      <b class="px-3">Nombre de la licitación :</b>
      <div>{{ licitacion.nombre_de_la_licitacion }}</div>
    </div>
    <div class="licitacion-grid">
      <b class="px-3">Responsable de la licitación :</b>
      <div>{{ licitacion.responsable_de_la_licitacion }}</div>
    </div>
    <div class="licitacion-grid">
      <b class="px-3">Versión licitación :</b>
      <div>{{ licitacion.version_licitación }}</div>
    </div>
    <div class="licitacion-grid">
      <b class="px-3">Moneda :</b>
      <div>{{ licitacion.moneda }}</div>
    </div>
    <div class="licitacion-grid">
      <b class="px-3">Plazo para presentación de la oferta :</b>
      <div>{{ licitacion.plazo_para_presentacion_de_la_oferta }}</div>
    </div>
    <div class="licitacion-grid">
      <b class="px-3">Fecha de descarga :</b>
      <div>{{ licitacion.fecha_de_descarga }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      licitacion: (state) => state.licitacion.licitacion
    })
  }
}
</script>

<style lang="scss" scoped>
.licitacion-grid {
  display: grid;
  grid-template-columns: minmax(150px, 210px) auto;
  align-items: center;
  max-width: 400px;
  border-bottom: thin solid #ddd;
}
</style>
