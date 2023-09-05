<template>
  <tr class="sheet-row">
    <template v-for="(col, j) in columnCount">
      <td
        v-if="rowDataHasColspans && getRowItemIsFill(rowData[j])"
        :key="`td_a_${j}`"
        :colspan="getColspan(j)"
      >
        {{ rowData[j] }}
      </td>
      <td
        v-else-if="firstItemIsnull && j === 0"
        :key="`td_a_${j}`"
      />
      <td
        v-if="!rowDataHasColspans"
        :key="`td_a_${j}`"
      >
        {{ rowData[j] }}
      </td>
    </template>
  </tr>
</template>

<script>
export default {
  props: {
    rowData: { type: Array, default: () => [] },
    worksheetRef: { type: Object, default: null }
  },
  data () {
    return {
      colspan: 'value'
    }
  },
  computed: {
    rowDataLength () {
      return this.rowData.length
    },
    firstItemIsnull () {
      return !this.rowData[0]
    },
    rowDataHasColspans () {
      const rowDataLength = this.rowData.length - 1
      if (this.rowData.every(item => !item)) return false

      return this.rowData.some((item, index) => {
        const nexItem = index < rowDataLength ? this.rowData[index + 1] : 'x'
        return (typeof item === 'string' || typeof item === 'number') && !nexItem
      })
    },
    rowDataCleaned () {
      const rowDataCleaned = this.rowData.reduce((accumulator, currentValue, index) => {
        const data = {
          val: currentValue,
          index: index
        }
        return currentValue ? [...accumulator, data] : accumulator
      }, [])
      const rowDataWithColspan = rowDataCleaned.map((item, i) => {
        const nextItem = rowDataCleaned[i + 1] ?? { index: this.columnCount + 1 }
        // if(nextItem)
        return { ...item, colspan: nextItem.index - item.index }
      })
      return rowDataWithColspan
    },
    columnCount () {
      return this.worksheetRef.cols
    }
  },
  mounted () {
  },
  methods: {
    getRowItemIsFill (itemValue) {
      return typeof itemValue === 'string' || typeof itemValue === 'number'
    },
    getColspan (itemIndex) {
      let colspanCount = 1
      let counter = itemIndex + 1
      if (!this.rowDataHasColspans) {
        return 1
      }
      if (counter === this.rowData.length) {
        return this.columnCount - (this.rowData.length - 1)
      }
      while ((this.rowData[counter] === undefined || this.rowData[counter] === null) && counter < this.rowData.length) {
        colspanCount += 1
        counter += 1
      }

      return colspanCount
    }
  }
}
</script>

<style lang="scss" scoped>
.sheet-row td {
  border: 1px solid rgb(228, 228, 228);
  min-width: auto;
  white-space: nowrap;
  padding: 2px 8px;
}
</style>
