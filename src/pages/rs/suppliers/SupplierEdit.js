import { Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function SupplierEdit() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [supplier, setSupplier] = useState(null);

  const onSubmit = (d) => {
    (async () => {
      try {
        await http.patch(`/rs/suppliers/${id}`, {
          name: d.name,
        });
        navigate("/rs/suppliers");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      if (id) {
        setSupplier((await http.get(`/rs/suppliers/${id}`)).data.data);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
      });
    }
  }, [supplier, reset]);
  return supplier ? (
    <Box>
      <Typography component="h1" variant="h5">
        Edit Supplier
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
          label="Name"
          autoFocus
          {...register("name")}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update
        </Button>
      </Box>
    </Box>
  ) : (
    <Skeleton />
  );
}
