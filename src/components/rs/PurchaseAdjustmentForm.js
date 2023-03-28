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
import moment from "moment";

export default function PurchaseAdjustmentForm({
  onSubmit,
  onCancel,
  SupplierId,
  editId,
}) {
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [description, setDescription] = useState("");

  const [purchases, setPurchases] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [selectedSourcePurchase, setSelectedSourcePurchase] = useState(null);

  useState(() => {
    (async () => {
      if (SupplierId) {
        setPurchases(
          (await http.get(`/rs/purchases?SupplierId=${SupplierId}`)).data.data
        );
        setAdjustments((await http.get(`/rs/adjustments`)).data.data);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (editId) {
        const adjustment = (
          await http.get(`/rs/purchase-adjustments/${editId}`)
        ).data.data;
        setDescription(adjustment.description);
        setAmount(adjustment.amount);
        setSelectedAdjustment(adjustment.Adjustment);
        setSelectedSourcePurchase(adjustment.SourcePurchase);
      }
    })();
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        selectedSourcePurchase &&
        SupplierId !== selectedSourcePurchase.SupplierId
      )
        throw new Error("Purchase's supplier needs to be from this supplier.");
      const body = {
        description,
        amount,
        date,
        SourcePurchaseId: selectedSourcePurchase
          ? selectedSourcePurchase.id
          : null,
        AdjustmentId: selectedAdjustment ? selectedAdjustment.id : null,
        SupplierId,
      };
      if (!editId) {
        await http.post("/rs/purchase-adjustments", body);
        toast.success("Created adjustment.");
      } else {
        await http.patch(`/rs/purchase-adjustments/${editId}`, body);
        toast.success("Updated adjustment.");
      }
      onSubmit();
    } catch (error) {
      const errorValue = error?.response?.data || error?.response?.data.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return SupplierId ? (
    <Box component={Paper} padding={2}>
      <Typography variant="h5">
        {editId ? "Editing" : "Create"} Purchase Adjustment
      </Typography>
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={3}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            value={selectedSourcePurchase}
            onChange={(e, newValue) => {
              setSelectedSourcePurchase(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                #{option.id}
              </li>
            )}
            getOptionLabel={(option) => `(#${option.id})`}
            options={purchases}
            renderInput={(params) => (
              <TextField {...params} fullWidth label="Source Purchase" />
            )}
          />
        </Grid>

        <Grid item xs={3}>
          <Autocomplete
            value={selectedAdjustment}
            onChange={(e, newValue) => {
              setSelectedAdjustment(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                #{option.id}: (Customer: {option.Customer.fullName}){" "}
                {option.SourceInvoice && `Invoice #${option.SourceInvoice.id}`}
              </li>
            )}
            getOptionLabel={(option) => `(#${option.id})`}
            options={adjustments}
            renderInput={(params) => (
              <TextField {...params} fullWidth label="Adjustment" />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <AutoSelectTextField
            label="Amount"
            margin="none"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
