import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import DeleteAlert from "../../../components/DeleteAlert";
import Delete from "@mui/icons-material/Delete";
import { formQueryParams, getWeek } from "../../../helpers/common";

const DeliveryIndex = () => {
  const [deliveries, setDeliveries] = useState([]);

  const [toDeleteId, setToDeleteId] = useState(null);

  // FILTERS
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/deliveries/${id}`);
        setDeliveries((deliveries) =>
          deliveries.filter((delivery) => delivery.id !== id)
        );
        toast.success("Delivery deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, []);

  const handleSetWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleClearFilter = async () => {
    setStartDate("");
    setEndDate("");
    setSelectedCustomer(null);

    // setDeliveries((await http.get("/rs/deliveries")).data.data);
    setDeliveries([]);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      startDate,
      endDate,
      CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
    });
    // console.log(queryParams);
    setDeliveries((await http.get(`/rs/deliveries?${queryParams}`)).data.data);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "customer", headerName: "Customer", width: 100 },
    { field: "deliveryType", headerName: "Type", width: 100 },
    {
      field: "cost",
      headerName: "Delivery Cost",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.cost} />,
    },
    {
      field: "totalPrice",
      headerName: "Total (Rp)",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
    },
    {
      field: "invoice",
      headerName: "Invoice",
      width: 100,
      renderCell: (params) =>
        params.row.invoice ? (
          <IconButton
            color="primary"
            component={Link}
            to={`/rs/invoices/${params.row.invoice.id}`}
          >
            <ReceiptIcon />
          </IconButton>
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
              to={`/rs/deliveries/${params.row.id}`}
              color="primary"
            >
              <ShowIcon />
            </IconButton>
            <IconButton
              disabled={!!!params.row.purchase}
              color="warning"
              component={Link}
              to={`/rs/purchases/${params.row.purchase?.id}`}
            >
              <ShoppingCart />
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
        <Button
          variant="contained"
          component={Link}
          to={"/rs/deliveries/create"}
        >
          New Delivery
        </Button>
      </Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={12}>
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
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              value={startDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              size="small"
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
              <Button variant="outlined" fullWidth onClick={handleSetWeek}>
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
          rows={deliveries.map((delivery) => ({
            id: delivery.id,
            cost: delivery.cost,
            deliveryType: delivery.DeliveryType.name,
            date: delivery.date,
            customer: delivery.Customer.fullName,
            totalPrice: delivery.totalPrice,
            invoice: delivery.Invoice,
            purchase: delivery.Purchase,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={`Are you sure you want to delete delivery #${toDeleteId} and its details.`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Delivery"
      />
    </Box>
  );
};

export default DeliveryIndex;
