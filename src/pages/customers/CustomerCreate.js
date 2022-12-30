import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeCustomer } from "../../slices/customerSlice";

export default function CustomerCreate() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = (d) => {
    dispatch(
      storeCustomer({
        fullName: d.fullName,
        phone: d.phone,
        address: d.address,
      })
    );
    navigate("/customers");
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
          required
          fullWidth
          label="Full Name"
          autoFocus
          {...register("fullName")}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Phone"
          {...register("phone")}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Address"
          multiline
          {...register("address")}
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
