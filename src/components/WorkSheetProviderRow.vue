<template>
  <tr class="sheet-row">
    <td
      v-for="(col, i) in rowData"
      :key="i"
      :colspan="col.colspan"
    >
      {{ col.value }}
      <template v-if="columnIsEditable && i > 0">
        <v-btn
          fab
          width="24"
          color="primary"
          height="24"
          @click="handleEditItem(col)"
        >
          <v-icon small>
            mdi-pencil
          </v-icon>
        </v-btn>
      </template>
    </td>
  </tr>
</template>

<script>
import {
  FACTOR_LANDED
} from '@/constants/settings'
export default {
  props: {
    rowData: { type: Array, default: () => [] }
  },
  computed: {
    columnIsEditable () {
      return this.rowData[0].value === FACTOR_LANDED
    }
  },
  methods: {
    handleEditItem (item) {
      if (this.rowData[0].value === FACTOR_LANDED) {
        this.$emit('edit:factor-landed', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sheet-row td {
  border: 1px solid rgb(228, 228, 228);
  min-width: 120px;
  // white-space: nowrap;
  padding: 2px 8px;
}
</style>
