import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import http from "../../../http-common";

import moment from "moment";
import { useEffect, useState } from "react";
import NumericFormatRp from "../../../components/NumericFormatRp";

export default function DrInvoiceCreate() {
  const [idDeliveries, setIdDeliveries] = useState([]);
  const [sgDeliveries, setSgDeliveries] = useState([]);
  const [selectedIdDelivery, setSelectedIdDelivery] = useState("none");
  const [selectedSgDelivery, setSelectedSgDelivery] = useState("none");

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = (d) => {
    http.post("/dr/invoices", {
      name: d.name,
      priceRP: d.priceRP,
      points: d.points,
    });
    navigate("/dr/invoices");
  };

  useEffect(() => {
    (async () => {
      setIdDeliveries((await http.get("/dr/id/deliveries")).data.data);
      setSgDeliveries((await http.get("/dr/sg/deliveries")).data.data);
    })();
  }, []);

  return sgDeliveries.length > 0 || idDeliveries.length > 0 ? (
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

        {idDeliveries.length > 0 && selectedIdDelivery && (
          <Paper sx={{ padding: 2, marginTop: 1 }}>
            <Typography variant="h5">Indonesia</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-label">Delivery</InputLabel>
              <Select
                label="Delivery"
                value={selectedIdDelivery}
                onChange={(e) => setSelectedIdDelivery(e.target.value)}
                defaultValue={idDeliveries[0].id}
              >
                <MenuItem value="none" key="id-none">
                  None
                </MenuItem>
                {idDeliveries.map((delivery) => (
                  <MenuItem value={delivery.id} key={delivery.id}>
                    #{delivery.id} - {delivery.date} -{" "}
                    {delivery.customerFullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedIdDelivery !== "none" && (
              <Box marginTop={1}>
                <Typography variant="subtitle" component="h3">
                  Total
                </Typography>
                <Typography variant="h6">
                  <NumericFormatRp
                    value={
                      idDeliveries.find(
                        (delivery) => delivery.id === selectedIdDelivery
                      ).totalPriceRP
                    }
                  />
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {sgDeliveries.length > 0 && selectedSgDelivery && (
          <Paper sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h5">Singapore</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-label">Delivery</InputLabel>
              <Select
                label="Delivery"
                value={selectedSgDelivery}
                onChange={(e) => setSelectedSgDelivery(e.target.value)}
                defaultValue={sgDeliveries[0].id}
              >
                <MenuItem value="none" key="sg-none">
                  None
                </MenuItem>
                {sgDeliveries.map((delivery) => (
                  <MenuItem value={delivery.id} key={delivery.id}>
                    #{delivery.id} - {delivery.date} -{" "}
                    {delivery.customerFullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedSgDelivery !== "none" && (
              <Box marginTop={1}>
                <Typography variant="subtitle" component="h3">
                  Total
                </Typography>
                <Typography variant="h6">
                  <NumericFormatRp
                    value={
                      sgDeliveries.find(
                        (delivery) => delivery.id === selectedSgDelivery
                      ).totalPriceRP
                    }
                  />
                </Typography>
              </Box>
            )}
          </Paper>
        )}

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
