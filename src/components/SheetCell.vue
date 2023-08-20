<template>
  <td>
    {{ text }}
  </td>
</template>

<script>
import getColumnName from '@/helpers/getColumnName.js'

export default {
  props: {
    text: { type: [Number, String], default: '' }
  },
  computed: {
    value () {
      return getColumnName(this.columnIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-item {
  min-width: 80px;
  min-height: 22px;
  border: 1px solid #eee;
}
</style>
