import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../../http-common";

export default function DrMyItemCreate() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = (d) => {
    (async () => {
      try {
        await http.post("/dr/my/items", {
          name: d.name,
          priceRM: d.priceRM,
          deliveryCost: d.deliveryCost,
          points: d.points,
        });
        navigate("/dr/my/items");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
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
          label="Name"
          autoFocus
          {...register("name")}
        />
        <TextField
          margin="normal"
          fullWidth
          type="number"
          label="Price (RM)"
          {...register("priceRM")}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Points"
          type="number"
          {...register("points")}
        />
        <TextField
          margin="normal"
          fullWidth
          type="number"
          label="Deivery Cost (Rp)"
          {...register("deliveryCost")}
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
