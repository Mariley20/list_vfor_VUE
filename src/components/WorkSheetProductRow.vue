<template>
  <tr class="sheet-row">
    <template v-for="(col, i) in rowData">
      <td
        v-if="!col.hide"
        :key="i"
        :style="{
          'background-color': col.background,
        }"
      >
        {{ col.value }}
      </td>
    </template>
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
  min-width: 70px;
  font-size: 10px;
  padding: 2px 8px;
}
</style>
