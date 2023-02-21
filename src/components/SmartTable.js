import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

export default function SmartTable({ rows, columns }) {
  const [pageSize, setPageSize] = useState(5);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        checkboxSelection
        rowHeight={25}
      />
    </div>
  );
}
