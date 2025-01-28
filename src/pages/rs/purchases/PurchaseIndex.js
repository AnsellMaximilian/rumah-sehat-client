import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import LinkOff from "@mui/icons-material/LinkOff";
import ReceiptIcon from "@mui/icons-material/Receipt";

import moment from "moment";
import DeleteAlert from "../../../components/DeleteAlert";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { formQueryParams, getWeek } from "../../../helpers/common";

const PurchaseIndex = () => {
  const [purchases, setPurchases] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

  // Filters
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [filterId, setFilterId] = useState("");
  const [purchaseInvoiceId, setPurchaseInvoiceId] = useState("");
  const [invoiceStartDate, setInvoiceStartDate] = useState("");
  const [invoiceEndDate, setInvoiceEndDate] = useState("");
  const [deliveriesStartDate, setDeliveriesStartDate] = useState("");
  const [deliveriesEndDate, setDeliveriesEndDate] = useState("");
  const [paidStatus, setPaidStatus] = useState("all");
  const [isInvoicedStatus, setIsInvoicedStatus] = useState("all");

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/purchases/${id}`);
        setPurchases((purchases) =>
          purchases.filter((purchase) => purchase.id !== id)
        );
        toast.success("Purchase deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleUnlink = (id) => {
    (async () => {
      try {
        await http.post(`/rs/purchases/${id}/unlink`);
        setPurchases((purchases) =>
          purchases.map((purchase) => {
            if (purchase.id === id) {
              return {
                ...purchase,
                PurchaseInvoiceId: null,
                PurchaseInvoice: null,
              };
            }
            return purchase;
          })
        );
        toast.success("Purchase unlinked from invoice.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setPurchases((await http.get("/rs/purchases")).data.data);
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
    setIsInvoicedStatus("all");
    setPurchaseInvoiceId("");

    setPurchases((await http.get("/rs/purchases")).data.data);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      SupplierId: selectedSupplier ? selectedSupplier.id : undefined,
      startDate: deliveriesStartDate,
      endDate: deliveriesEndDate,
      invoiceStartDate,
      invoiceEndDate,
      filterId,
      purchaseInvoiceId,
      paid: paidStatus === "all" ? undefined : paidStatus,

      invoiced: isInvoicedStatus === "all" ? undefined : isInvoicedStatus,
    });

    setPurchases((await http.get(`/rs/purchases?${queryParams}`)).data.data);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "supplier", headerName: "Supplier", width: 100 },
    {
      field: "subtotalPrice",
      headerName: "Subtotal",
      width: 100,
      renderCell: (params) => (
        <NumericFormatRp value={params.row.subtotalPrice} />
      ),
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.cost} />,
    },
    {
      field: "totalPrice",
      headerName: "Total",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
    },

    {
      field: "totalDesignatedSales",
      headerName: "Des. Sales",
      width: 100,
    },

    {
      field: "paid",
      headerName: "Paid",
      width: 100,
      renderCell: (params) =>
        params.row.paid ? (
          <Chip label="Paid" size="small" color="success" variant="contained" />
        ) : (
          <Chip label="Unpaid" size="small" color="error" variant="contained" />
        ),
    },
    {
      field: "invoice",
      headerName: "Invoice",
      width: 100,
      renderCell: (params) =>
        params.row.invoice ? (
          <>
            <IconButton
              color="primary"
              component={Link}
              to={`/rs/purchase-invoices/${params.row.invoice.id}`}
            >
              <ReceiptIcon />
            </IconButton>
            <IconButton
              color="warning"
              onClick={() => handleUnlink(params.row.id)}
            >
              <LinkOff />
            </IconButton>
          </>
        ) : (
          <span>None</span>
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
              to={`/rs/purchases/edit/${params.row.id}`}
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
              to={`/rs/purchases/${params.row.id}`}
            >
              <ShowIcon />
            </IconButton>
            <IconButton
              disabled={!!!params.row.delivery}
              component={Link}
              to={`/rs/deliveries/${params.row.delivery?.id}`}
            >
              <LocalShippingIcon />
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
          to={"/rs/purchases/create"}
        >
          New Purchase
        </Button>
        <Button variant="outlined" component={Link} to={"/rs/purchases/create"}>
          Manage Purchase Invoices
        </Button>
      </Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Divider>
          <Chip label="Purchase" />
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
          <Grid item xs={2}>
            <TextField
              fullWidth
              label="Purchase Invoice ID"
              size="small"
              type="number"
              value={purchaseInvoiceId}
              onChange={(e) => setPurchaseInvoiceId(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
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

          <Grid item xs={2}>
            <FormControl margin="none" fullWidth>
              <InputLabel id="demo-simple-select-label">Invoiced</InputLabel>
              <Select
                size="small"
                label="Invoiced"
                value={isInvoicedStatus}
                fullWidth
                onChange={(e) => {
                  setIsInvoicedStatus(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Invoiced</MenuItem>
                <MenuItem value="false">Uninvoiced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

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

        <Divider>
          <Chip label="Invoice" />
        </Divider>
        <Grid spacing={2} container marginTop={1}>
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
          rows={purchases.map((purchase) => ({
            id: purchase.id,
            date: moment(purchase.date).format("YYYY-MM-DD"),
            supplier: purchase.Supplier.name,
            totalPrice: purchase.totalPrice,
            subtotalPrice: purchase.subtotalPrice,
            cost: purchase.cost,
            totalDesignatedSales: purchase.totalDesignatedSales,
            delivery: purchase.Delivery,
            invoice: purchase.PurchaseInvoice,
            paid: !!purchase.PurchaseInvoice?.paid,
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

export default PurchaseIndex;
