/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import {
  useTable,
  Column,
  Row,
  TableOptions,
  useFilters,
  useSortBy,
  useRowSelect,
  usePagination,
  FilterValue,
  IdType,
  HeaderGroup,
  TableInstance,
  TableState,
  useResizeColumns,
  useFlexLayout,
} from 'react-table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu'

interface TestResult {
  id: string
  pdfView?: string
  patientName: string
  dateOfBirth: string
  testType: string
  collectionDate: string
  testingDate: string | null
  status: 'Pending' | 'Done'
  serviceProvider: string
  medicalReferrer: string
  faxNumber: string
  email: string
}

interface DashboardProps {
  data: TestResult[]
}

type FilterableAndSortableColumn<D extends object> = Column<D> & {
  canFilter?: boolean
  Filter?: React.FC<{
    column: {
      filterValue: string
      setFilter: (value: string) => void
      preFilteredRows: Row<D>[]
      id: string
    }
  }>
  getSortByToggleProps?: () => object
  isSorted?: boolean
  isSortedDesc?: boolean
}
interface ExtendedTableInstance<D extends object> extends TableInstance<D> {
  state: TableState<D> & {
    selectedRowIds: Record<string, boolean>
    pageIndex: number
    pageSize: number
  }
  headerGroups: Array<ExtendedHeaderGroup<D>>
  page: Row<D>[]
  canPreviousPage: boolean
  canNextPage: boolean
  pageOptions: number[]
  pageCount: number
  gotoPage: (updater: ((pageIndex: number) => number) | number) => void
  nextPage: () => void
  previousPage: () => void
  setPageSize: (pageSize: number) => void
  resetSortBy: () => void // Add this line
}

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  { indeterminate?: boolean } & React.InputHTMLAttributes<HTMLInputElement>
>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef<HTMLInputElement>(null)
  const resolvedRef = (ref || defaultRef) as React.MutableRefObject<HTMLInputElement>

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = !!indeterminate
    }
  }, [resolvedRef, indeterminate])

  return <input type="checkbox" ref={resolvedRef} {...rest} />
})

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const columns: Array<FilterableAndSortableColumn<TestResult>> = React.useMemo(
    () => [
      {
        id: 'selection',
        Header: ({ getToggleAllRowsSelectedProps }: any) => (
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        ),
        Cell: ({ row }: { row: Row<TestResult> }) => (
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        ),
        minWidth: 70,
        width: 70,
        maxWidth: 70,
      },
      {
        Header: 'View',
        accessor: 'pdfView',
        Cell: ({ value }: { value: string }) => (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-blue-600 hover:underline overflow-hidden">
            View
          </a>
        ),
        minWidth: 70,
        width: 90,
        maxWidth: 90,
      },
      {
        Header: 'Patient Name',
        accessor: 'patientName',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <input
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search patient name..."
            className="p-1 border rounded w-full overflow-hidden"
          />
        ),
        minWidth: 50,
        width: 100,
        maxWidth: 200,
      },
      {
        Header: 'Test Type',
        accessor: 'testType',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <input
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search test type..."
            className="p-1 border rounded w-full"
          />
        ),
        minWidth: 50,
        width: 150,
        maxWidth: 300,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <select
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value)}
            className="p-1 border rounded w-full">
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Done">Done</option>
          </select>
        ),
        minWidth: 50,
        width: 80,
        maxWidth: 80,
      },
      {
        Header: 'Medical Referrer',
        accessor: 'medicalReferrer',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <input
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search medical referrer..."
            className="p-1 border rounded w-full"
          />
        ),
        minWidth: 50,
        width: 150,
        maxWidth: 300,
      },
      {
        Header: 'Date of Birth',
        accessor: 'dateOfBirth',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <input
            type="date"
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value)}
            className="p-1 border rounded w-full"
          />
        ),
        minWidth: 50,
        width: 100,
        maxWidth: 100,
      },
      {
        Header: 'Collection Date',
        accessor: 'collectionDate',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <input
            type="date"
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value)}
            className="p-1 border rounded w-full"
          />
        ),
        minWidth: 50,
        width: 100,
        maxWidth: 100,
      },
      {
        Header: 'Testing Date',
        accessor: 'testingDate',
        Cell: ({ value }: { value: string | null }) => value || 'N/A',
        minWidth: 50,
        width: 100,
        maxWidth: 100,
      },

      {
        Header: 'Service Provider',
        accessor: 'serviceProvider',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <input
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search service provider..."
            className="p-1 border rounded w-full"
          />
        ),
        minWidth: 50,
        width: 150,
        maxWidth: 300,
      },
      {
        Header: 'Fax Number',
        accessor: 'faxNumber',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <input
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search fax number..."
            className="p-1 border rounded w-full"
          />
        ),
        minWidth: 50,
        width: 150,
        maxWidth: 300,
      },
      {
        Header: 'Email',
        accessor: 'email',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <input
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search email..."
            className="p-1 border rounded w-full"
          />
        ),
        minWidth: 50,
        width: 150,
        maxWidth: 300,
      },
    ],
    []
  )

  const filterTypes = React.useMemo(
    () => ({
      text: (rows: Row<TestResult>[], id: IdType<TestResult>, filterValue: FilterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  )

  const tableOptions: TableOptions<TestResult> = {
    columns,
    data,
    defaultColumn,
    filterTypes,
    initialState: { pageIndex: 0, pageSize: 10 },
    isMultiSortEvent: () => true, // Add this line
  }
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    resetSortBy, // Add this line
  } = useTable(
    tableOptions,
    useFlexLayout,
    useResizeColumns,
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect
  ) as ExtendedTableInstance<TestResult>

  const { selectedRowIds, filters, sortBy, pageIndex, pageSize } = state

  const resetFilters = () => {
    headerGroups.forEach((headerGroup) =>
      headerGroup.headers.forEach((column) => {
        if (column.canFilter) {
          column.setFilter('')
        }
      })
    )
    resetSortBy() // Reset sorting
  }

  const handleAction = (action: string) => {
    const selectedRows = rows.filter((row) => selectedRowIds[row.id])
    console.log(
      `${action} for:`,
      selectedRows.map((row) => row.original)
    )
    // Implement actual logic for faxing or emailing here
  }

  const getFilterAndSortDescription = () => {
    const activeFilters = filters.filter((f) => f.value)
    const activeSorts = sortBy.filter((s) => s.id)

    let description = 'Showing all results'

    if (activeFilters.length > 0) {
      const filterDescriptions = activeFilters.map((f) => `${f.id} containing "${f.value}"`)
      description = `Filtered by ${filterDescriptions.join(', ')}`
    }

    if (activeSorts.length > 0) {
      const sortDescriptions = activeSorts.map(
        (s) => `${s.id} ${s.desc ? 'descending' : 'ascending'}`
      )
      description += ` | Sorted by ${sortDescriptions.join(', ')}`
    }

    return description
  }

  // Refs for synchronizing scroll positions
  const scrollbarRef = React.useRef<HTMLDivElement>(null)
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  const [tableScrollWidth, setTableScrollWidth] = React.useState(0)

  React.useEffect(() => {
    if (tableContainerRef.current) {
      setTableScrollWidth(tableContainerRef.current.scrollWidth)
    }
  }, [tableContainerRef, page])

  const handleScrollbarScroll = () => {
    if (scrollbarRef.current && tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = scrollbarRef.current.scrollLeft
    }
  }

  const handleTableScroll = () => {
    if (tableContainerRef.current && scrollbarRef.current) {
      scrollbarRef.current.scrollLeft = tableContainerRef.current.scrollLeft
    }
  }

  return (
    <div className="bg-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Blood Testing Portal Dashboard</h1>
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {headerGroups.map((headerGroup) =>
            headerGroup.headers.map((column) => {
              if (column.canFilter && column.Filter) {
                return (
                  <div key={column.id} className="flex flex-col">
                    <label htmlFor={column.id} className="mb-1 font-medium ">
                      {column.render('Header')}
                    </label>
                    {column.render('Filter')}
                  </div>
                )
              }
              return null
            })
          )}
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={resetFilters}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Reset Filters
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex justify-start gap-6">
          <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
          <p className="text-sm text-gray-500 italic">{getFilterAndSortDescription()}</p>
        </div>
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={Object.keys(selectedRowIds).length === 0}>
                Actions
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleAction('fax')}>Fax Selected</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleAction('email')}>
                Email Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        {/* Scrollbar Container */}
        <div
          className="scrollbar-container"
          style={{ overflowX: 'auto', height: 16 }}
          ref={scrollbarRef}
          onScroll={handleScrollbarScroll}>
          <div style={{ width: `${tableScrollWidth}px` }}></div>
        </div>
        {/* Table Container */}
        <div
          className="table-container  border-2 border-black"
          style={{ overflowX: 'hidden' }}
          ref={tableContainerRef}
          onScroll={handleTableScroll}>
          <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
            <table
              {...getTableProps()}
              className="min-w-full bg-white  shadow-lg rounded-lg"
              style={{ ...getTableProps().style }}>
              <thead className="sticky top-0 bg-blue-500">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        key={column.id}
                        className="px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer relative select-none border border-black overflow-hidden text-ellipsis whitespace-normal "
                        style={{ ...column.getHeaderProps().style }}>
                        <div {...column.getSortByToggleProps()}>
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </span>
                        </div>
                        <div
                          {...column.getResizerProps()}
                          className="resizer hover:bg-gray-300"
                          style={{
                            display: 'inline-block',
                            width: '10px',
                            height: '100%',
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            transform: 'translateX(50%)',
                            zIndex: 1,
                            touchAction: 'none',
                            cursor: 'col-resize',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="bg-white divide-y divide-blue-100">
                {page.map((row, rowIndex) => {
                  prepareRow(row)
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.id}
                      className={rowIndex % 2 === 0 ? 'bg-blue-50' : 'bg-white'}
                      style={{ ...row.getRowProps().style }}>
                      {row.cells.map((cell) => {
                        // Determine if the cell is in the 'selection' or 'View' column
                        const isCenterAligned =
                          cell.column.id === 'selection' || cell.column.id === 'pdfView'

                        // Determine if the cell is in the 'status' column
                        const isStatusColumn = cell.column.id === 'status'

                        // Set the text color based on the status value
                        let textColorClass = 'text-gray-700' // Default text color
                        if (isStatusColumn) {
                          textColorClass = cell.value === 'Pending' ? 'bg-red-400' : 'bg-green-400'
                        }

                        return (
                          <td
                            {...cell.getCellProps()}
                            key={cell.column.id}
                            className={`px-3 py-4 whitespace-nowrap text-sm border border-black overflow-hidden text-ellipsis ${
                              isCenterAligned ? 'text-center' : 'text-left'
                            } ${textColorClass}`}
                            style={{ ...cell.getCellProps().style }}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-blue-300 mr-2">
            {'<<'}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-blue-300 mr-2">
            {'<'}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-blue-300 mr-2">
            {'>'}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-blue-300">
            {'>>'}
          </button>
        </div>
        <span className="mr-4">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
          className="p-2 border rounded">
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Dashboard
