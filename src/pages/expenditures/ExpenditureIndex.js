import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
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

const ExpenditureIndex = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [expenses, setExpenses] = useState([]);

  // creating expenditure
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [amount, setAmount] = useState(0);
  const [qty, setQty] = useState(0);
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState("");
  const [deliveryId, setDeliveryId] = useState("");

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/expenditures/${id}`);
        setExpenditures((expenditures) =>
          expenditures.filter((purchase) => purchase.id !== id)
        );
        toast.success("Expenditure deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setExpenses((await http.get("/expenses")).data.data);
      setExpenditures((await http.get("/expenditures")).data.data);
    })();
  }, []);

  const handlePay = async (id) => {
    try {
      const expenditure = (await http.patch(`/expenditures/${id}/pay`)).data
        .data;
      toast.success(`Updated expenditure #${expenditure.id}`, {
        autoClose: 500,
      });
      setExpenditures((prev) =>
        prev.map((exp) => {
          if (exp.id === id) return { ...exp, paid: expenditure.paid };
          return exp;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedExpense) throw new Error("Please select an expense.");
      if (!qty) throw new Error("Quantity can't be empty or zero.");
      if (!date) throw new Error("Please select a date.");
      if (!amount) throw new Error("Please set an amount.");

      if (!!deliveryId) {
        try {
          const delivery = (await http.get(`/rs/deliveries/${deliveryId}`)).data
            .data;
        } catch (error) {
          throw new Error(`Delivery of ID ${deliveryId} doesn't exist.`);
        }
      }

      const body = {
        date,
        description,
        paid: false,
        amount,
        qty,
        unit,
        ExpenseId: selectedExpense.id,
        DeliveryId: !!deliveryId ? deliveryId : null,
      };
      await http.post("/expenditures", body);
      toast.success("Created expenditure.");
      setDate("");
      setAmount(0);
      setQty(0);
      setSelectedExpense(null);
      setDescription("");
      setUnit("");
      setDeliveryId("");
      setExpenditures((await http.get("/expenditures")).data.data);
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "expenseName", headerName: "Expense", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,

      renderCell: (params) => <NumericFormatRp value={params.row.amount} />,
    },
    { field: "unit", headerName: "Unit", width: 50 },
    { field: "qty", headerName: "Qty", width: 50 },
    {
      field: "totalAmount",
      headerName: "Total",
      width: 100,
      renderCell: (params) => (
        <NumericFormatRp value={params.row.totalAmount} />
      ),
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
              to={`/expenditures/${params.row.id}`}
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
      <Box mb={2}>
        <Stack gap={2}>
          <Typography fontSize={24}>Record Expenditure</Typography>
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
            <Grid item xs={4}>
              <Autocomplete
                value={selectedExpense}
                onChange={(e, newValue) => {
                  setSelectedExpense(newValue);
                  if (newValue) {
                    setAmount(newValue.amount);
                    setUnit(newValue.unit);
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                options={expenses}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={5}>
              <AutoSelectTextField
                margin="none"
                inputProps={{ tabIndex: -1 }}
                label="Description"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <AutoSelectTextField
                margin="none"
                inputProps={{ tabIndex: -1 }}
                label="Unit"
                fullWidth
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </Grid>

            <Grid item xs={5}>
              <AutoSelectTextField
                margin="none"
                type="number"
                inputProps={{ tabIndex: -1 }}
                label="Amount"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <AutoSelectTextField
                margin="none"
                type="number"
                inputProps={{ tabIndex: -1 }}
                label="Qty"
                fullWidth
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <AutoSelectTextField
                margin="none"
                type="number"
                label="Delivery ID"
                fullWidth
                value={deliveryId}
                onChange={(e) => setDeliveryId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleSubmit}>
                Record
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Box>
      <Card>
        <SmartTable
          rows={expenditures.map((expenditure) => ({
            id: expenditure.id,
            date: moment(expenditure.date).format("DD-MM-YYYY"),
            expenseName: expenditure.Expense.name,
            description: expenditure.description,
            amount: expenditure.amount,
            unit: expenditure.unit,
            qty: expenditure.qty,
            totalAmount: expenditure.totalAmount,
            paid: expenditure.paid,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message="Deleting this expenditure will also delete any related details."
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Purchase"
      />
    </Box>
  );
};

export default ExpenditureIndex;
