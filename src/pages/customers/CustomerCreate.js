import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../http-common";

export default function CustomerCreate({ edit }) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [rsMember, setRsMember] = useState(false);
  const [receiveDrDiscount, setReceiveDrDiscount] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      if (edit) {
        const customer = (await http.get(`/customers/${id}`)).data.data;
        setFullName(customer.fullName);
        setAddress(customer.address || "");
        setPhone(customer.phone || "");
        setRsMember(customer.rsMember);
        setReceiveDrDiscount(customer.receiveDrDiscount);
      }
    })();
  }, [edit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        fullName,
        phone,
        address,
        rsMember,
        receiveDrDiscount,
      };

      if (!edit) {
        await http.post("/customers", body);
        toast.success("Created customer.");
        navigate("/customers");
      } else {
        await http.patch(`/customers/${id}`, body);
        toast.success("Updated customer.");
        navigate("/customers");
      }

      navigate("/customers");
    } catch (error) {}
  };
  return (
    <Box>
      <Typography component="h1" variant="h5">
        {edit ? `Editing Customer #${id}` : "Add New Customer"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1 }}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Box display="flex" gap={2}>
          <TextField
            required
            fullWidth
            label="Full Name"
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Phone"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            sx={{ flex: 2 }}
          />
          <FormGroup sx={{ flex: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => setRsMember(e.target.checked)}
                  checked={rsMember}
                />
              }
              label="RS Member"
            />
          </FormGroup>
          <FormGroup sx={{ flex: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => setReceiveDrDiscount(e.target.checked)}
                  checked={receiveDrDiscount}
                />
              }
              label="Receive Dr's Discount"
            />
          </FormGroup>
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Address"
            onChange={(e) => setAddress(e.target.value)}
            multiline
            value={address}
            rows={5}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {edit ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
}
