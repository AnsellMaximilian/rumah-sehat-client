import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
// import Edit from "@mui/icons-material/ModeEdit";
import IconButton from "@mui/material/IconButton";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import DeleteAlert from "../../../components/DeleteAlert";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import PayIcon from "@mui/icons-material/Paid";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  copyTextToClipboard,
  formFileName,
  formQueryParams,
  getWeek,
} from "../../../helpers/common";

const InvoiceIndex = () => {
  const [invoices, setInvoices] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

  // FILTERS
  const [deliveriesStartDate, setDeliveriesStartDate] = useState("");
  const [deliveriesEndDate, setDeliveriesEndDate] = useState("");
  const [invoiceStartDate, setInvoiceStartDate] = useState("");
  const [invoiceEndDate, setInvoiceEndDate] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [status, setStatus] = useState("all");

  //PRINT
  const [isPrinting, setIsPrinting] = useState(false);
  const [setDraftsPending, setSetDraftsPending] = useState(false);
  const [setInvoicesDateToToday, setSetInvoicesDateToToday] = useState(false);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/invoices/${id}`);
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
      setInvoices((await http.get("/rs/invoices?status=pending")).data.data);
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, []);

  const cycleStatus = async (id) => {
    try {
      const invoice = (await http.patch(`/rs/invoices/${id}/cycle-status`)).data
        .data;
      toast.success(`Updated invoice #${invoice.id}`, { autoClose: 500 });
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === id)
            return { ...inv, status: invoice.status, paid: invoice.paid };
          return inv;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSetDeliveriesWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setDeliveriesStartDate(weekStart);
    setDeliveriesEndDate(weekEnd);
  };

  const handleSetInvoiceWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setInvoiceStartDate(weekStart);
    setInvoiceEndDate(weekEnd);
  };

  const handleClearFilter = async () => {
    setDeliveriesEndDate("");
    setDeliveriesStartDate("");
    setInvoiceEndDate("");
    setInvoiceStartDate("");
    setSelectedCustomer(null);
    setStatus("all");

    setInvoices((await http.get(`/rs/invoices?status=pending`)).data.data);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      deliveriesEndDate,
      deliveriesStartDate,
      invoiceEndDate,
      invoiceStartDate,
      status: status === "all" ? null : status,
      CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
    });
    // console.log(queryParams);
    setInvoices((await http.get(`/rs/invoices?${queryParams}`)).data.data);
  };

  const handleBulkPrint = async () => {
    try {
      setIsPrinting(true);
      const body = {
        invoiceIds: invoices.map((inv) => inv.id),
        setDraftsPending,
        setInvoicesDateToToday,
        fileNamePrefix: formFileName({
          delStart: deliveriesStartDate,
          delEnd: deliveriesEndDate,
          invStart: invoiceStartDate,
          invEnd: invoiceEndDate,
          status: status === "all" ? null : status,
          CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
        }),
      };

      const res = (await http.post("/rs/invoices/bulk-print", body)).data.data;
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
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "customer", headerName: "Customer", width: 250 },
    {
      field: "totalPrice",
      headerName: "Total (Rp)",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
    },
    { field: "status", headerName: "Status", width: 65 },

    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color={
                params.row.paid
                  ? "success"
                  : params.row.status === "pending"
                  ? "default"
                  : "warning"
              }
              onClick={(e) => {
                e.stopPropagation();
                cycleStatus(params.row.id);
              }}
            >
              {params.row.status === "draft" ? <NoteAltIcon /> : <PayIcon />}
            </IconButton>
            {/* <IconButton
              color="warning"
              component={Link}
              to={`/rs/invoices/edit/${params.row.id}`}
            >
              <Edit />
            </IconButton> */}
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
              component={Link}
              to={`/rs/invoices/${params.row.id}`}
              color="primary"
            >
              <ShowIcon />
            </IconButton>
            <IconButton
              color="warning"
              onClick={(e) => {
                e.stopPropagation();
                copyTextToClipboard(
                  `*REMINDER*\nMohon bantuannya untuk dapat menyelesaikan pembayaran atas invoice #${params.row.id}.\nJika sudah boleh boleh konfirmasi ya.\n\nTerima kasih 🙏\n_Rumah Sehat_`
                );
              }}
            >
              <NotificationsIcon />
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
        <Button variant="contained" component={Link} to={"/rs/invoices/manage"}>
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
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                size="small"
                label="Supplier"
                value={status}
                fullWidth
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
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
          <Chip label="Deliveries" />
        </Divider>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              value={deliveriesStartDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setDeliveriesStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
              label="End Date"
              type="date"
              value={deliveriesEndDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setDeliveriesEndDate(e.target.value)}
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
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => setSetDraftsPending(e.target.checked)}
                checked={setDraftsPending}
              />
            }
            label="Set Drafts to 'Pending'?"
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
      <Card sx={{ marginTop: 2 }}>
        <SmartTable
          rows={invoices.map((invoice) => ({
            id: invoice.id,
            date: invoice.date,
            customer: invoice.Customer.fullName,
            totalPrice: invoice.totalPrice,
            status: invoice.status,
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

export default InvoiceIndex;
