import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import http from "../../../../http-common";

export default function DrSgItemCreate() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = (d) => {
    http.post("/dr/sg/items", {
      name: d.name,
      priceSGD: d.priceSGD,
      points: d.points,
    });
    navigate("/dr/sg/items");
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
          label="Price (SGD)"
          {...register("priceSGD")}
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
