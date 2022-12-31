import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import http from "../../../http-common";

export default function DrIdItemCreate() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = (d) => {
    http.post("/dr/id/items", {
      name: d.name,
      priceRP: d.priceRP,
      points: d.points,
    });
    navigate("/dr/id/items");
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
          label="Price (Rp)"
          {...register("priceRP")}
        />
        <TextField
          margin="normal"
          fullWidth
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
          Create
        </Button>
      </Box>
    </Box>
  );
}
