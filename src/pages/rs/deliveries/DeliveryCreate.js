import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import http from "../../../http-common";
import NumericFormatRp from "../../../components/NumericFormatRp";
import DeliveryDisplay from "../../../components/rs/DeliveryDisplay";
import DeliveryCreateForm from "../../../components/rs/DeliveryCreateForm";

import InvoiceCreateForm from "../../../components/rs/InvoiceCreateForm";
import Typography from "@mui/material/Typography";
import ValueDisplay from "../../../components/ValueDisplay";
import DeleteAlert from "../../../components/DeleteAlert";

export default function DeliveryCreate({ edit }) {
  const [invoices, setInvoices] = useState([]);

  const [invoice, setInvoice] = useState(null);

  const [isDeliveryFormOpen, setIsDeliveryFormOpen] = useState(false);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);

  const [deliveryEditId, setDeliveryEditId] = useState(null);
  const [invoiceEditId, setInvoiceEditId] = useState(null);

  const [toDeleteId, setToDeleteId] = useState(null);

  useEffect(() => {
    (async () => {
      setInvoices((await http.get("/rs/invoices?active=yes")).data.data);
    })();
  }, []);

  const handleDeliveryFormClose = () => {
    setDeliveryEditId(null);
    setIsDeliveryFormOpen(false);
  };

  const handleInvoiceFormClose = () => {
    setDeliveryEditId(null);
    setIsInvoiceFormOpen(false);
  };

  const refreshInvoice = async (newInvoice) => {
    setInvoices((await http.get("/rs/invoices?active=yes")).data.data);
    if (invoice && !newInvoice) {
      setInvoice((await http.get(`/rs/invoices/${invoice.id}`)).data.data);
    }
  };

  const handleDeliverySubmit = () => {
    handleDeliveryFormClose();
    refreshInvoice();
    setDeliveryEditId(null);
  };

  const handleInvoiceSubmit = async (invoiceId) => {
    refreshInvoice(true);
    setInvoice((await http.get(`/rs/invoices/${invoiceId}`)).data.data);
    handleInvoiceFormClose();
    setInvoiceEditId(null);
  };

  const handleDeliveryEdit = (id) => {
    setDeliveryEditId(id);
    setIsDeliveryFormOpen(true);
  };

  const handleInvoiceEdit = (id) => {
    setInvoiceEditId(id);
    setIsInvoiceFormOpen(true);
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
        <Box flex={1} display="flex" gap={2} justifyContent="flex-start">
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
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ width: 300 }}
                label="Invoice"
                fullWidth
              />
            )}
          />
          <Button variant="outlined" onClick={() => setIsInvoiceFormOpen(true)}>
            New Invoice
          </Button>
        </Box>
        <Button variant="contained" onClick={() => setIsDeliveryFormOpen(true)}>
          Add New Delivery
        </Button>
      </Box>
      <Box marginTop={4} marginBottom={4}>
        {invoice ? (
          <Box>
            <Box display="flex" gap={1}>
              <Typography variant="h5" fontWeight="bold">
                Invoice #{invoice.id}
              </Typography>
              <Chip
                label={invoice.status}
                variant="outlined"
                color={
                  invoice.status === "paid"
                    ? "success"
                    : invoice.status === "pending"
                    ? "default"
                    : "warning"
                }
              />
            </Box>

            <Box display="flex" gap={2} marginTop={2}>
              <Box flex={1}>
                <ValueDisplay label={"Date"} value={invoice.date} />
                <ValueDisplay
                  label={"Customer"}
                  value={invoice.customerFullName}
                />
              </Box>
              <Box flex={1}>
                <ValueDisplay
                  label={"Note"}
                  value={invoice.note || "No notes."}
                />
                <ValueDisplay
                  label={"Total"}
                  renderValue={() => (
                    <NumericFormatRp value={invoice.totalPrice} />
                  )}
                />
              </Box>
              <Box flex={0.5} display="flex" justifyContent="flex-end">
                <ValueDisplay
                  label={"Actions"}
                  renderValue={() => (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleInvoiceEdit(invoice.id)}
                    >
                      Edit
                    </Button>
                  )}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <h1>Select or create invoice</h1>
        )}
      </Box>
      <Dialog
        open={isDeliveryFormOpen}
        onClose={handleDeliveryFormClose}
        maxWidth="xl"
      >
        <DeliveryCreateForm
          invoice={invoice}
          onSubmit={handleDeliverySubmit}
          editId={deliveryEditId}
          onCancel={handleDeliveryFormClose}
        />
      </Dialog>

      <Dialog
        open={isInvoiceFormOpen}
        onClose={handleInvoiceFormClose}
        maxWidth="xl"
      >
        <InvoiceCreateForm
          onSubmit={handleInvoiceSubmit}
          editId={invoiceEditId}
          onCancel={handleInvoiceFormClose}
        />
      </Dialog>
      <Divider>
        <Chip label="Deliveries" />
      </Divider>
      <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
        {invoice &&
          invoice.Deliveries.map((delivery) => {
            return (
              <DeliveryDisplay
                delivery={delivery}
                key={delivery.id}
                onDelete={() => setToDeleteId(delivery.id)}
                onEdit={() => handleDeliveryEdit(delivery.id)}
              />
            );
          })}
      </Box>
      <DeleteAlert
        message={`Are you sure you want to delete delivery #${toDeleteId} and its details.`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Delivery"
      />
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
}
