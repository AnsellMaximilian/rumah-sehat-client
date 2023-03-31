import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import http from "../../../../http-common";
import SmartTable from "../../../../components/SmartTable";
import NumericFormatRp from "../../../../components/NumericFormatRp";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import { toast } from "react-toastify";
import DeleteAlert from "../../../../components/DeleteAlert";
import { formQueryParams, getWeek } from "../../../../helpers/common";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";

const DrSgDeliveryIndex = () => {
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
        await http.delete(`/dr/sg/deliveries/${id}`);
        setDeliveries((deliveries) =>
          deliveries.filter((delivery) => delivery.id !== id)
        );
        toast.success("Deleted delivery.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setDeliveries((await http.get("/dr/sg/deliveries")).data.data);
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

    setDeliveries((await http.get("/dr/sg/deliveries")).data.data);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      startDate,
      endDate,
      CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
    });
    setDeliveries(
      (await http.get(`/dr/sg/deliveries?${queryParams}`)).data.data
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "customer", headerName: "Customer", width: 100 },
    { field: "cost", headerName: "Delivery Cost", width: 100 },
    {
      field: "discount",
      headerName: "Discount",
      width: 120,
      renderCell: (params) =>
        params.row.totalDiscount ? (
          <NumericFormatRp value={params.row.totalDiscount} />
        ) : (
          "No"
        ),
    },
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
              to={`/dr/sg/deliveries/${params.row.id}`}
              color="primary"
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
        <Button
          variant="contained"
          component={Link}
          to={"/dr/sg/deliveries/create"}
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
            date: delivery.date,
            customer: delivery.Customer.fullName,
            totalDiscount: delivery.totalDiscount,
            totalPriceRP: delivery.totalPriceRP,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={`Are you sure you want to delete SG delivery #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Delivery"
      />
    </Box>
  );
};

export default DrSgDeliveryIndex;
