import {
  DataGrid as MuiDataGrid,
  type GridCallbackDetails,
  type GridColDef,
  type GridPaginationModel,
  type GridRowModel,
  type GridRowParams,
  type MuiEvent,
} from "@mui/x-data-grid";
import type { ComponentProps, ComponentState } from "@/index";

interface TableState extends ComponentState {
  rows?: GridRowModel[];
  columns?: GridColDef[];
  ariaLabel?: string;
  autoPageSize?: boolean;
  checkboxSelection?: boolean;
  density?: "compact" | "standard" | "comfortable";
  disableAutosize?: boolean;
  disableColumnFilter?: boolean;
  disableColumnMenu?: boolean;
  disableColumnResize?: boolean;
  disableColumnSelector?: boolean;
  disableColumnSorting?: boolean;
  disableDensitySelector?: boolean;
  disableMultipleRowSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  editMode?: "cell" | "row";
  hideFooter?: boolean;
  hideFooterPagination?: boolean;
  hideFooterSelectedRowCount?: boolean;
  initialState?: {
    pagination?: {
      paginationModel: GridPaginationModel;
    };
  };
  loading?: boolean;
  pageSizeOptions?: number[] | { label: string; value: number }[];
  paginationModel?: GridPaginationModel;
  rowHeight?: number;
  rowSelection?: boolean;
}

interface TableProps extends ComponentProps, TableState {}

export const Table = ({
  type,
  id,
  style,
  rows,
  columns,
  ariaLabel,
  autoPageSize,
  checkboxSelection,
  density,
  disableAutosize,
  disableColumnFilter,
  disableColumnMenu,
  disableColumnResize,
  disableColumnSelector,
  disableColumnSorting,
  disableDensitySelector,
  disableMultipleRowSelection,
  disableRowSelectionOnClick,
  editMode,
  hideFooter,
  hideFooterPagination,
  hideFooterSelectedRowCount,
  initialState,
  loading,
  rowHeight,
  rowSelection,
  paginationModel,
  pageSizeOptions,
  onChange,
}: TableProps) => {
  if (!columns) {
    return;
  }

  const handleClick = (
    params: GridRowParams,
    _event: MuiEvent,
    _details: GridCallbackDetails,
  ) => {
    if (id) {
      if (onChange) {
        onChange({
          componentType: type,
          id: id,
          property: "value",
          value: params.row,
        });
      }
    }
  };

  return (
    <div id={id}>
      <MuiDataGrid
        rows={rows}
        columns={columns}
        aria-label={ariaLabel}
        autoPageSize={autoPageSize}
        checkboxSelection={checkboxSelection}
        density={density}
        disableAutosize={disableAutosize}
        disableColumnFilter={disableColumnFilter}
        disableColumnMenu={disableColumnMenu}
        disableColumnResize={disableColumnResize}
        disableColumnSelector={disableColumnSelector}
        disableColumnSorting={disableColumnSorting}
        disableDensitySelector={disableDensitySelector}
        disableMultipleRowSelection={disableMultipleRowSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        hideFooterSelectedRowCount={hideFooterSelectedRowCount}
        editMode={editMode}
        hideFooter={hideFooter}
        hideFooterPagination={hideFooterPagination}
        initialState={initialState}
        loading={loading}
        onRowClick={handleClick}
        paginationModel={paginationModel}
        pageSizeOptions={pageSizeOptions}
        rowHeight={rowHeight}
        rowSelection={rowSelection}
        sx={style}
        data-testid="data-grid-test-id" // For testing purposes
      />
    </div>
  );
};
