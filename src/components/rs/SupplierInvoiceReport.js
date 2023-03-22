import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import moment from "moment";
import NumericFormatRp from "../NumericFormatRp";
import { getBillSubtotal } from "../../helpers/rs";

export default function SupplierInvoiceReport({
  reportData,
  startDate,
  endDate,
}) {
  return (
    <Box component={Paper} marginTop={2}>
      <Box padding={2} backgroundColor="primary.main" color="white">
        <Typography variant="h6">Supplier Invoice</Typography>
        <Typography variant="subtitle1">
          {moment(startDate).format("DD MMMM YYYY")} -{" "}
          {moment(endDate).format("DD MMMM YYYY")}
        </Typography>
      </Box>

      <Box>
        <TableContainer sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">Delivery Cost</TableCell>
                <TableCell align="right">Adjustments</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((supplierTotal) => (
                <TableRow
                  key={supplierTotal.supplierId}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {supplierTotal.supplierName}
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp
                      value={parseFloat(supplierTotal.subtotal)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp
                      value={parseFloat(supplierTotal.delivery)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp
                      value={parseFloat(supplierTotal.adjustmentTotal)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={parseFloat(supplierTotal.total)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
