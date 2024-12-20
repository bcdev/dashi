from dataclasses import dataclass, field
from typing import Literal, TypedDict, Callable, List, Any

from chartlets import Component


class GridPaginationModelDict(TypedDict):
    page: int
    pageSize: int


class PageSizeOption(TypedDict, total=False):
    label: str
    value: int


class GridPagination(TypedDict):
    paginationModel: GridPaginationModelDict


class InitialState(TypedDict):
    pagination: GridPagination


@dataclass(frozen=True)
class Table(Component):
    """The Data Grid presents information in a structured format of rows and
    columns.

    The data is displayed in a user-friendly interface for efficient editing,
    reviewing, and analysis.
    """

    rows: List[dict[str, Any]] = field(default_factory=list)
    """The data for the rows in the grid."""

    columns: List[dict[str, Any]] = field(default_factory=list)
    """The column definitions for the grid. Please have a look here to 
     identify the keys https://mui.com/x/api/data-grid/grid-col-def/"""

    ariaLabel: str | None = None
    """The aria-label of the grid."""

    autoPageSize: bool | None = None
    """If true, the page size is automatically adjusted to fit the content."""

    checkboxSelection: bool | None = None
    """If true, checkboxes are displayed for row selection."""

    density: Literal["compact", "standard", "comfortable"] | None = None
    """The density of the grid."""

    disableAutoSize: bool | None = None
    """If true, disables autosizing of columns."""

    disableColumnFilter: bool | None = None
    """If true, disables column filtering."""

    disableColumnMenu: bool | None = None
    """If true, disables the column menu."""

    disableColumnResize: bool | None = None
    """If true, disables column resizing."""

    disableColumnSelector: bool | None = None
    """If true, disables the column selector."""

    disableColumnSorting: bool | None = None
    """If true, disables column sorting."""

    disableDensitySelector: bool | None = None
    """If true, disables the density selector."""

    disableMultipleRowSelection: bool | None = None
    """If true, disables multiple row selection."""

    disableRowSelectionOnClick: bool | None = None
    """If true, clicking on a row does not select it."""

    editMode: Literal["cell", "row"] | None = None
    """The editing mode of the grid."""

    hideFooter: bool | None = None
    """If true, hides the footer."""

    hideFooterPagination: bool | None = None
    """If true, hides the pagination in the footer."""

    hideFooterSelectedRowCount: bool | None = None
    """If true, hides the selected row count in the footer."""

    initialState: InitialState | None = None
    """The initial state of the grid, including pagination."""

    isLoading: bool | None = None
    """If true, displays a loading indicator."""

    pageSizeOptions: list[int | PageSizeOption] | None = None
    """Available page size options."""

    paginationModel: GridPaginationModelDict | None = None
    """The pagination model for the grid."""

    rowHeight: int | None = None
    """The height of each row."""

    rowSelection: bool | None = None
    """If true, row selection is enabled."""
