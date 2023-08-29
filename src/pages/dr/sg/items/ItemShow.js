import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import http from "../../../../http-common";
import Delete from "@mui/icons-material/Delete";

import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";

import AutoSelectTextField from "../../../../components/AutoSelectTextField";
import SmartTable from "../../../../components/SmartTable";
import DeleteAlert from "../../../../components/DeleteAlert";
import { Autocomplete, Dialog } from "@mui/material";

export default function DrSgItemShow() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [stock, setStock] = useState(0);
  const [loans, setLoans] = useState([]);

  const [itemHistory, setItemHistory] = useState(null);

  const [customers, setCustomers] = useState([]);

  // Adjustments
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustDate, setAdjustDate] = useState("");
  const [adjustDescription, setAdjustDescription] = useState("");

  // Loans
  const [selectedLoaner, setSelectedLoaner] = useState(null);
  const [lendType, setLendType] = useState("lend");
  const [lendQty, setLendQty] = useState(0);
  const [lendNotes, setLendNotes] = useState("");
  const [lendDate, setLendDate] = useState("");
  const [toDeleteLoanId, setToDeleteLoanId] = useState(null);

  // returns
  const [returnDate, setReturnDate] = useState("");
  const [selectedReturnLoan, setSelectedReturnLoan] = useState(null);

  const refreshMetaData = useCallback(() => {
    (async () => {
      setStock((await http.get(`/dr/sg/items/${id}/stock`)).data.data);
      setLoans((await http.get(`/dr/sg/loans?DrSgItemId=${id}`)).data.data);
      if (item.keepStockSince) {
        const his = (await http.get(`/dr/sg/items/${id}/history`)).data.data;
        setItemHistory(his);
      }
    })();
  }, [item, id]);

  const handleAdjust = async () => {
    try {
      if (!adjustDate) throw new Error("Date can't be empty");
      const body = {
        amount: adjustAmount,
        date: adjustDate,
        description: adjustDescription ? adjustDescription : null,
      };
      const adjust = (await http.post(`/dr/sg/items/${id}/adjust-stock`, body))
        .data.data;
      refreshMetaData();
      setAdjustAmount(0);
      setAdjustDate("");
      setAdjustDescription("");
      toast.success(`Succesfully adjusted ${adjust.amount}`);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
  };

  const handleLend = async () => {
    try {
      if (!lendDate) throw new Error("Date can't be empty");
      if (!selectedLoaner) throw new Error("Customer can't be empty");
      const body = {
        date: lendDate,
        qty: lendQty,
        lendType: lendType,
        CustomerId: selectedLoaner.id,
        DrSgItemId: id,
        note: lendNotes ? lendNotes : null,
      };
      const lend = (await http.post(`/dr/sg/loans`, body)).data.data;
      refreshMetaData();
      setLendQty(0);
      setLendDate("");
      setLendNotes("");
      toast.success(`Succesfully lent/borrowed ${lend.qty}`);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
  };

  const handleDeleteLoan = (id) => {
    (async () => {
      try {
        await http.delete(`/dr/sg/loans/${id}`);
        refreshMetaData();
        toast.success("Loan deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      const item = (await http.get(`/dr/sg/items/${id}`)).data.data;
      setItem(item);

      const customers = (await http.get(`/customers`)).data.data;
      setCustomers(customers);
      setStock((await http.get(`/dr/sg/items/${id}/stock`)).data.data);
      setLoans((await http.get(`/dr/sg/loans?DrSgItemId=${id}`)).data.data);

      if (item.keepStockSince) {
        const his = (await http.get(`/dr/sg/items/${id}/history`)).data.data;
        setItemHistory(his);
      }
    })();
  }, [id]);

  const handleReturn = async () => {
    try {
      if (!returnDate) throw new Error("Please choose return date.");
      if (!selectedReturnLoan) throw new Error("Please select loan to return.");
      await http.patch(`/dr/sg/loans/${selectedReturnLoan.id}/return`, {
        returnDate: returnDate,
      });
      refreshMetaData();
      setReturnDate("");
      setSelectedReturnLoan(null);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
  };

  const historyColumns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 125 },
      { field: "date", headerName: "Date", width: 125 },
      {
        field: "flow",
        headerName: "Flow",
        width: 130,
        renderCell: (params) => {
          return (
            <Typography
              color={params.row.flow === "IN" ? "success.main" : "error.main"}
              fontWeight="bold"
            >
              {params.row.flow}
            </Typography>
          );
        },
      },
      {
        field: "type",
        headerName: "Type",
        width: 130,
        renderCell: (params) => {
          return params.row.type === "DRAW" ? (
            <Typography>{params.row.type}</Typography>
          ) : (
            <Link
              color="primary"
              component={RouterLink}
              to={
                params.row.type === "PURCHASE"
                  ? `/rs/purchases/${params.row.parentId}`
                  : `/rs/deliveries/${params.row.parentId}`
              }
              underline="hover"
            >
              {params.row.type}
            </Link>
          );
        },
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 100,
        renderCell: (params) => {
          return (
            <Typography
              color={params.row.flow === "IN" ? "success.main" : "error.main"}
              fontWeight="bold"
            >
              {Math.abs(parseFloat(params.row.amount))}
            </Typography>
          );
        },
      },
      {
        field: "description",
        headerName: "Description",
        width: 250,
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => {
          return <></>;
        },
        width: 200,
      },
    ],
    []
  );
  const lendColumns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 25 },
      { field: "date", headerName: "Date", width: 125 },
      {
        field: "lendType",
        headerName: "Type",
        width: 130,
      },
      {
        field: "customer",
        headerName: "Customer",
        width: 130,
      },
      {
        field: "qty",
        headerName: "Qty",
        width: 25,
      },
      {
        field: "returned",
        headerName: "Returned",
        renderCell: (params) => {
          return params.row.isReturned && params.row.returnDate ? (
            <Typography>{params.row.returnDate}</Typography>
          ) : (
            <Button
              size="small"
              variant="contained"
              sx={{ fontSize: 10 }}
              onClick={() => setSelectedReturnLoan(params.row.loanItem)}
            >
              Return
            </Button>
          );
        },
        width: 200,
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
                  setToDeleteLoanId(params.row.id);
                }}
              >
                <Delete />
              </IconButton>
            </>
          );
        },
        width: 200,
      },
    ],
    []
  );

  const itemHistoryOrganized = useMemo(() => {
    if (!itemHistory) return null;
    const deliveries = itemHistory.deliveryDetails.map((det) => ({
      id: `out-${det.id}`,
      parentId: det.DrSgDelivery.id,
      flow: "OUT",
      type: "SALE",
      amount: det.qty,
      date: det.DrSgDelivery.date,
      description: `Sold to ${det.DrSgDelivery.Customer.fullName}`,
    }));
    const adjustments = itemHistory.adjustments.map((det) => ({
      id: `adj-${det.id}`,
      parentId: det.id,
      flow: det.amount < 0 ? "OUT" : "IN",
      type: "ADJUST",
      amount: det.amount,
      date: det.date,
      description: det.description,
    }));
    const loans = itemHistory.loans.map((det) => ({
      id: `loan-${det.id}`,
      parentId: det.id,
      flow: det.transactionValue < 0 ? "OUT" : "IN",
      type: det.lendType.toUpperCase(),
      amount: det.transactionValue,
      date: det.date,
      description: det.note,
    }));

    const returns = itemHistory.loans
      .filter((loan) => loan.returnDate)
      .map((det) => ({
        id: `return-${det.id}`,
        parentId: det.id,
        flow: det.lendType === "lend" ? "IN" : "OUT",
        type: "RETURN",
        amount: det.returnedValue,
        date: det.returnDate,
        description: det.note,
      }));
    return [...deliveries, ...adjustments, ...loans, ...returns];
  }, [itemHistory]);

  return item ? (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Box marginBottom={2}>
              <Typography variant="subtitle" fontWeight="bold" color="GrayText">
                #{item.id}
              </Typography>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {item.name}
                </Typography>
              </Box>
            </Box>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold">Keep Stock Since</Typography>
                <Typography>{item.keepStockSince}</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight="bold">
                Stock
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {item.keepStockSince ? stock : "Not keeping stock"}
              </Typography>
              <Stack spacing={2} direction={"row"}>
                <TextField
                  label="Adjustment Date"
                  type="date"
                  value={adjustDate}
                  onChange={(e) => setAdjustDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
                <AutoSelectTextField
                  required
                  fullWidth
                  type="number"
                  label="Adjust Amount"
                  autoFocus
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                />
                <TextField
                  fullWidth
                  value={adjustDescription}
                  label="Description"
                  onChange={(e) => setAdjustDescription(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  onClick={handleAdjust}
                >
                  Adjust Stock
                </Button>
              </Stack>
              {customers.length > 0 && (
                <Stack spacing={2} direction={"row"}>
                  <TextField
                    label="Loan Date"
                    type="date"
                    value={lendDate}
                    onChange={(e) => setLendDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                  <Autocomplete
                    fullWidth
                    value={selectedLoaner}
                    onChange={(e, newValue) => {
                      setSelectedLoaner(newValue);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option) =>
                      `#${option.id} - ${option.fullName}`
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        #{option.id} - {option.fullName}
                      </li>
                    )}
                    options={customers}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label="Customer" />
                    )}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      fullWidth
                      label="Type"
                      value={lendType}
                      onChange={(e) => setLendType(e.target.value)}
                    >
                      <MenuItem value="lend">Lend</MenuItem>
                      <MenuItem value="borrow">Borrow</MenuItem>
                    </Select>
                  </FormControl>
                  <AutoSelectTextField
                    required
                    fullWidth
                    type="number"
                    label="Qty"
                    autoFocus
                    value={lendQty}
                    onChange={(e) => setLendQty(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Notes"
                    value={lendNotes}
                    onChange={(e) => setLendNotes(e.target.value)}
                  />
                  <Button fullWidth variant="outlined" onClick={handleLend}>
                    {lendType === "lend" ? "Lend" : "Borrow"}
                  </Button>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight="bold">
                Loans
              </Typography>
              <SmartTable
                rows={loans.map((loan) => ({
                  id: loan.id,
                  date: loan.date,
                  customer: loan.customerFullName,
                  qty: loan.qty,
                  note: loan.note,
                  lendType: loan.lendType,
                  isReturned: loan.isReturned,
                  returnDate: loan.returnDate,
                  loanItem: loan,
                }))}
                columns={lendColumns}
              />
            </Stack>
          </Paper>
        </Grid>
        {itemHistory && (
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, height: "100%" }}>
              <Stack spacing={2}>
                <Typography variant="h4" fontWeight="bold">
                  Item History
                </Typography>
                <SmartTable
                  rows={itemHistoryOrganized.map((his) => ({
                    id: his.id,
                    date: his.date,
                    parentId: his.parentId,
                    type: his.type,
                    flow: his.flow,
                    amount: his.amount,
                    description: his.description,
                  }))}
                  columns={historyColumns}
                />
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Dialog
        open={!!selectedReturnLoan}
        onClose={() => setSelectedReturnLoan(null)}
        maxWidth="xl"
      >
        {selectedReturnLoan && (
          <Stack padding={4} spacing={2} minWidth={500}>
            <Typography fontWeight="bold" fontSize={24}>
              {selectedReturnLoan.lendType === "lend"
                ? `Take ${selectedReturnLoan.qty} ${selectedReturnLoan.DrSgItem.name} back from ${selectedReturnLoan.customerFullName}?`
                : `Return ${selectedReturnLoan.qty} ${selectedReturnLoan.DrSgItem.name} to ${selectedReturnLoan.customerFullName}?`}
            </Typography>
            <Stack spacing={2} direction="row">
              <TextField
                label="Return Date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <Button fullWidth variant="outlined" onClick={handleReturn}>
                Return
              </Button>
            </Stack>
          </Stack>
        )}
      </Dialog>
      <DeleteAlert
        message="Are you sure you want to remove this loan?"
        toDeleteId={toDeleteLoanId}
        handleDelete={handleDeleteLoan}
        setToDeleteId={setToDeleteLoanId}
        objectName="Draw"
      />
    </>
  ) : (
    <h1>Loading...</h1>
  );
}
