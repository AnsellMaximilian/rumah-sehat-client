import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import DeleteAlert from "../../../components/DeleteAlert";
import PayIcon from "@mui/icons-material/Paid";
import {
  formFileName,
  formQueryParams,
  getWeek,
} from "../../../helpers/common";

const DrInvoiceIndex = () => {
  const [invoices, setInvoices] = useState([]);

  const [toDeleteId, setToDeleteId] = useState(null);

  // FILTERS
  const [idDeliveriesStartDate, setIdDeliveriesStartDate] = useState("");
  const [sgDeliveriesStartDate, setSgDeliveriesStartDate] = useState("");
  const [idDeliveriesEndDate, setIdDeliveriesEndDate] = useState("");
  const [sgDeliveriesEndDate, setSgDeliveriesEndDate] = useState("");
  const [invoiceStartDate, setInvoiceStartDate] = useState("");
  const [invoiceEndDate, setInvoiceEndDate] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paidStatus, setPaidStatus] = useState("all");

  //PRINT
  const [isPrinting, setIsPrinting] = useState(false);
  const [setInvoicesDateToToday, setSetInvoicesDateToToday] = useState(false);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/dr/invoices/${id}`);
        setInvoices((invoices) =>
          invoices.filter((invoice) => invoice.id !== id)
        );
        toast.success("Invoice deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setInvoices((await http.get("/dr/invoices?unpaid=true")).data.data);
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, []);

  const pay = async (id) => {
    try {
      const invoice = (await http.patch(`/dr/invoices/${id}/pay`)).data.data;
      toast.success(`Updated invoice #${invoice.id}`);
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === id) return { ...inv, paid: invoice.paid };
          return inv;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSetIdDeliveriesWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setIdDeliveriesStartDate(weekStart);
    setIdDeliveriesEndDate(weekEnd);
  };

  const handleSetSgDeliveriesWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setSgDeliveriesStartDate(weekStart);
    setSgDeliveriesEndDate(weekEnd);
  };

  const handleSetInvoiceWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setInvoiceStartDate(weekStart);
    setInvoiceEndDate(weekEnd);
  };

  const handleClearFilter = async () => {
    setIdDeliveriesStartDate("");
    setIdDeliveriesEndDate("");
    setSgDeliveriesStartDate("");
    setSgDeliveriesEndDate("");
    setInvoiceEndDate("");
    setInvoiceStartDate("");
    setSelectedCustomer(null);

    setInvoices((await http.get(`/dr/invoices`)).data.data);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      idDeliveriesStartDate,
      idDeliveriesEndDate,
      sgDeliveriesStartDate,
      sgDeliveriesEndDate,
      invoiceEndDate,
      invoiceStartDate,
      CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
      ...(paidStatus === "all"
        ? {}
        : paidStatus === "paid"
        ? { paid: "yes" }
        : { unpaid: "yes" }),
    });
    setInvoices((await http.get(`/dr/invoices?${queryParams}`)).data.data);
  };

  const handleBulkPrint = async () => {
    try {
      setIsPrinting(true);
      const body = {
        invoiceIds: invoices.map((inv) => inv.id),
        setInvoicesDateToToday,
        fileNamePrefix: formFileName({
          invStart: invoiceStartDate,
          invEnd: invoiceEndDate,
          status: paidStatus ? "paid" : "unpaid",
          CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
        }),
      };

      const res = (await http.post("/dr/invoices/bulk-print", body)).data.data;
      setIsPrinting(false);
      if (res.successes.length > 0)
        toast.success(`Successfully printed ${res.successes.length} invoices.`);
      if (res.fails.length > 0)
        toast.success(
          `Failed to print ${res.fails.length} invoices. IDs ${res.fails
            .map((fail) => fail.id)
            .join(", ")}`
        );
      console.log(res);
    } catch (error) {
      setIsPrinting(false);
      toast.error(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "customerName", headerName: "Customer", width: 200 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "note", headerName: "Note", width: 100 },

    {
      field: "totalPriceRP",
      headerName: "Total (Rp)",
      width: 100,
      renderCell: (params) => (
        <NumericFormatRp value={params.row.totalPriceRP} />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color={params.row.paid ? "success" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                pay(params.row.id);
              }}
            >
              <PayIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setToDeleteId(params.row.id);
              }}
            >
              <Delete />
            </IconButton>
            <IconButton
              color="primary"
              component={Link}
              to={`/dr/invoices/${params.row.id}`}
            >
              <ShowIcon />
            </IconButton>
          </>
        );
      },
      width: 200,
    },
  ];
  return (
    <Box>
      <Box paddingBottom={2}>
        <Button variant="contained" component={Link} to={"/dr/invoices/manage"}>
          Manage Invoices
        </Button>
      </Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Divider>
          <Chip label="Invoice" />
        </Divider>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={8}>
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
          <Grid item xs={4}>
            <FormControl margin="none" fullWidth>
              <InputLabel id="demo-simple-select-label">Paid</InputLabel>
              <Select
                size="small"
                label="Paid"
                value={paidStatus}
                fullWidth
                onChange={(e) => {
                  setPaidStatus(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              value={invoiceStartDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setInvoiceStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
              label="End Date"
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
          <Grid item xs={12}></Grid>
        </Grid>

        <Divider>
          <Chip label="ID Deliveries" />
        </Divider>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              value={idDeliveriesStartDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setIdDeliveriesStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
              label="End Date"
              type="date"
              value={idDeliveriesEndDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setIdDeliveriesEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" height="100%">
              <Button
                variant="outlined"
                fullWidth
                onClick={handleSetIdDeliveriesWeek}
              >
                This Week
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>

        <Divider>
          <Chip label="SG Deliveries" />
        </Divider>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              value={sgDeliveriesStartDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setSgDeliveriesStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
              label="End Date"
              type="date"
              value={sgDeliveriesEndDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setSgDeliveriesEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" height="100%">
              <Button
                variant="outlined"
                fullWidth
                onClick={handleSetSgDeliveriesWeek}
              >
                This Week
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
        <Box display="flex" gap={2}>
          <Button variant="outlined" fullWidth onClick={handleClearFilter}>
            Clear Filter
          </Button>
          <Button variant="contained" fullWidth onClick={handleFilter}>
            Filter
          </Button>
        </Box>
      </Box>

      <Box marginTop={4} display="flex" justifyContent="flex-end" gap={2}>
        {isPrinting && (
          <Box display="flex" gap={2} alignItems="flex-end">
            <Typography>Printing...</Typography>
            <CircularProgress />
          </Box>
        )}
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => setSetInvoicesDateToToday(e.target.checked)}
                checked={setInvoicesDateToToday}
              />
            }
            label="Set Invoice Date to Today?"
          />
        </FormGroup>
        <Button
          variant="contained"
          color="error"
          onClick={handleBulkPrint}
          disabled={isPrinting}
        >
          Print
        </Button>
      </Box>

      <Card sx={{ marginTop: 4 }}>
        <SmartTable
          rows={invoices.map((invoice) => ({
            id: invoice.id,
            note: invoice.note,
            customerName: invoice.Customer.fullName,
            date: invoice.date,
            totalPriceRP: invoice.totalPriceRP,
            paid: invoice.paid,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message="Deleting this invoice will also delete any related deliveries and its
          details."
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Invoice"
      />
    </Box>
  );
};

export default DrInvoiceIndex;
