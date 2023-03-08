import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import moment from "moment";
import NumericFormatRp from "../NumericFormatRp";
import { Fragment } from "react";

export default function ProfitsReport({
  suppliers,
  profits,
  startDate,
  endDate,
}) {
  return (
    <Box component={Paper} marginTop={2}>
      <Box padding={2} backgroundColor="primary.main" color="white">
        <Typography variant="h6">Profits</Typography>
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
                <TableCell align="right">Buy Price</TableCell>
                <TableCell align="right">Sale Price</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="right">Total Cost</TableCell>
                <TableCell align="right">Total Sales</TableCell>
                <TableCell align="right">Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => {
                return (
                  <Fragment key={supplier.supplierId}>
                    <TableRow
                      key={`supplier-${supplier.supplierId}`}
                      sx={{
                        backgroundColor: "primary.light",
                        ">td": {
                          //   color: "white",

                          fontWeight: "bold",
                        },
                      }}
                    >
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="center">
                        {parseFloat(supplier.totalQty)}
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormatRp
                          value={parseFloat(supplier.totalCost)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormatRp
                          value={parseFloat(supplier.totalPrice)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormatRp value={parseFloat(supplier.profit)} />
                      </TableCell>
                    </TableRow>
                    {profits
                      .filter(
                        (profit) => profit.supplierId === supplier.supplierId
                      )
                      .map((profit) => {
                        return (
                          <TableRow
                            key={profit.productId}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {profit.product}
                            </TableCell>
                            <TableCell align="right">
                              <NumericFormatRp value={profit.cost} />
                            </TableCell>
                            <TableCell align="right">
                              <NumericFormatRp value={profit.price} />
                            </TableCell>
                            <TableCell align="center">
                              {parseFloat(profit.totalQty)}
                            </TableCell>
                            <TableCell align="right">
                              <NumericFormatRp
                                value={parseFloat(profit.totalCost)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <NumericFormatRp
                                value={parseFloat(profit.totalPrice)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <NumericFormatRp
                                value={parseFloat(profit.profit)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
