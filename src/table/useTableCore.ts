// src/table/useTableCore.ts
import { computed, reactive, ref } from 'vue'
import type { Row, TableSchema, SortDir, ColumnDef } from './table.types'

export function useTableCore(allRows: () => Row[], schema: () => TableSchema) {
  const sortBy = ref<string | null>(null)
  const sortDir = ref<SortDir>(null)
  const page = ref(1)
  const pageSize = ref(schema().pageSize ?? 20)
  const search = ref('') // simple global search; you can expand per-column filters later
  const columnVisibility = reactive<Record<string, boolean>>({})

  // initialize visibility from schema
  for (const c of schema().columns) {
    columnVisibility[c.key] = c.visible ?? true
  }

  const visibleColumns = computed<ColumnDef[]>(() =>
    schema().columns.filter(c => columnVisibility[c.key] !== false)
  )

  const filtered = computed<Row[]>(() => {
    const rows = allRows()
    if (!search.value.trim()) return rows
    const q = search.value.toLowerCase()
    // naive contains across visible columns
    return rows.filter(r => {
      for (const col of visibleColumns.value) {
        const v = r[col.key]
        if (v != null && String(v).toLowerCase().includes(q)) return true
      }
      return false
    })
  })

  const sorted = computed<Row[]>(() => {
    if (!sortBy.value || !sortDir.value) return filtered.value
    const col = schema().columns.find(c => c.key === sortBy.value)
    if (!col) return filtered.value
    const base = [...filtered.value]
    const dir = sortDir.value === 'asc' ? 1 : -1
    const sorter = col.sortable
    if (typeof sorter === 'function') {
      base.sort((a, b) => dir * sorter(a, b))
    } else {
      base.sort((a, b) => {
        const av = a[sortBy.value!]
        const bv = b[sortBy.value!]
        if (av == null && bv == null) return 0
        if (av == null) return -1 * dir
        if (bv == null) return 1 * dir
        return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir
      })
    }
    return base
  })

  const total = computed(() => sorted.value.length)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const pageRows = computed<Row[]>(() => {
    const start = (page.value - 1) * pageSize.value
    return sorted.value.slice(start, start + pageSize.value)
  })

  const setSort = (key: string) => {
    if (sortBy.value !== key) {
      sortBy.value = key
      sortDir.value = 'asc'
    } else {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : sortDir.value === 'desc' ? null : 'asc'
      if (!sortDir.value) sortBy.value = null
    }
    page.value = 1
  }

  const toggleColumn = (key: string) => {
    columnVisibility[key] = !columnVisibility[key]
  }

  return {
    // state
    sortBy, sortDir, page, pageSize, search, columnVisibility,
    // derived
    visibleColumns, pageRows, pageCount, total,
    // actions
    setSort, toggleColumn
  }
}
