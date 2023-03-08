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
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => {
                return (
                  <TableCell {...row.cellProps} key={col.headerName}>
                    {col.renderCell ? row.renderCell(row) : row[col.field]}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell align="center" colSpan={columns.length}>
              Empty
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </MuiTable>
  );
}
