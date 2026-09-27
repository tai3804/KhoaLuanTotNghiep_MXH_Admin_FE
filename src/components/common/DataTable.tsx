import React from 'react'
import { Loader2, Inbox } from 'lucide-react'

export interface Column<T> {
  header: string | React.ReactNode
  accessorKey?: keyof T
  cell?: (row: T, index?: number) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  highlightId?: string | number
  getRowClassName?: (row: T) => string
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'Không có dữ liệu hiển thị',
  onRowClick,
  highlightId,
  getRowClassName,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden border border-[#e4e6eb] dark:border-[#393a3b] rounded-2xl bg-white dark:bg-[#242526] shadow-xs">
      <div className="overflow-x-auto min-h-[140px]">
        <table className="w-full text-left text-sm text-slate-600 dark:text-[#e4e6eb]">
          <thead className="bg-slate-50 dark:bg-[#18191a]/80 text-xs uppercase font-semibold text-slate-500 dark:text-[#b0b3b8] border-b border-[#e4e6eb] dark:border-[#393a3b]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[#393a3b]">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                      <div
                        className={`h-4 bg-slate-200/80 dark:bg-[#3a3b3c]/80 rounded-md ${
                          cIdx === 0
                            ? 'w-36'
                            : cIdx === columns.length - 1
                            ? 'w-16 ml-auto'
                            : 'w-24'
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-400 dark:text-[#b0b3b8]"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const isHighlighted =
                  highlightId !== undefined &&
                  highlightId !== null &&
                  String(row.id) === String(highlightId)

                return (
                  <tr
                    key={row.id || rowIdx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-all duration-500 ${
                      isHighlighted
                        ? 'bg-blue-100/90 dark:bg-[#1877f2]/25 ring-2 ring-inset ring-[#1877f2] font-medium'
                        : 'hover:bg-slate-50/80 dark:hover:bg-[#3a3b3c]/50'
                    } ${onRowClick ? 'cursor-pointer' : ''} ${
                      getRowClassName ? getRowClassName(row) : ''
                    }`}
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}
                      >
                        {col.cell
                          ? col.cell(row, rowIdx)
                          : col.accessorKey
                          ? String(row[col.accessorKey] ?? '')
                          : null}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
