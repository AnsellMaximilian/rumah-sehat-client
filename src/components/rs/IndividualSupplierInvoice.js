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

export default function IndividualSupplierInvoice({
  supplier,
  startDate,
  endDate,
  invoiceDetails,
  deliveryCost,
  adjustmentTotal,
}) {
  return (
    <Box component={Paper} marginTop={2}>
      <Box padding={2} backgroundColor="primary.main" color="white">
        <Typography variant="h3" fontWeight="500">
          {supplier.name}
        </Typography>
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
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Total Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceDetails.map((detail) => (
                <TableRow
                  key={detail.name}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {detail.name}
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={detail.productPrice} />
                  </TableCell>
                  <TableCell align="right">{parseFloat(detail.qty)}</TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={parseFloat(detail.total)} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  Subtotal
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp value={getBillSubtotal(invoiceDetails)} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3} align="right">
                  Delivery
                </TableCell>
                <TableCell align="right" colSpan={2}>
                  <NumericFormatRp value={deliveryCost} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} align="right">
                  Adjustments
                </TableCell>
                <TableCell align="right" colSpan={2}>
                  <NumericFormatRp value={adjustmentTotal} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} align="right">
                  Total
                </TableCell>
                <TableCell align="right" colSpan={2}>
                  <NumericFormatRp
                    value={
                      getBillSubtotal(invoiceDetails) +
                      parseInt(deliveryCost) +
                      parseInt(adjustmentTotal)
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
