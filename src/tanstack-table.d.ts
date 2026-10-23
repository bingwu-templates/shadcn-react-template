import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // oxlint-disable-next-line no-unused-vars
  interface ColumnMeta<TData, TValue> {
    label?: string
    className?: string // apply to both th and td
    tdClassName?: string
    thClassName?: string
  }
}
