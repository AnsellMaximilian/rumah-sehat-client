import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import {
  Autocomplete,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import http from "../../http-common";
import SmartTable from "../../components/SmartTable";
import NumericFormatRp from "../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import moment from "moment";
import DeleteAlert from "../../components/DeleteAlert";
import PayIcon from "@mui/icons-material/Paid";
import AutoSelectTextField from "../../components/AutoSelectTextField";
import { TRANSACTIONS } from "../../const";
import CustomDialog from "../../components/Dialog";
import { formQueryParams, getWeek } from "../../helpers/common";

const DeliveryTransactionIndex = () => {
  const [transactions, setTransactions] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);

  // deliveries
  const [deliveries, setDeliveries] = useState([]);

  // creating transaction
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  // filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [avaliableBalance, setAvaliableBalance] = useState(0);

  useEffect(() => {
    (async () => {
      const balance = (await http.get("/transactions/delivery-balance")).data
        .data;

      setAvaliableBalance(parseFloat(balance));
    })();
  }, []);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/transactions/${id}`);
        setTransactions((transactions) =>
          transactions.filter((purchase) => purchase.id !== id)
        );
        toast.success("Transaction deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleClearFilter = async () => {
    setStartDate("");
    setEndDate("");

    refreshMetaData();
  };

  const handleFilter = async () => {
    const transactionQueryParams = formQueryParams({
      startDate,
      endDate,
      category: TRANSACTIONS.SITI_DELIVERY,
    });

    const deliveriesQueryParams = formQueryParams({
      startDate,
      endDate,
      DeliveryTypeIds: `16,17,18,19`,
    });

    setTransactions(
      (await http.get(`/transactions?${transactionQueryParams}`)).data.data
    );
    setDeliveries(
      (await http.get(`/rs/deliveries?${deliveriesQueryParams}`)).data.data
    );
  };

  const refreshMetaData = async () => {
    setPurchaseInvoices(
      (await http.get("/rs/purchase-invoices?paid=false")).data.data
    );
    setTransactions([]);
  };

  const handleSetWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleSubmit = async () => {
    try {
      if (!date) throw new Error("Please select a date.");

      const body = {
        date,
        description,
        amount,
        PurchaseInvoiceId: selectedPurchaseInvoice
          ? selectedPurchaseInvoice.id
          : null,
        category: TRANSACTIONS.SITI_DELIVERY,
      };
      await http.post("/transactions", body);
      toast.success("Created transaction.");
      setDate("");
      setAmount(0);
      setSelectedPurchaseInvoice(null);
      setDescription("");

      handleFilter();
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    } finally {
      setIsCreateFormOpen(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,

      renderCell: (params) => <NumericFormatRp value={params.row.amount} />,
    },
    {
      field: "PurchaseInvoiceId",
      headerName: "Purchase Invoice",
      width: 150,
      renderCell: ({ value, row }) => (
        <Typography>
          {value ? (
            <Link to={`/rs/purchase-invoices/${value}`}>{value}</Link>
          ) : (
            "None"
          )}
          {row.Supplier ? ` - ${row.Supplier.name}` : ""}
        </Typography>
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
          </>
        );
      },
      width: 200,
    },
  ];

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>

        <Grid spacing={2} container marginTop={1}>
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

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Stack>
          <Typography>Available Balance</Typography>
          <Typography fontWeight="bold" fontSize={24}>
            <NumericFormatRp value={avaliableBalance} />
          </Typography>
        </Stack>
        <Button variant="contained" onClick={() => setIsCreateFormOpen(true)}>
          Record
        </Button>
      </Stack>
      <Card>
        <SmartTable
          rows={transactions.map((transaction) => ({
            id: transaction.id,
            date: moment(transaction.date).format("YYYY-MM-DD"),
            type: transaction.type,
            description: transaction.description,
            amount: transaction.amount,
            PurchaseInvoiceId: transaction.PurchaseInvoiceId,
            Supplier: transaction.PurchaseInvoiceId
              ? transaction.PurchaseInvoice.Supplier
              : undefined,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message="Deleting this transaction will also delete any related details."
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Transaction"
      />

      <CustomDialog
        open={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        action={handleSubmit}
        title="Record Transaction"
        description="Create a transaction for delivery"
        actionLabel="Record"
        maxWidth="md"
      >
        <Box>
          <Stack gap={2}>
            <Typography fontSize={24}>Record Transaction</Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  label="Date"
                  type="date"
                  value={date}
                  fullWidth
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={3}>
                <AutoSelectTextField
                  margin="none"
                  label="Description"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <AutoSelectTextField
                  margin="none"
                  type="number"
                  label="Amount"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  value={selectedPurchaseInvoice}
                  onChange={(e, newValue) => {
                    setSelectedPurchaseInvoice(newValue);
                    if (newValue) {
                      setAmount(-newValue.totalPrice);
                      setDescription(
                        `Purchase invoice #${newValue.id} payment`
                      );
                    }
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={(option) =>
                    `#${option.id} - ${option.Supplier?.name}`
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      #{option.id} - {option.Supplier?.name} -{" "}
                      <NumericFormatRp value={option.totalPrice} />
                    </li>
                  )}
                  options={purchaseInvoices}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label="Purchase Invoice" />
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </CustomDialog>
    </Box>
  );
};

export default DeliveryTransactionIndex;
