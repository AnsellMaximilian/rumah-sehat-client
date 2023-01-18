import { Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function ProductEdit() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProducts] = useState(null);

  const onSubmit = (d) => {
    (async () => {
      try {
        await http.patch(`/rs/products/${id}`, {
          name: d.name,
          price: d.price,
          resellerPrice: d.resellerPrice,
          cost: d.cost,
        });
        navigate("/rs/products");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      if (id) {
        setProducts((await http.get(`/rs/products/${id}`)).data.data);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        resellerPrice: product.resellerPrice,
        cost: product.cost,
      });
    }
  }, [product, reset]);
  return product ? (
    <Box>
      <Typography component="h1" variant="h5">
        Edit Product
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
        <TextField
          margin="normal"
          required
          type="number"
          fullWidth
          label="Price"
          {...register("price")}
        />
        <TextField
          margin="normal"
          required
          type="number"
          fullWidth
          label="Reseller Price"
          {...register("resellerPrice")}
        />

        <TextField
          margin="normal"
          required
          type="number"
          fullWidth
          label="Cost"
          {...register("cost")}
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
