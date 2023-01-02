import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import http from "../../../http-common";

export default function DrDiscountModelCreate() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = (d) => {
    http.post("/dr/discount-models", {
      description: d.description,
      base: d.base,
      subtractor: d.subtractor,
      percentage: d.percentage,
    });
    navigate("/dr/discount-models");
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
          label="Description"
          autoFocus
          {...register("description")}
        />
        <TextField
          margin="normal"
          fullWidth
          type="number"
          label="Base"
          {...register("base")}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Subtractor"
          type="number"
          {...register("subtractor")}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Percentage"
          type="number"
          {...register("percentage")}
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
