import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function DeliveryTypeCreate() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = (d) => {
    (async () => {
      try {
        await http.post("/rs/delivery-types", {
          name: d.name,
        });

        navigate("/rs/delivery-types");
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
