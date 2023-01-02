import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import http from "../../../../http-common";

export default function DrIdDeliveryCreate() {
  const [customers, setCustomers] = useState([]);
  const [discountModels, setDiscountModels] = useState([]);

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
      setDiscountModels((await http.get("/dr/discount-models")).data.data);
    })();
  }, []);

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = (d) => {
    // http.post("/dr/id/items", {
    //   name: d.CustomerId,
    //   priceRP: d.priceRP,
    //   points: d.points,
    // });
    // navigate("/dr/id/items");
    console.log({
      cost: d.cost,
      CustomerId: d.CustomerId,
      DiscountModelId: d.DiscountModelId,
      note: d.note,
    });
  };
  return (
    <Box>
      <Typography component="h1" variant="h5">
        Add New
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Date"
          disabled
          type="date"
          {...register("date")}
        />
        {customers.length > 0 ? (
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Customer</InputLabel>
            <Select
              label="Customer"
              {...register("CustomerId")}
              defaultValue={customers[0].id}
            >
              {customers.map((customer) => (
                <MenuItem value={customer.id} key={customer.id}>
                  {customer.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <span>Loading customers...</span>
        )}
        {discountModels.length > 0 ? (
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">
              Discount Models
            </InputLabel>
            <Select
              label="Discount Model"
              {...register("DiscountModelId")}
              defaultValue={discountModels[0].id}
            >
              {discountModels.map((discountModel) => (
                <MenuItem value={discountModel.id} key={discountModel.id}>
                  {discountModel.description || `ID: ${discountModel.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <span>Loading customers...</span>
        )}
        <TextField
          margin="normal"
          fullWidth
          type="number"
          label="Cost (Rp)"
          {...register("cost")}
        />
        <TextField
          margin="normal"
          fullWidth
          multiline
          label="Delivery Note"
          {...register("note")}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create
        </Button>
      </Box>
    </Box>
  );
}
