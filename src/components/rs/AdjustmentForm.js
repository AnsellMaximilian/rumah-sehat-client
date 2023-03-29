import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import http from "../../http-common";
import AutoSelectTextField from "../AutoSelectTextField";

export default function AdjustmentForm({
  onSubmit,
  onCancel,
  CustomerId,
  editId,
  SourceInvoiceId,
  AdjustedInvoiceId,
}) {
  const [amount, setAmount] = useState(0);
  const [selectedSourceInvoice, setSelectedSourceInvoice] = useState(null);
  const [selectedAdjustedInvoice, setSelectedAdjustedInvoice] = useState(null);
  const [description, setDescription] = useState("");
  const [invoices, setInvoices] = useState([]);

  useState(() => {
    (async () => {
      if (CustomerId) {
        setInvoices(
          (await http.get(`/rs/invoices?CustomerId=${CustomerId}`)).data.data
        );
      }
      if (SourceInvoiceId) {
        setSelectedSourceInvoice(
          (await http.get(`/rs/invoices/${SourceInvoiceId}`)).data.data
        );
      }
      if (AdjustedInvoiceId) {
        setSelectedAdjustedInvoice(
          (await http.get(`/rs/invoices/${AdjustedInvoiceId}`)).data.data
        );
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (editId) {
        const adjustment = (await http.get(`/rs/adjustments/${editId}`)).data
          .data;
        setDescription(adjustment.description);
        setAmount(adjustment.amount);
        setSelectedSourceInvoice(adjustment.SourceInvoice);
        setSelectedAdjustedInvoice(adjustment.AdjustedInvoice);
      }
    })();
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        selectedSourceInvoice &&
        selectedAdjustedInvoice &&
        selectedSourceInvoice.id === selectedAdjustedInvoice.id
      )
        throw new Error("Source invoice and adjusted invoice are the same.");
      const body = {
        description,
        amount,
        SourceInvoiceId: selectedSourceInvoice
          ? selectedSourceInvoice.id
          : null,
        AdjustedInvoiceId: selectedAdjustedInvoice
          ? selectedAdjustedInvoice.id
          : null,
        CustomerId,
      };
      if (!editId) {
        await http.post("/rs/adjustments", body);
        toast.success("Created adjustment.");
      } else {
        await http.patch(`/rs/adjustments/${editId}`, body);
        toast.success("Updated adjustment.");
      }
      onSubmit();
    } catch (error) {
      const errorValue = error?.response?.data || error?.response?.data.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return invoices.length > 0 ? (
    <Box component={Paper} padding={2}>
      <Typography variant="h5">
        {editId ? "Editing" : "Create"} Adjustment
      </Typography>
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={4}>
          <Autocomplete
            value={selectedSourceInvoice}
            disabled={!!SourceInvoiceId}
            onChange={(e, newValue) => {
              setSelectedSourceInvoice(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.id} - {option.status}
              </li>
            )}
            getOptionLabel={(option) =>
              `(#${option.id}) ${option.customerFullName} - ${option.status}`
            }
            options={invoices}
            renderInput={(params) => (
              <TextField {...params} fullWidth label="Source Invoice" />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <AutoSelectTextField
            label="Amount"
            margin="none"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            value={selectedAdjustedInvoice}
            disabled={!!AdjustedInvoiceId}
            onChange={(e, newValue) => {
              setSelectedAdjustedInvoice(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.id} - {option.status}
              </li>
            )}
            getOptionLabel={(option) =>
              `(#${option.id}) ${option.customerFullName} - ${option.status}`
            }
            options={invoices}
            renderInput={(params) => (
              <TextField {...params} fullWidth label="Adjusted Invoice" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            fullWidth
            margin="none"
            label="Description"
            rows={3.45}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button fullWidth variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Create"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
}
