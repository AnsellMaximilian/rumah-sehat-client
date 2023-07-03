import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Fab from "@mui/material/Fab";
import Cancel from "@mui/icons-material/Cancel";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import http from "../../http-common";
import moment from "moment";
import { getExpenditureSubtotal } from "../../helpers/rs";
import NumericFormatRp from "../../components/NumericFormatRp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AutoSelectTextField from "../../components/AutoSelectTextField";

export default function ExpenditureCreate({ edit }) {
  // Invoice details
  const [date, setDate] = useState(moment().format("yyyy-MM-DD"));
  const [note, setNote] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(0);

  const { id } = useParams();
  const [expenseDetails, setExpenseDetails] = useState([]);

  const [expenses, setExpenses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setExpenses((await http.get("/expenses")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const expenditure = edit
        ? (await http.get(`/expenditures/${id}`)).data.data
        : null;

      if (edit) {
        if (expenses.length > 0) {
          setNote(expenditure.note || "");
          setDate(moment(expenditure.date).format("yyyy-MM-DD"));
          setDeliveryCost(expenditure.deliveryCost);

          setExpenseDetails(
            expenditure.ExpenseDetails.map((detail) => {
              const expense = expenses.find(
                (expense) => expense.id === detail.ExpenseId
              );

              return {
                key: uuidv4(),
                amount: detail.amount,
                unit: detail.unit,
                qty: detail.qty,
                expense: expense,
                search: "",
              };
            })
          );
        }
      }
    })();
  }, [edit, id, expenses]);

  const handleAddExpenseDetail = () => {
    const expense = expenses[0];
    setExpenseDetails((prev) => {
      return [
        ...prev,
        {
          key: uuidv4(),
          amount: expense.amount,
          qty: 0,
          expense: expense,
          search: "",
        },
      ];
    });
  };

  const handleChangeExpenseDetail = (attr, detailKey) => (e) => {
    setExpenseDetails((prev) => {
      return prev.map((detail) => {
        if (detail.key === detailKey)
          return {
            ...detail,
            [attr]: e.target.value,
          };
        return detail;
      });
    });
  };

  const handleRemoveDetail = (detailKey) => () =>
    setExpenseDetails((prev) =>
      prev.filter((detail) => detail.key !== detailKey)
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        deliveryCost: deliveryCost,
        note: note,
        expenseDetails: expenseDetails.map((detail) => {
          const { qty, amount, expense, unit } = detail;

          if (expense === null) throw new Error("Select an expense");
          return {
            qty,
            amount,
            unit,
            ExpenseId: expense.id,
          };
        }),
        date: moment(date).format("YYYY-MM-DD"),
      };
      if (!edit) {
        await http.post("/expenditures", body);
        toast.success("Created expenditure.");
        navigate("/expenditures");
      } else {
        await http.patch(`/expenditures/${id}`, body);
        toast.success("Updated expenditure.");
        navigate(`/expenditures`);
      }
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return expenses.length > 0 ? (
    <Box paddingBottom={10}>
      <Box display="flex" gap={2} alignItems="stretch">
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <AutoSelectTextField
            margin="none"
            label="Delivery Cost"
            type="number"
            value={deliveryCost}
            onChange={(e) => setDeliveryCost(e.target.value)}
          />
        </Box>
        <Box>
          <TextField
            multiline
            margin="none"
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={7.25}
          />
        </Box>
      </Box>
      <Box marginTop={2}>
        <Box display="flex" gap={1}>
          <Box
            sx={{ backgroundColor: "primary.dark", color: "white" }}
            padding={1}
            flex={1}
          >
            Expenses
          </Box>
          <Button
            variant="contained"
            sx={{ boxShadow: "none" }}
            onClick={handleAddExpenseDetail}
          >
            Add Row
          </Button>
        </Box>
      </Box>
      <Box>
        <TableContainer sx={{ marginTop: 1 }}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell align="left">Expense</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenseDetails.map((detail) => (
                <TableRow
                  key={detail.key}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <IconButton
                      onClick={handleRemoveDetail(detail.key)}
                      tabIndex={-1}
                    >
                      <Cancel color="error" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="left">
                    <Autocomplete
                      value={detail.expense}
                      onInputChange={(e, newValue) => {
                        setExpenseDetails((prev) => {
                          return prev.map((currentDetail) => {
                            if (currentDetail.key === detail.key) {
                              return {
                                ...detail,
                                search: newValue,
                              };
                            }
                            return currentDetail;
                          });
                        });
                      }}
                      onChange={(event, newValue) => {
                        setExpenseDetails((prev) => {
                          return prev.map((currentDetail) => {
                            if (currentDetail.key === detail.key) {
                              return newValue
                                ? {
                                    ...detail,
                                    expense: newValue,
                                    amount: newValue.amount,
                                  }
                                : {
                                    ...detail,
                                    expense: newValue,
                                  };
                            }
                            return currentDetail;
                          });
                        });
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
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <TextField
                      size="small"
                      margin="none"
                      variant="standard"
                      type="number"
                      inputProps={{ tabIndex: -1 }}
                      value={detail.amount}
                      onChange={handleChangeExpenseDetail("amount", detail.key)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <AutoSelectTextField
                      size="small"
                      margin="none"
                      variant="standard"
                      sx={{ width: 75 }}
                      type="number"
                      value={detail.qty}
                      onChange={handleChangeExpenseDetail("qty", detail.key)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={detail.amount * detail.qty} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Subtotal
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp
                    value={getExpenditureSubtotal(expenseDetails)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Delivery Cost
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp value={parseInt(deliveryCost)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Total
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp
                    value={
                      getExpenditureSubtotal(expenseDetails) +
                      parseInt(deliveryCost)
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ position: "absolute", right: 20, bottom: 20 }}>
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          onClick={handleSubmit}
        >
          {edit ? "Update" : "Create"}
        </Fab>
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
}
