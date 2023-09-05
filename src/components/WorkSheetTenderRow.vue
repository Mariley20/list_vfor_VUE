<template>
  <tr class="sheet-row">
    <td
      v-for="(col, i) in rowData"
      :key="i"
    >
      {{ col.value }}
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    rowData: { type: Array, default: () => [] }
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
