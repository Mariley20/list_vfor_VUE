<template>
  <v-container fluid>
    <div class="d-flex flex-column align-center">
      <section class="overflow-auto">
        <AppLicitacionSeccion />
        <AppPrintCompaniesSection />
      </section>
    </div>

    <section
      v-if="historico.length > 0"
      ref="DownloadCompHistorico"
      class="mt-16 pt-16"
    >
      <table
        class="mx-auto"
        border="1"
      >
        <tbody>
          <tr class="sheet-row">
            <th>#</th>
            <th>Texto breve</th>
            <th>Precio neto</th>
            <th>Precio Historico</th>
            <th class="px-3">
              Variación
            </th>
          </tr>
          <tr
            v-for="(item,index) in historico"
            :key="item.id"
            class="sheet-row"
          >
            <td>#{{ index +1 }}</td>
            <td>
              <div>
                <div>{{ item.name }}</div>
                <small>{{ item.company_name }}</small>
                <div class="font-weight-medium">
                  <small v-if="!!item.code ">{{ item.code }}</small>
                </div>
              </div>
            </td>
            <td>{{ item.price }}</td>
            <td>{{ item.last_price }}</td>
            <td>{{ item.variacion }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <v-btn
      v-if="historico.length > 0"
      color="info"
      class="mt-4"
      @click="printDownload"
    >
      Print Historico Download
    </v-btn>
  </v-container>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'AboutView',
  components: {
    AppLicitacionSeccion: () => import('@/components/AppLicitacionSeccion.vue'),
    AppPrintCompaniesSection: () => import('@/components/AppPrintCompaniesSection.vue')
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      historico: (state) => state.licitacion.historico
    })
  },
  methods: {
    printDownload () {
      const w = window.open()
      w.document.write(this.$refs.DownloadCompHistorico.innerHTML)
      w.document.close()
      w.setTimeout(function () {
        w.print()
      }, 1000)
    }
  }
}

</script>
<style lang="scss" scoped>
.sheet-table, table {
  border: 1px solid black;
  border-collapse: collapse;
}
.sheet-row td, th {
  border: 1px solid rgb(228, 228, 228);
  padding: 2px 8px;
}
</style>
