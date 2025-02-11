import React, { useCallback, useEffect, useState } from "react";
import CustomDialog from "../../Dialog";
import http from "../../../http-common";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Cancel from "@mui/icons-material/Cancel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import AutoSelectTextField from "../../AutoSelectTextField";
import { toastError } from "../../../helpers/common";

export default function BulkLoanForm({ isOpen, setIsOpen }) {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  const [universalNote, setUniversalNote] = useState("");
  const [loanDate, setLoanDate] = useState("");

  const [loanItems, setLoanItems] = useState([]);

  const [customer, setCustomer] = useState(null);

  const fetchData = useCallback(async () => {
    setCustomers((await http.get(`/customers`)).data.data);
    setItems((await http.get("/dr/sg/items?activeStatus=all")).data.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddLoanItem = () => {
    const item = items[0];

    setLoanItems((prev) => [
      ...prev,
      {
        key: uuidv4(),
        item,
        qty: 0,
        note: "",
        type: "lend",
      },
    ]);
  };

  const handleRemoveLoanItem = (key) => {
    setLoanItems((prev) => prev.filter((li) => li.key !== key));
  };

  const handleDeliveryDetailAttrChange =
    (attr, detailKey, customValue) => (e) => {
      setLoanItems((prev) =>
        prev.map((detail) => {
          if (detail.key === detailKey) {
            return {
              ...detail,
              [attr]: customValue !== undefined ? customValue : e.target.value,
            };
          }

          return detail;
        })
      );
    };

  const handleSubmit = async () => {
    try {
      if (!customer) throw new Error("Please select a customer");
      if (!loanDate) throw new Error("Please select a date.");

      if (loanItems.length <= 0)
        throw new Error("Please include at least 1 loan.");

      const body = {
        loanItems: loanItems.map((item) => {
          if (!item) throw new Error("Item required");
          if (!(item.type === "lend" || item.type === "borrow"))
            throw new Error("Incorrect type");
          if (parseFloat(item.qty) <= 0)
            throw new Error("Qty must be higher than 0");
          return {
            date: loanDate,
            qty: item.qty,
            lendType: item.type,
            CustomerId: customer.id,
            DrSgItemId: item.item.id,
            note: item.note ? item.note : universalNote,
          };
        }),
      };
      const lends = (await http.post(`/dr/sg/loans/bulk`, body)).data.data;
      toast.success(`Created ${lends.length} loans.`);
      reset();
    } catch (error) {
      toastError(error);
    }
  };

  const reset = () => {
    setLoanItems([]);
    setLoanDate("");
    setUniversalNote("");
    setCustomer(null);
  };
  return (
    <>
      <CustomDialog
        onClose={() => setIsOpen(false)}
        open={isOpen}
        maxWidth="xl"
        title="Bulk Loan"
        action={() => {
          handleSubmit();
          setIsOpen(false);
        }}
        actionLabel="Submit"
      >
        <Grid container gap={2} mt={1}>
          <Grid item xs={12}>
            <Box display="flex" gap={2} alignItems="stretch">
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Date"
                  type="date"
                  value={loanDate}
                  onChange={(e) => setLoanDate(e.target.value)}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Autocomplete
                  value={customer}
                  onChange={(e, newValue) => {
                    setCustomer(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.fullName}
                    </li>
                  )}
                  getOptionLabel={(option) =>
                    `(#${option.id}) ${option.fullName}`
                  }
                  options={customers}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      sx={{ width: 220 }}
                      label="Lender/Loaner"
                    />
                  )}
                />

                <TextField
                  multiline
                  margin="none"
                  label="Universal Note"
                  value={universalNote}
                  onChange={(e) => setUniversalNote(e.target.value)}
                  rows={3}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={1}>
              <Box
                sx={{ backgroundColor: "primary.light", color: "white" }}
                padding={1}
                flex={1}
              >
                Loan Items
              </Box>
              <Button variant="outlined" onClick={() => handleAddLoanItem()}>
                Add Row
              </Button>
            </Box>
            <TableContainer sx={{ marginTop: 1 }}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Actions</TableCell>
                    <TableCell align="left">Item</TableCell>
                    <TableCell align="left">Type</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loanItems.map((item) => (
                    <TableRow
                      key={item.key}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box display="flex" gap={2}>
                          <IconButton
                            tabIndex={-1}
                            onClick={() => handleRemoveLoanItem(item.key)}
                          >
                            <Cancel color="error" />
                          </IconButton>
                        </Box>
                      </TableCell>

                      <TableCell align="left">
                        <Autocomplete
                          value={item.item}
                          onChange={(e, newValue) => {
                            handleDeliveryDetailAttrChange(
                              "item",
                              item.key,
                              newValue
                            )(e);
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
                          options={items}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              sx={{ width: 200 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Type
                          </InputLabel>
                          <Select
                            fullWidth
                            label="Type"
                            value={item.type}
                            onChange={handleDeliveryDetailAttrChange(
                              "type",
                              item.key
                            )}
                          >
                            <MenuItem value="lend">Lend</MenuItem>
                            <MenuItem value="borrow">Borrow</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell align="right">
                        <AutoSelectTextField
                          size="small"
                          margin="none"
                          sx={{ width: 50 }}
                          type="number"
                          value={item.qty}
                          variant="standard"
                          inputProps={{ min: 0 }}
                          onChange={handleDeliveryDetailAttrChange(
                            "qty",
                            item.key
                          )}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <AutoSelectTextField
                          size="small"
                          margin="none"
                          sx={{ width: 50 }}
                          value={item.note}
                          variant="standard"
                          onChange={handleDeliveryDetailAttrChange(
                            "note",
                            item.key
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CustomDialog>
    </>
  );
}
