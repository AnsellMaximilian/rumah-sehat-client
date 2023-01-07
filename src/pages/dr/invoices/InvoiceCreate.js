import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";

import { useNavigate } from "react-router-dom";
import http from "../../../http-common";

import moment from "moment";
import { useEffect, useState } from "react";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";

export default function DrInvoiceCreate() {
  const [idDeliveries, setIdDeliveries] = useState([]);
  const [sgDeliveries, setSgDeliveries] = useState([]);
  const [selectedIdDelivery, setSelectedIdDelivery] = useState("none");
  const [selectedSgDelivery, setSelectedSgDelivery] = useState("none");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [filteredIdDeliveries, setFilteredIdDeliveries] = useState([]);
  const [filteredSgDeliveries, setFilteredSgDeliveries] = useState([]);
  const [selectedIdDeliveries, setSelectedIdDeliveries] = useState([]);
  const [selectedSgDeliveries, setSelectedSgDeliveries] = useState([]);
  const [note, setNote] = useState("");

  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    (async () => {
      const { error } = (
        await http.post("/dr/invoices", {
          date: moment().format("YYYY-MM-DD"),
          note,
          DrIdDeliveryIds: selectedIdDeliveries.map((delivery) => delivery.id),
          DrSgDeliveryIds: selectedSgDeliveries.map((delivery) => delivery.id),
          CustomerId: selectedCustomerId,
        })
      ).data;
      if (error) {
        toast.error(error);
      } else {
        navigate("/dr/invoices");
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setIdDeliveries(
        (await http.get("/dr/id/deliveries?unInvoiced=true")).data.data
      );
      setSgDeliveries(
        (await http.get("/dr/sg/deliveries?unInvoiced=true")).data.data
      );
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers]);

  useEffect(() => {
    setSelectedIdDelivery("none");
    setSelectedSgDelivery("none");
    setFilteredIdDeliveries(
      idDeliveries.filter(
        (delivery) =>
          delivery.CustomerId === selectedCustomerId &&
          !selectedIdDeliveries.some(
            (selectedDelivery) => selectedDelivery.id === delivery.id
          )
      )
    );
    setFilteredSgDeliveries(
      sgDeliveries.filter(
        (delivery) =>
          delivery.CustomerId === selectedCustomerId &&
          !selectedSgDeliveries.some(
            (selectedDelivery) => selectedDelivery.id === delivery.id
          )
      )
    );
  }, [
    selectedCustomerId,
    idDeliveries,
    sgDeliveries,
    selectedIdDeliveries,
    selectedSgDeliveries,
  ]);

  useEffect(() => {
    setSelectedIdDeliveries([]);
    setSelectedSgDeliveries([]);
  }, [selectedCustomerId]);

  const selectIdDelivery = () => {
    if (selectedIdDelivery !== "none") {
      setSelectedIdDeliveries((prev) => [
        ...prev,
        filteredIdDeliveries.find(
          (delivery) => delivery.id === selectedIdDelivery
        ),
      ]);
    }
  };

  const removeSelectedIdDelivery = (id) =>
    setSelectedIdDeliveries((prev) =>
      prev.filter((delivery) => delivery.id !== id)
    );

  const selectSgDelivery = () => {
    if (selectedSgDelivery !== "none") {
      setSelectedSgDeliveries((prev) => [
        ...prev,
        filteredSgDeliveries.find(
          (delivery) => delivery.id === selectedSgDelivery
        ),
      ]);
    }
  };

  const removeSelectedSgDelivery = (id) =>
    setSelectedSgDeliveries((prev) =>
      prev.filter((delivery) => delivery.id !== id)
    );

  const totalSelectedIdDeliveries = selectedIdDeliveries.reduce(
    (total, delivery) => total + delivery.totalPriceRP,
    0
  );
  const totalSelectedSgDeliveries = selectedSgDeliveries.reduce(
    (total, delivery) => total + delivery.totalPriceRP,
    0
  );

  return (sgDeliveries.length > 0 || idDeliveries.length > 0) &&
    customers.length > 0 &&
    selectedCustomerId ? (
    <Box>
      <Typography component="h1" variant="h5">
        Add New
      </Typography>
      <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
        <Box display="flex" justifyContent="space-between" gap={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Customer</InputLabel>
            <Select
              label="Delivery"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              defaultValue={customers[0].id}
            >
              {customers.map((customer) => (
                <MenuItem value={customer.id} key={customer.id}>
                  {customer.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            margin="normal"
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
            disabled
            defaultValue={moment().format("yyyy-MM-DD")}
          />
        </Box>
        <TextField
          margin="normal"
          fullWidth
          multiline
          label="Invoice Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {idDeliveries.length > 0 && selectedIdDelivery && (
          <Paper sx={{ padding: 2, marginTop: 1 }}>
            <Typography variant="h5">Indonesia</Typography>
            <Box display="flex" justifyContent="space-between" gap={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="demo-simple-select-label">Delivery</InputLabel>
                <Select
                  label="Delivery"
                  value={selectedIdDelivery}
                  onChange={(e) => setSelectedIdDelivery(e.target.value)}
                  defaultValue="none"
                >
                  <MenuItem value="none" key="id-none">
                    None
                  </MenuItem>
                  {filteredIdDeliveries.map((delivery) => (
                    <MenuItem value={delivery.id} key={delivery.id}>
                      #{delivery.id} - {delivery.customerFullName} -{" "}
                      {delivery.date}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box marginTop={2} marginBottom={1} display="flex">
                <Button variant="outlined" onClick={selectIdDelivery}>
                  Add
                </Button>
              </Box>
            </Box>
            <List>
              {selectedIdDeliveries.map((delivery) => (
                <ListItem
                  key={delivery.id}
                  disableGutters
                  secondaryAction={
                    <IconButton
                      aria-label="remove"
                      color="error"
                      onClick={() => removeSelectedIdDelivery(delivery.id)}
                    >
                      <Cancel />
                    </IconButton>
                  }
                >
                  <ListItemText
                    secondary={
                      <NumericFormatRp value={delivery.totalPriceRP} />
                    }
                    primary={`#${delivery.id} ${delivery.date}`}
                  />
                </ListItem>
              ))}
            </List>
            {selectedIdDeliveries.length > 0 && (
              <Box marginTop={1}>
                <Typography variant="subtitle" component="h3">
                  Total
                </Typography>
                <Typography variant="h6">
                  <NumericFormatRp value={totalSelectedIdDeliveries} />
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {sgDeliveries.length > 0 && selectedSgDelivery && (
          <Paper sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h5">Singapore</Typography>
            <Box display="flex" justifyContent="space-between" gap={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="demo-simple-select-label">Delivery</InputLabel>
                <Select
                  label="Delivery"
                  value={selectedSgDelivery}
                  onChange={(e) => setSelectedSgDelivery(e.target.value)}
                  defaultValue="none"
                >
                  <MenuItem value="none" key="sg-none">
                    None
                  </MenuItem>
                  {filteredSgDeliveries.map((delivery) => (
                    <MenuItem value={delivery.id} key={delivery.id}>
                      #{delivery.id} - {delivery.customerFullName} -{" "}
                      {delivery.date}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box marginTop={2} marginBottom={1} display="flex">
                <Button variant="outlined" onClick={selectSgDelivery}>
                  Add
                </Button>
              </Box>
            </Box>
            <List>
              {selectedSgDeliveries.map((delivery) => (
                <ListItem
                  key={delivery.id}
                  disableGutters
                  secondaryAction={
                    <IconButton
                      aria-label="remove"
                      color="error"
                      onClick={() => removeSelectedSgDelivery(delivery.id)}
                    >
                      <Cancel />
                    </IconButton>
                  }
                >
                  <ListItemText
                    secondary={
                      <NumericFormatRp value={delivery.totalPriceRP} />
                    }
                    primary={`#${delivery.id} ${delivery.date}`}
                  />
                </ListItem>
              ))}
            </List>

            {selectedSgDeliveries.length > 0 && (
              <Box marginTop={1}>
                <Typography variant="subtitle" component="h3">
                  Total
                </Typography>
                <Typography variant="h6">
                  <NumericFormatRp value={totalSelectedSgDeliveries} />
                </Typography>
              </Box>
            )}
          </Paper>
        )}
        <Paper sx={{ padding: 2, marginTop: 3 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">Total</Typography>
            <Typography variant="h4">
              <NumericFormatRp
                value={totalSelectedIdDeliveries + totalSelectedSgDeliveries}
              />
            </Typography>
          </Box>
        </Paper>

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
  ) : (
    <h1>No deliveries</h1>
  );
}
