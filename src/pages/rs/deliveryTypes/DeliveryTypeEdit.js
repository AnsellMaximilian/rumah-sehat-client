import { Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function DeliveryTypeEdit() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [deliveryType, setDeliveryType] = useState(null);

  const onSubmit = (d) => {
    (async () => {
      try {
        await http.patch(`/rs/delivery-types/${id}`, {
          name: d.name,
        });
        navigate("/rs/delivery-types");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      if (id) {
        setDeliveryType((await http.get(`/rs/delivery-types/${id}`)).data.data);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (deliveryType) {
      reset({
        name: deliveryType.name,
      });
    }
  }, [deliveryType, reset]);
  return deliveryType ? (
    <Box>
      <Typography component="h1" variant="h5">
        Edit Delivery Type
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
