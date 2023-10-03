import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import http from "../../../http-common";
import { toast } from "react-toastify";
import {
  formQueryParams,
  getDaysInRange,
  getMonth,
  getWeek,
  rupiah,
} from "../../../helpers/common";
import moment from "moment";
import NumericFormatRp from "../../../components/NumericFormatRp";

export default function Analytics() {
  const [deliveryStartDate, setDeliveryStartDate] = useState("");
  const [deliveryEndDate, setDeliveryEndDate] = useState("");
  const [invoiceStartDate, setInvoiceStartDate] = useState("");
  const [invoiceEndDate, setInvoiceEndDate] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
      setProducts((await http.get("/rs/products")).data.data);
    })();
  }, []);

  const handleSetDeliveriesWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setDeliveryStartDate(weekStart);
    setDeliveryEndDate(weekEnd);
  };

  const handleSetDeliveriesMonth = () => {
    const { monthStart, monthEnd } = getMonth();

    setDeliveryStartDate(monthStart);
    setDeliveryEndDate(monthEnd);
  };

  const handleSetInvoiceWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setInvoiceStartDate(weekStart);
    setInvoiceEndDate(weekEnd);
  };

  const handleSetInvoicesMonth = () => {
    const { monthStart, monthEnd } = getMonth();

    setInvoiceStartDate(monthStart);
    setInvoiceEndDate(monthEnd);
  };

  const handleSubmit = async () => {
    const queryParams = formQueryParams({
      deliveryStartDate,
      deliveryEndDate,
      invoiceEndDate,
      invoiceStartDate,
      CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
      ProductId: selectedProduct ? selectedProduct.id : undefined,
    });
    const analytics = (await http.get(`/rs/analytics?${queryParams}`)).data
      .data;
    const analyticsDateSorted = analytics.slice().sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    if (analyticsDateSorted.length < 2) {
      toast.error("Range too short");
      return;
    }

    const days = getDaysInRange(
      analyticsDateSorted[0].date,
      analyticsDateSorted[analyticsDateSorted.length - 1].date
    );

    const analyticsData = days.map((day) => {
      const saleDay = analytics.find((analytic) => {
        return analytic.date === day;
      });
      if (saleDay) {
        return {
          date: moment(saleDay.date).format("ddd DD-MM"),
          revenue: parseFloat(saleDay.revenue),
          expense: parseFloat(saleDay.expense),
          profit: parseFloat(saleDay.profit),
        };
      }
      return {
        date: moment(day).format("ddd DD-MM"),
        revenue: 0,
        profit: 0,
        expense: 0,
      };
    });

    setAnalyticsData(analyticsData);
  };

  return (
    <div>
      <Box marginTop={2} mb={4}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="Delivery Start Date"
              type="date"
              value={deliveryStartDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setDeliveryStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="Delivery End Date"
              type="date"
              value={deliveryEndDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setDeliveryEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" height="100%">
              <Button
                variant="outlined"
                fullWidth
                onClick={handleSetDeliveriesWeek}
              >
                This Week
              </Button>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" height="100%">
              <Button
                variant="outlined"
                fullWidth
                onClick={handleSetDeliveriesMonth}
              >
                This Month
              </Button>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="Invoice Start Date"
              type="date"
              value={invoiceStartDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setInvoiceStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="Invoice End Date"
              type="date"
              value={invoiceEndDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setInvoiceEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" height="100%">
              <Button
                variant="outlined"
                fullWidth
                onClick={handleSetInvoiceWeek}
              >
                This Week
              </Button>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" height="100%">
              <Button
                variant="outlined"
                fullWidth
                onClick={handleSetInvoicesMonth}
              >
                This Month
              </Button>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              value={selectedCustomer}
              onChange={(e, newValue) => {
                setSelectedCustomer(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Typography>{option.fullName}</Typography>
                </li>
              )}
              getOptionLabel={(option) => `(#${option.id}) ${option.fullName}`}
              options={customers}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Customer" size="small" />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              value={selectedProduct}
              onChange={(e, newValue) => {
                setSelectedProduct(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Typography>{option.name}</Typography>
                </li>
              )}
              getOptionLabel={(option) => `(#${option.id}) ${option.name}`}
              options={products}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Products" size="small" />
              )}
            />
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>

        <Box display="flex" gap={2}>
          <Button variant="outlined" fullWidth onClick={() => {}}>
            Reset
          </Button>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Filter
          </Button>
        </Box>
      </Box>

      <Stack direction="row" spacing={2}>
        <AreaChart
          width={700}
          height={400}
          data={analyticsData}
          margin={{
            top: 10,
            right: 30,
            left: 80,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(tick) => rupiah(tick)} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#22bae0"
            fill="#22bae0"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#ed1a07"
            fill="#ed1a07"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#04b83a"
            fill="#04b83a"
          />
        </AreaChart>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Total Revenue</Typography>
            <Typography fontSize={20} fontWeight="medium">
              <NumericFormatRp
                value={analyticsData.reduce(
                  (total, day) => total + day.revenue,
                  0
                )}
              />
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Total Expense</Typography>
            <Typography fontSize={20} fontWeight="medium">
              <NumericFormatRp
                value={parseInt(
                  analyticsData.reduce((total, day) => total + day.expense, 0)
                )}
              />
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Total Profit</Typography>
            <Typography fontSize={20} fontWeight="medium">
              <NumericFormatRp
                value={parseInt(
                  analyticsData.reduce((total, day) => total + day.profit, 0)
                )}
              />
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}
