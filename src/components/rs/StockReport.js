import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import moment from "moment";
import NumericFormatRp from "../NumericFormatRp";
import { Fragment } from "react";

export default function StockReport({ reportData }) {
  return (
    <Box component={Paper} marginTop={2}>
      <Box padding={2} backgroundColor="primary.main" color="white">
        <Box>
          <Typography variant="h6">Stock Report</Typography>
        </Box>
      </Box>

      <Box>
        <TableContainer sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">In</TableCell>
                <TableCell align="right">Out</TableCell>
                <TableCell align="right">Drawn</TableCell>
                <TableCell align="right">Available Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((pr) => {
                return (
                  <TableRow
                    key={pr.id}
                    sx={{
                      backgroundColor: "primary.main",
                      ">td": {
                        color: "white",

                        fontWeight: "bold",
                      },
                    }}
                  >
                    <TableCell>{pr.id}</TableCell>
                    <TableCell>{pr.name}</TableCell>
                    <TableCell align="right">
                      {parseFloat(pr.totalIn)}
                    </TableCell>
                    <TableCell align="right">
                      {parseFloat(pr.totalOut)}
                    </TableCell>
                    <TableCell align="right">
                      {parseFloat(pr.totalDrawn)}
                    </TableCell>
                    <TableCell align="right">
                      {parseFloat(pr.totalIn) -
                        parseFloat(pr.totalOut) -
                        parseFloat(pr.totalDrawn)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
