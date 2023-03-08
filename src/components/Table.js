import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function Table({ columns, rows, ...rest }) {
  return (
    <MuiTable {...rest}>
      <TableHead>
        <TableRow>
          {columns.map((col) => {
            return (
              <TableCell key={col.headerName} {...col.cellProps}>
                {col.headerName}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            {columns.map((col) => {
              return (
                <TableCell {...row.cellProps}>
                  {col.renderCell ? row.renderCell(row) : row[col.field]}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </MuiTable>
  );
}
