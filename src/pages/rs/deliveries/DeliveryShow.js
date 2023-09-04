import Box from "@mui/material/Box";
import Delete from "@mui/icons-material/Delete";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";

import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NumericFormatRp from "../../../components/NumericFormatRp";
import http from "../../../http-common";
import PrintIcon from "@mui/icons-material/Print";
import DeliveryDisplay from "../../../components/rs/DeliveryDisplay";
import { getTableColumn } from "../../../helpers/rs";
import { toast } from "react-toastify";
import DeleteAlert from "../../../components/DeleteAlert";
import { Dialog } from "@mui/material";
import AdjustmentForm from "../../../components/rs/AdjustmentForm";
import InvoiceDisplay from "../invoices/InvoiceDisplay";
import AutoSelectTextField from "../../../components/AutoSelectTextField";
import SmartTable from "../../../components/SmartTable";
import moment from "moment";

const DeliveryShow = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [switchFormOpen, setSwitchFormOpen] = useState(false);

  const [draftInvoices, setDraftInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Delivery Expenses
  const [expenses, setExpenses] = useState([]);
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState(0);
  const [expenseDetails, setExpenseDetails] = useState([]);

  const [deliveryExpenses, setdeliveryExpenses] = useState([]);
  const [toDeleteDeliveryExpenseId, settoDeleteDeliveryExpenseId] =
    useState(null);

  const handleSwitchFormClose = () => setSwitchFormOpen(false);
  const handleExpenseFormClose = () => setExpenseFormOpen(false);

  const handleDeleteExpense = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/delivery-expenses/${id}`);
        setdeliveryExpenses((ex) => ex.filter((ex) => ex.id !== id));
        toast.success("Expense deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setDelivery((await http.get(`/rs/deliveries/${id}`)).data.data);
      setDraftInvoices((await http.get("/rs/invoices?status=draft")).data.data);
      setExpenses((await http.get("/expenses")).data.data);
      setdeliveryExpenses(
        (await http.get(`/rs/delivery-expenses?deliveryId=${id}`)).data.data
      );
    })();
  }, [id]);

  useEffect(() => {
    if (delivery && delivery.Invoice) setSelectedInvoice(delivery.Invoice);
    if (delivery) {
      setExpenseDetails(
        delivery.DeliveryDetails.map((d) => ({ ...d, selected: false }))
      );
    }
  }, [delivery]);

  const switchInvoice = async () => {
    try {
      if (!selectedInvoice) throw new Error("Please select invoice.");
      const res = (
        await http.patch(`/rs/deliveries/${id}/switch-invoice`, {
          InvoiceId: selectedInvoice.id,
        })
      ).data.data;
      setDelivery((await http.get(`/rs/deliveries/${id}`)).data.data);

      if (res) toast.success("Switched invoice.");
      handleSwitchFormClose();
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  const handleAddExpense = async () => {
    try {
      if (!selectedExpense) throw new Error("Please select an expense.");
      if (!qty) throw new Error("Quantity can't be empty or zero.");
      if (!unit) throw new Error("Unit can't be empty or zero.");
      if (!amount) throw new Error("Please set an amount.");
      const selectedDetails = expenseDetails.filter((det) => det.selected);

      if (selectedDetails.length <= 0)
        throw new Error("Please select at least 1 detail.");

      const body = {
        ExpenseId: selectedExpense.id,
        qty,
        amount,
        unit,
        detailIds: selectedDetails.map((det) => det.id),
      };
      const res = (await http.post(`/rs/delivery-expenses/`, body)).data.data;

      if (res) toast.success("Added expense.");
      setdeliveryExpenses(
        (await http.get(`/rs/delivery-expenses?deliveryId=${id}`)).data.data
      );
      setAmount(0);
      setUnit("");
      setSelectedExpense(null);
      setQty(0);
      handleExpenseFormClose();
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  const expenseColumns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "expense", headerName: "Expense", width: 150 },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,

      renderCell: (params) => <NumericFormatRp value={params.row.amount} />,
    },
    {
      field: "qty",
      headerName: "Qty",
      width: 150,
    },
    {
      field: "total",
      headerName: "Total",
      width: 150,
      renderCell: (params) => (
        <NumericFormatRp value={params.row.totalAmount} />
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
                settoDeleteDeliveryExpenseId(params.row.id);
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

  return delivery ? (
    <Box marginBottom={4}>
      <Box display="flex" justifyContent="flex-end" marginBottom={1} gap={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setExpenseFormOpen(true)}
        >
          Add Expenses
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSwitchFormOpen(true)}
        >
          Switch Invoice
        </Button>
      </Box>
      <DeliveryDisplay delivery={delivery} />
      <Box mt={2}>
        <Card sx={{ padding: 2 }}>
          <Box>Delivery Expenses</Box>
          <SmartTable
            rows={deliveryExpenses.map((ex) => ({
              id: ex.id,
              expense: ex.Expense?.name,
              amount: ex.amount,
              qty: ex.qty,
              totalAmount: ex.totalAmount,
            }))}
            columns={expenseColumns}
          />
        </Card>
      </Box>
      <Divider sx={{ marginTop: 2 }}>
        <Chip label="Invoice" />
      </Divider>
      <Card sx={{ padding: 2, marginTop: 2 }}>
        <InvoiceDisplay invoice={delivery.Invoice} />
      </Card>
      <Dialog
        open={switchFormOpen}
        onClose={handleSwitchFormClose}
        maxWidth="xl"
      >
        {draftInvoices.length > 0 ? (
          delivery.Invoice && delivery.Invoice.status !== "draft" ? (
            <h1>Source invoice has to be a draft.</h1>
          ) : (
            <Box componen={Paper} padding={2}>
              <Box display="flex" gap={2}>
                <Autocomplete
                  value={selectedInvoice}
                  onChange={(e, newValue) => {
                    setSelectedInvoice(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.id} - {option.customerFullName}
                    </li>
                  )}
                  getOptionLabel={(option) =>
                    `(#${option.id}) ${option.customerFullName}`
                  }
                  options={draftInvoices}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ width: 300 }}
                      label="Invoice"
                    />
                  )}
                />
                <Button variant="contained" onClick={switchInvoice}>
                  Switch
                </Button>
              </Box>
            </Box>
          )
        ) : (
          <h1>Loading draft invoices...</h1>
        )}
      </Dialog>
      <Dialog
        open={expenseFormOpen}
        onClose={handleExpenseFormClose}
        maxWidth="xl"
      >
        {expenses.length > 0 ? (
          <Box componen={Paper} padding={2}>
            <Box display="flex" gap={2}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Autocomplete
                    value={selectedExpense}
                    onChange={(e, newValue) => {
                      setSelectedExpense(newValue);
                      if (newValue) {
                        setAmount(newValue.amount);
                        setUnit(newValue.unit);
                      }
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    options={expenses}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label="Expense" />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <AutoSelectTextField
                    margin="none"
                    inputProps={{ tabIndex: -1 }}
                    label="Unit"
                    fullWidth
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </Grid>

                <Grid item xs={3}>
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
                <Grid item xs={12}>
                  <TableContainer sx={{ marginTop: 1 }}>
                    <Table sx={{ minWidth: 650 }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Actions</TableCell>
                          <TableCell>Delivery ID</TableCell>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Qty</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {expenseDetails.map((detail) => (
                          <TableRow
                            key={detail.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(e) =>
                                        setExpenseDetails((prev) =>
                                          prev.map((det) => {
                                            if (det.id === detail.id) {
                                              return {
                                                ...det,
                                                selected: !det.selected,
                                              };
                                            } else {
                                              return det;
                                            }
                                          })
                                        )
                                      }
                                      checked={detail.selected}
                                    />
                                  }
                                  label="Include"
                                />
                              </FormGroup>
                            </TableCell>
                            <TableCell>{detail.id}</TableCell>
                            <TableCell align="left">
                              {detail.Product.name}
                            </TableCell>
                            <TableCell align="right">{detail.qty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAddExpense}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        ) : (
          <h1>Loading Expenses...</h1>
        )}
      </Dialog>
      <DeleteAlert
        message="Deleting this expense will also delete any related details."
        toDeleteId={toDeleteDeliveryExpenseId}
        handleDelete={handleDeleteExpense}
        setToDeleteId={settoDeleteDeliveryExpenseId}
        objectName="Delivery Expense"
      />
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default DeliveryShow;
