<template>
  <div>
    <v-textarea
      v-model="companyComment"
      dense
      hide-details
      outlined
      rows="1"
      class="text-caption"
      @input="handleChangeComment"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    company: { type: Object, default: null }
  },
  data () {
    return {
      companyComment: ''
    }
  },
  methods: {
    ...mapActions({
      updatePartialCompanyData: 'licitacion/updatePartialCompanyData'
    }),
    handleChangeComment () {
      const companyId = this.company.id
      const data = {
        comment: this.companyComment
      }

      this.updatePartialCompanyData({ companyId, data })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
