import { Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../http-common";
import { updateCustomer } from "../../slices/customerSlice";

export default function CustomerEdit() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);

  const onSubmit = (d) => {
    console.log({ form: d, name: d.fullName });
    dispatch(
      updateCustomer({
        id,
        fullName: d.fullName,
        phone: d.phone,
        address: d.address,
      })
    );
    navigate("/customers");
  };

  useEffect(() => {
    (async () => {
      if (id) {
        setCustomer((await http.get(`/customers/${id}`)).data.data);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (customer) {
      reset({
        fullName: customer.fullName,
        phone: customer.phone,
        address: customer.address,
      });
    }
  }, [customer, reset]);
  return customer ? (
    <Box>
      <Typography component="h1" variant="h5">
        Edit Customer
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
  ) : (
    <Skeleton />
  );
}
