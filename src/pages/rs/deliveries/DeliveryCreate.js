import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
// import Checkbox from "@mui/material/Checkbox";
import WarningIcon from "@mui/icons-material/Error";

// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormGroup from "@mui/material/FormGroup";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";

import Cancel from "@mui/icons-material/Cancel";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../http-common";
import { v4 as uuidv4 } from "uuid";
import NumericFormatRp from "../../../components/NumericFormatRp";
import DeliveryDisplay from "../../../components/rs/DeliveryDisplay";
import AutoSelectTextField from "../../../components/AutoSelectTextField";
import DeliveryCreateForm from "../../../components/rs/DeliveryCreateForm";

export default function DeliveryCreate({ edit }) {
  const [invoices, setInvoices] = useState([]);

  const [invoice, setInvoice] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  // for edit mode
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      setInvoices((await http.get("/rs/invoices?active=yes")).data.data);
    })();
  }, []);

  const handleFormClose = () => {
    setEditId(null);
    setIsFormOpen(false);
  };

  const refreshInvoice = async () => {
    if (invoice) {
      setInvoices((await http.get("/rs/invoices?active=yes")).data.data);

      setInvoice((await http.get(`/rs/invoices/${invoice.id}`)).data.data);
    }
  };

  const handleSubmit = () => {
    handleFormClose();
    refreshInvoice();
    setEditId(null);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    (async () => {
      try {
        const delivery = (await http.delete(`/rs/deliveries/${id}`)).data.data;
        refreshInvoice();
        toast.success(`Delivery #${delivery.id} deleted.`);
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  return invoices.length > 0 ? (
    <Box>
      <Box display="flex" gap={2}>
        <Box flex={1}>
          <Autocomplete
            value={invoice}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box display="flex" alignItems="center" gap={2}>
                  #{option.id} - {option.customerFullName}
                </Box>
              </li>
            )}
            onChange={(e, newValue) => {
              setInvoice(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) =>
              `(#${option.id}) ${option.customerFullName}`
            }
            options={invoices}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ width: 300 }}
                label="Invoice"
                fullWidth
              />
            )}
          />
        </Box>
        <Button variant="contained" onClick={() => setIsFormOpen(true)}>
          Add New Delivery
        </Button>
      </Box>
      <Dialog open={isFormOpen} onClose={handleFormClose} maxWidth="xl">
        <DeliveryCreateForm
          invoice={invoice}
          onSubmit={handleSubmit}
          editId={editId}
        />
      </Dialog>
      <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
        {invoice &&
          invoice.Deliveries.map((delivery) => {
            return (
              <DeliveryDisplay
                delivery={delivery}
                key={delivery.id}
                onDelete={() => handleDelete(delivery.id)}
                onEdit={() => handleEdit(delivery.id)}
              />
            );
          })}
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
}
