import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import http from "../../../http-common";
import { toast } from "react-toastify";
import { getLastWeek, getWeek } from "../../../helpers/common";
import NumericFormatRp from "../../../components/NumericFormatRp";

function SaleRow({ sale }) {
  const [open, setOpen] = React.useState(false);

  const totalSale = sale.Products.reduce(
    (sum, prod) =>
      sum +
      prod.DeliveryDetails.reduce(
        (sum, det) => sum + parseInt(det.totalPrice),
        0
      ),
    0
  );

  return (
    totalSale > 0 && (
      <React.Fragment>
        <TableRow
          sx={{
            "& > *": {
              borderBottom: 0,
            },
          }}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align="left">{sale.name}</TableCell>
          <TableCell align="right">
            <NumericFormatRp value={totalSale} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Products
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Total Sold</TableCell>
                      <TableCell align="right">Total Sale</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sale.Products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell component="th" scope="row" align="left">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          {product.DeliveryDetails.reduce(
                            (sum, det) => parseInt(det.qty),
                            0
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormatRp
                            value={product.DeliveryDetails.reduce(
                              (sum, det) => parseInt(det.totalPrice),
                              0
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  );
}

function PurchaseRow({ purchase }) {
  const [open, setOpen] = React.useState(false);

  const totalSpent = purchase.Products.reduce(
    (sum, prod) =>
      sum +
      prod.PurchaseDetails.reduce(
        (sum, det) => sum + parseInt(det.totalPrice),
        0
      ),
    0
  );

  return (
    totalSpent > 0 && (
      <React.Fragment>
        <TableRow
          sx={{
            "& > *": {
              borderBottom: 0,
            },
          }}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align="left">{purchase.name}</TableCell>
          <TableCell align="right">
            <NumericFormatRp value={totalSpent} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Products
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Total Bought</TableCell>
                      <TableCell align="right">Total Spent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchase.Products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell component="th" scope="row" align="left">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          {product.PurchaseDetails.reduce(
                            (sum, det) => parseInt(det.qty),
                            0
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormatRp
                            value={product.PurchaseDetails.reduce(
                              (sum, det) => parseInt(det.totalPrice),
                              0
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  );
}

export default function FullReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reportData, setReportData] = useState(null);

  const handleSetWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleSetLastWeek = () => {
    const { weekStart, weekEnd } = getLastWeek();

    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please input both dates.");
      return;
    }
    const data = (
      await http.get(
        `/rs/reports/full-report-data?startDate=${startDate}&endDate=${endDate}`
      )
    ).data.data;

    setReportData(data);
  };

  return (
    <Box>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <Typography variant="subtitle2" textTransform={"uppercase"}>
            Filter Full Report
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" height="100%">
            <Button variant="outlined" fullWidth onClick={handleSetLastWeek}>
              Last Week
            </Button>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" height="100%">
            <Button variant="outlined" fullWidth onClick={handleSetWeek}>
              This Week
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            Filter
          </Button>
        </Grid>
      </Grid>

      {reportData && (
        <Stack spacing={4} mt={4}>
          <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography fontSize={24} fontWeight="bold">
                Sales
              </Typography>
              <Typography fontSize={24} fontWeight="bold">
                <NumericFormatRp
                  value={reportData.sales.reduce(
                    (sum, sup) =>
                      sum +
                      sup.Products.reduce(
                        (sum, prod) =>
                          sum +
                          prod.DeliveryDetails.reduce(
                            (sum, det) => sum + parseInt(det.totalPrice),
                            0
                          ),
                        0
                      ),
                    0
                  )}
                />
              </Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Supplier</TableCell>
                    <TableCell align="right">Total Sale</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.sales.map((sale) => (
                    <SaleRow key={sale.name} sale={sale} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography fontSize={24} fontWeight="bold">
                Purchases
              </Typography>
              <Typography fontSize={24} fontWeight="bold">
                <NumericFormatRp
                  value={reportData.purchases.reduce(
                    (sum, sup) =>
                      sum +
                      sup.Products.reduce(
                        (sum, prod) =>
                          sum +
                          prod.PurchaseDetails.reduce(
                            (sum, det) => sum + parseInt(det.totalPrice),
                            0
                          ),
                        0
                      ),
                    0
                  )}
                />
              </Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Supplier</TableCell>
                    <TableCell align="right">Total Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.purchases.map((purchase) => (
                    <PurchaseRow key={purchase.name} purchase={purchase} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
