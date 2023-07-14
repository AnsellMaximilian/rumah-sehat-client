import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";
import { useEffect, useState } from "react";

export default function SupplierCreate({ edit }) {
  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (edit) {
        const supplier = (await http.get(`/rs/suppliers/${id}`)).data.data;
        setName(supplier.name);
        setAccountNumber(supplier.accountNumber || "");
        setAccountName(supplier.accountName || "");
      }
    })();
  }, [edit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name,
        accountNumber,
        accountName,
      };

      if (!edit) {
        await http.post("/rs/suppliers", body);
        toast.success("Created supplier.");
      } else {
        await http.patch(`/rs/suppliers/${id}`, body);
        toast.success("Updated supplier.");
      }

      navigate("/rs/suppliers");
    } catch ({ response: { data: error } }) {
      toast.error(error);
    }
  };
  return (
    <Box>
      <Typography component="h1" variant="h5">
        Add New
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Account Number"
          autoFocus
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Account Name"
          autoFocus
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
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
