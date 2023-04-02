import { Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../../http-common";

export default function DrMyItemEdit() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState(null);

  const onSubmit = (d) => {
    (async () => {
      try {
        await http.patch(`/dr/my/items/${id}`, {
          name: d.name,
          priceRM: d.priceRM,
          points: d.points,
          deliveryCost: d.deliveryCost,
        });
        toast.success("Successfully updated item.");
        navigate("/dr/my/items");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      if (id) {
        setItem((await http.get(`/dr/my/items/${id}`)).data.data);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        priceRM: item.priceRM,
        points: item.points,
        deliveryCost: item.deliveryCost,
      });
    }
  }, [item, reset]);
  return item ? (
    <Box>
      <Typography component="h1" variant="h5">
        Edit Item
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
          fullWidth
          required
          label="Price (SGD)"
          type="number"
          {...register("priceRM")}
        />
        <TextField
          margin="normal"
          fullWidth
          required
          label="Delivery Cost (Rp)"
          type="number"
          {...register("deliveryCost")}
        />
        <TextField
          margin="normal"
          fullWidth
          required
          label="Points"
          type="number"
          {...register("points")}
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
