import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import http from "../../http-common";

export default function InvoiceCreateForm({ editId, onSubmit, onCancel }) {
  const [customers, setCustomers] = useState([]);

  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceNote, setInvoiceNote] = useState("");
  const [invoiceCustomer, setInvoiceCustomer] = useState(null);
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (editId) {
        const invoice = (await http.get(`/rs/invoices/${editId}`)).data.data;
        setInvoiceDate(invoice.date);
        setInvoiceNote(invoice.note || "");
        setInvoiceCustomer(invoice.Customer);
        setStatus(invoice.status);
      }
    })();
  }, [editId]);

  const reset = () => {
    setInvoiceDate("");
    setInvoiceNote("");
    setInvoiceCustomer(null);
    setStatus("draft");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (invoiceCustomer === null)
        throw new Error("Please select a customer.");

      if (!invoiceDate) throw new Error("Please select date.");

      const body = {
        editId,
        CustomerId: invoiceCustomer.id,
        date: invoiceDate,
        note: invoiceNote,
        status,
      };
      if (!editId) {
        const invoice = (await http.post("/rs/invoices", body)).data.data;
        toast.success("Created invoice.");
        onSubmit(invoice.id);
      } else {
        const invoice = (await http.patch(`/rs/invoices/${editId}`, body)).data
          .data;
        toast.success("Updated invoice.");
        onSubmit(invoice.id);
      }
      reset();
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return customers.length > 0 ? (
    <Box component={Paper} width="90vw">
      <Box padding={1}>
        <Typography variant="h5">
          {editId ? "Edit" : "Create"} Invoice {editId}
        </Typography>
      </Box>
      <Box
        marginTop={2}
        marginX={1}
        display="flex"
        gap={2}
        justifyContent="space-between"
        padding={1}
      >
        <Box display="flex" gap={2}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Date"
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Autocomplete
              value={invoiceCustomer}
              onChange={(e, newValue) => {
                setInvoiceCustomer(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.fullName}
                </li>
              )}
              getOptionLabel={(option) => `(#${option.id}) ${option.fullName}`}
              options={customers}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Customer" />
              )}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              multiline
              margin="none"
              label="Invoice Note"
              rows={4.1}
              value={invoiceNote}
              onChange={(e) => setInvoiceNote(e.target.value)}
            />
          </Box>
        </Box>
        <Box>
          <FormControl margin="none">
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box marginTop={2}>
        <Box
          marginTop={2}
          display="flex"
          justifyContent="flex-en"
          padding={2}
          gap={2}
        >
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            {editId ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Box>
  ) : (
    <h1>Load</h1>
  );
}
