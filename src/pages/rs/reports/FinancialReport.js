import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import {
  formQueryParams,
  getLastMonth,
  getLastWeek,
  getMonth,
  getWeek,
} from "../../../helpers/common";
import http from "../../../http-common";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";

export default function FinancialReport() {
  const saleColumns = useMemo(
    () => [
      {
        field: "id",
        headerName: "Invoice ID",
        width: 125,

        renderCell: ({ value }) => (
          <Link to={`/rs/invoices/${value}`}>{value}</Link>
        ),
      },
      { field: "date", headerName: "Date", width: 125 },
      {
        field: "customer",
        headerName: "Customer",
        width: 125,
      },
      {
        field: "totalPrice",
        headerName: "Total",
        width: 250,
        renderCell: ({ value }) => <NumericFormatRp value={value} />,
      },
    ],
    []
  );
  const purchaseColumns = useMemo(
    () => [
      {
        field: "id",
        headerName: "Invoice ID",
        width: 125,

        renderCell: ({ value }) => (
          <Link to={`/rs/purchase-invoices/${value}`}>{value}</Link>
        ),
      },
      { field: "date", headerName: "Date", width: 125 },
      {
        field: "supplier",
        headerName: "Supplier",
        width: 125,
      },
      {
        field: "totalPrice",
        headerName: "Total",
        width: 250,
        renderCell: ({ value }) => <NumericFormatRp value={value} />,
      },
    ],
    []
  );

  const expenditureColumns = useMemo(
    () => [
      { field: "id", headerName: "Expenditure ID", width: 125 },
      { field: "date", headerName: "Date", width: 125 },
      {
        field: "expense",
        headerName: "Expense",
        width: 150,
      },
      {
        field: "description",
        headerName: "Description",
        width: 200,
      },
      {
        field: "totalAmount",
        headerName: "Total",
        width: 250,
        renderCell: ({ value }) => <NumericFormatRp value={value} />,
      },
    ],
    []
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please input both dates.");
      return;
    }
    const invoiceQueryParams = formQueryParams({
      invoiceStartDate: startDate,
      invoiceEndDate: endDate,
    });

    const regularQueryParams = formQueryParams({
      startDate,
      endDate,
    });
    setSales((await http.get(`/rs/invoices?${invoiceQueryParams}`)).data.data);
    setPurchases(
      (await http.get(`/rs/purchase-invoices?${regularQueryParams}`)).data.data
    );
    setExpenditures(
      (await http.get(`/expenditures?${regularQueryParams}`)).data.data
    );
  };

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

  const handleSetMonth = () => {
    const { monthStart, monthEnd } = getMonth();

    setStartDate(monthStart);
    setEndDate(monthEnd);
  };

  const handleSetLastMonth = () => {
    const { monthStart, monthEnd } = getLastMonth();

    setStartDate(monthStart);
    setEndDate(monthEnd);
  };

  const totalSales = useMemo(
    () => sales.reduce((sum, sale) => sum + sale.totalPrice, 0),
    [sales]
  );
  const totalPurchase = useMemo(
    () => purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0),
    [purchases]
  );

  const totalExpenditure = useMemo(
    () =>
      expenditures.reduce(
        (sum, expenditure) => sum + expenditure.totalAmount,
        0
      ),
    [expenditures]
  );

  return (
    <div>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <Typography variant="subtitle2" textTransform={"uppercase"}>
            Filter Full Report
          </Typography>
        </Grid>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={3}>
          <Box display="flex" height="100%">
            <Button variant="outlined" fullWidth onClick={handleSetLastWeek}>
              Last Week
            </Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display="flex" height="100%">
            <Button variant="outlined" fullWidth onClick={handleSetWeek}>
              This Week
            </Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display="flex" height="100%">
            <Button variant="outlined" fullWidth onClick={handleSetLastMonth}>
              Last Month
            </Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display="flex" height="100%">
            <Button variant="outlined" fullWidth onClick={handleSetMonth}>
              This Month
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            Filter
          </Button>
        </Grid>
      </Grid>
      <Stack gap={2}>
        <Stack
          bgcolor="primary.light"
          mt={4}
          p={2}
          sx={{ textAlign: "right" }}
          color="white"
        >
          <Typography fontSize={20}>Total Profit</Typography>
          <Typography fontWeight="bold" fontSize={24}>
            <NumericFormatRp
              value={totalSales - totalPurchase - totalExpenditure}
            />
          </Typography>
        </Stack>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            sx={{ backgroundColor: "primary.dark", color: "white" }}
            padding={1}
          >
            <Typography>Sales</Typography>
            <Typography>
              <NumericFormatRp value={totalSales} />
            </Typography>
          </Box>
          <SmartTable
            rows={sales.map((sale) => ({
              id: sale.id,
              date: sale.date,
              customer: sale.Customer.fullName,
              totalPrice: sale.totalPrice,
            }))}
            columns={saleColumns}
          />
        </Box>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            sx={{ backgroundColor: "primary.dark", color: "white" }}
            padding={1}
          >
            <Typography>Purchases</Typography>
            <Typography>
              <NumericFormatRp value={totalPurchase} />
            </Typography>
          </Box>
          <SmartTable
            rows={purchases.map((purchase) => ({
              id: purchase.id,
              date: purchase.date,
              supplier: purchase.Supplier.name,
              totalPrice: purchase.totalPrice,
            }))}
            columns={purchaseColumns}
          />
        </Box>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            sx={{ backgroundColor: "primary.dark", color: "white" }}
            padding={1}
          >
            <Typography>Expenditures</Typography>
            <Typography>
              <NumericFormatRp value={totalExpenditure} />
            </Typography>
          </Box>
          <SmartTable
            rows={expenditures.map((expenditure) => ({
              id: expenditure.id,
              date: expenditure.date,
              expense: expenditure.Expense.name,
              description: expenditure.description,
              totalAmount: expenditure.totalAmount,
            }))}
            columns={expenditureColumns}
          />
        </Box>
      </Stack>
    </div>
  );
}
