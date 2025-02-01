import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import moment from "moment";
import DeleteAlert from "../../../components/DeleteAlert";
import PayIcon from "@mui/icons-material/Paid";
import { formQueryParams, getWeek } from "../../../helpers/common";

const PurchaseInvoiceIndex = () => {
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

  // Filters
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [filterId, setFilterId] = useState("");
  const [invoiceStartDate, setInvoiceStartDate] = useState("");
  const [invoiceEndDate, setInvoiceEndDate] = useState("");
  const [deliveriesStartDate, setDeliveriesStartDate] = useState("");
  const [deliveriesEndDate, setDeliveriesEndDate] = useState("");
  const [paidStatus, setPaidStatus] = useState("all");

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/purchase-invoices/${id}`);
        setPurchaseInvoices((purchaseInvoices) =>
          purchaseInvoices.filter((purchase) => purchase.id !== id)
        );
        toast.success("Purchase deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handlePay = async (id) => {
    try {
      const purchaseInvoice = (
        await http.patch(`/rs/purchase-invoices/${id}/pay`)
      ).data.data;
      toast.success(`Updated purchase invoice #${purchaseInvoice.id}`, {
        autoClose: 500,
      });
      setPurchaseInvoices((prev) =>
        prev.map((exp) => {
          if (exp.id === id) return { ...exp, paid: purchaseInvoice.paid };
          return exp;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      setPurchaseInvoices(
        (await http.get("/rs/purchase-invoices?paid=false")).data.data
      );
      setSuppliers((await http.get("/rs/suppliers")).data.data);
    })();
  }, []);

  const handleSetInvoiceWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setInvoiceStartDate(weekStart);
    setInvoiceEndDate(weekEnd);
  };

  const handleSetDeliveriesWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setDeliveriesStartDate(weekStart);
    setDeliveriesEndDate(weekEnd);
  };

  const handleClearFilter = async () => {
    setSelectedSupplier(null);
    setFilterId("");
    setDeliveriesEndDate("");
    setDeliveriesStartDate("");
    setInvoiceEndDate("");
    setInvoiceStartDate("");
    setPaidStatus("all");

    setPurchaseInvoices(
      (await http.get("/rs/purchase-invoices?paid=false")).data.data
    );
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      SupplierId: selectedSupplier ? selectedSupplier.id : undefined,
      startDate: invoiceStartDate,
      endDate: invoiceEndDate,
      deliveriesEndDate,
      deliveriesStartDate,
      filterId,
      paid: paidStatus === "all" ? undefined : paidStatus,
    });
    // console.log(queryParams);
    setPurchaseInvoices(
      (await http.get(`/rs/purchase-invoices?${queryParams}`)).data.data
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "supplier", headerName: "Supplier", width: 100 },
    {
      field: "totalPrice",
      headerName: "Total",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
    },

    {
      field: "paid",
      headerName: "Paid",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color={params.row.paid ? "success" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            handlePay(params.row.id);
          }}
        >
          <PayIcon />
        </IconButton>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="warning"
              component={Link}
              to={`/rs/purchase-invoices/edit/${params.row.id}`}
            >
              <Edit />
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
              to={`/rs/purchase-invoices/${params.row.id}`}
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
      <Box paddingBottom={2} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          component={Link}
          to={"/rs/purchase-invoices/create"}
        >
          New Purchase Invoice
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to={"/rs/purchase-invoices/create"}
        >
          Manage Purchase Invoices
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
          <Grid item xs={2}>
            <TextField
              fullWidth
              label="ID"
              size="small"
              type="number"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              value={selectedSupplier}
              onChange={(e, newValue) => {
                setSelectedSupplier(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Typography>{option.name}</Typography>
                </li>
              )}
              getOptionLabel={(option) => `(#${option.id}) ${option.name}`}
              options={suppliers}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Supplier" size="small" />
              )}
            />
          </Grid>

          <Grid item xs={2}>
            <FormControl margin="none" fullWidth>
              <InputLabel id="demo-simple-select-label">Paid Status</InputLabel>
              <Select
                size="small"
                label="Paid Status"
                value={paidStatus}
                fullWidth
                onChange={(e) => {
                  setPaidStatus(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Paid</MenuItem>
                <MenuItem value="false">Unpaid</MenuItem>
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
      <Card sx={{ marginTop: 4 }}>
        <SmartTable
          rows={purchaseInvoices.map((purchase) => ({
            id: purchase.id,
            date: moment(purchase.date).format("YYYY-MM-DD"),
            supplier: purchase.Supplier.name,
            totalPrice: purchase.totalPrice,
            paid: purchase.paid,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message="Deleting this purchase will also delete any related details."
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Purchase"
      />
    </Box>
  );
};

export default PurchaseInvoiceIndex;
