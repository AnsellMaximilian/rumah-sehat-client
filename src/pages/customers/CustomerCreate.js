import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [note, setNote] = useState("");

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      setRegions((await http.get(`/regions`)).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (regions.length > 0) setSelectedRegionId(regions[0].id);
      if (edit) {
        const customer = (await http.get(`/customers/${id}`)).data.data;
        setFullName(customer.fullName);
        setAddress(customer.address || "");
        setNote(customer.note || "");
        setPhone(customer.phone || "");
        setRsMember(customer.rsMember);
        setReceiveDrDiscount(customer.receiveDrDiscount);
        if (customer.RegionId) setSelectedRegionId(customer.RegionId);
      }
    })();
  }, [edit, id, regions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        fullName,
        phone,
        address,
        rsMember,
        note,
        receiveDrDiscount,
        RegionId: selectedRegionId,
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
    } catch ({ response: { data: error } }) {
      toast.error(error);
    }
  };
  return regions.length > 0 && selectedRegionId ? (
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
            sx={{ flex: 4 }}
          />
          <TextField
            fullWidth
            label="Phone"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            sx={{ flex: 2 }}
          />
        </Box>
        <Box display="flex" gap={2}>
          <FormControl margin="none" sx={{ flex: 1 }}>
            <InputLabel id="demo-simple-select-label">Region</InputLabel>
            <Select
              label="Region"
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
            >
              {regions.map((region) => (
                <MenuItem value={region.id} key={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        <Box>
          <TextField
            fullWidth
            label="Note"
            onChange={(e) => setNote(e.target.value)}
            multiline
            value={note}
            rows={2}
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
  ) : (
    <h1>Loading...</h1>
  );
}
