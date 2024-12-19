import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Table } from "./Table";
import { createChangeHandler } from "@/plugins/mui/common.test";

describe("Table", () => {
  const mockColumns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
  ];
  const mockRows = [{ id: 1, name: "MockRow" }];
  const paginationModel = { page: 1, pageSize: 10 };

  it("should render the Table component", () => {
    render(
      <Table
        columns={mockColumns}
        rows={mockRows}
        type="Table"
        id="tableId"
        onChange={() => {}}
        paginationModel={paginationModel}
        pageSizeOptions={[10, 25, 50]}
      />,
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByText("MockRow")).toBeInTheDocument();
  });

  it("should handle row click", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Table
        columns={mockColumns}
        rows={mockRows}
        type="Table"
        id="tableId"
        onChange={onChange}
      />,
    );

    const row = screen.getByRole("row", { name: /1/ });
    fireEvent.click(row);

    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0].componentType).toBe("Table");
    expect(recordedEvents[0].id).toBe("tableId");
    expect(recordedEvents[0].property).toBe("value");
    expect(recordedEvents[0].value).toEqual(mockRows[0]);
  });

  it("should render with other props correctly", () => {
    render(
      <Table
        columns={mockColumns}
        rows={mockRows}
        type="Table"
        id="tableId"
        onChange={() => {}}
        ariaLabel="Test Table"
        autoPageSize={true}
        checkboxSelection={true}
        density="compact"
        disableColumnFilter={true}
        loading={true}
      />,
    );
    expect(screen.getByTestId("data-grid-test-id")).toHaveAttribute(
      "aria-label",
      "Test Table",
    );
  });

  it("should not render if no columns are provided", () => {
    render(
      <Table rows={mockRows} type="Table" id="tableId" onChange={() => {}} />,
    );
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });
});
