import { Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function DrIdItemEdit() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState(null);

  const onSubmit = (d) => {
    (async () => {
      const { error } = (
        await http.patch(`/dr/id/items/${id}`, {
          name: d.name,
          priceRP: d.priceRP,
          points: d.points,
        })
      ).data;

      if (!error) {
        navigate("/dr/id/items");
      } else {
        toast.error(error.name);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      if (id) {
        setItem((await http.get(`/dr/id/items/${id}`)).data.data);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        priceRP: item.priceRP,
        points: item.points,
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
          label="Phone"
          type="number"
          {...register("priceRP")}
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
