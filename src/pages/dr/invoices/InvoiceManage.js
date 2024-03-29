import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import http from "../../../http-common";
import NumericFormatRp from "../../../components/NumericFormatRp";
import IdDeliveryDisplay from "../../../components/dr/id/DeliveryDisplay";
import SgDeliveryDisplay from "../../../components/dr/sg/DeliveryDisplay";
import MyDeliveryDisplay from "../../../components/dr/my/DeliveryDisplay";
import IdDeliveryCreateForm from "../../../components/dr/id/DeliveryCreateForm";
import SgDeliveryCreateForm from "../../../components/dr/sg/DeliveryCreateForm";
import MyDeliveryCreateForm from "../../../components/dr/my/DeliveryCreateForm";

import InvoiceCreateForm from "../../../components/dr/InvoiceCreateForm";
import Typography from "@mui/material/Typography";
import ValueDisplay from "../../../components/ValueDisplay";
import DeleteAlert from "../../../components/DeleteAlert";

export default function InvoiceManage() {
  const [invoices, setInvoices] = useState([]);

  const [invoice, setInvoice] = useState(null);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [invoiceEditId, setInvoiceEditId] = useState(null);

  // ID Deliveries
  const [isIdDeliveryFormOpen, setIsIdDeliveryFormOpen] = useState(false);
  const [idDeliveryEditId, setIdDeliveryEditId] = useState(null);
  const [idToDeleteId, setIdToDeleteId] = useState(null);

  // SG Deliveries
  const [isSgDeliveryFormOpen, setIsSgDeliveryFormOpen] = useState(false);
  const [sgDeliveryEditId, setSgDeliveryEditId] = useState(null);
  const [sgToDeleteId, setSgToDeleteId] = useState(null);

  // SG Deliveries
  const [isMyDeliveryFormOpen, setIsMyDeliveryFormOpen] = useState(false);
  const [myDeliveryEditId, setMyDeliveryEditId] = useState(null);
  const [myToDeleteId, setMyToDeleteId] = useState(null);

  useEffect(() => {
    (async () => {
      setInvoices((await http.get("/dr/invoices?unpaid=yes")).data.data);
    })();
  }, []);

  const handleIdDeliveryFormClose = () => {
    setIdDeliveryEditId(null);
    setIsIdDeliveryFormOpen(false);
  };

  const handleSgDeliveryFormClose = () => {
    setSgDeliveryEditId(null);
    setIsSgDeliveryFormOpen(false);
  };

  const handleMyDeliveryFormClose = () => {
    setMyDeliveryEditId(null);
    setIsMyDeliveryFormOpen(false);
  };

  const handleInvoiceFormClose = () => {
    setIdDeliveryEditId(null);
    setIsInvoiceFormOpen(false);
  };

  const refreshInvoice = async (newInvoice) => {
    setInvoices((await http.get("/dr/invoices?unpaid=yes")).data.data);
    if (invoice && !newInvoice) {
      setInvoice((await http.get(`/dr/invoices/${invoice.id}`)).data.data);
    }
  };

  const handleIdDeliverySubmit = () => {
    handleIdDeliveryFormClose();
    refreshInvoice();
    setIdDeliveryEditId(null);
  };

  const handleSgDeliverySubmit = () => {
    handleSgDeliveryFormClose();
    refreshInvoice();
    setSgDeliveryEditId(null);
  };

  const handleMyDeliverySubmit = () => {
    handleMyDeliveryFormClose();
    refreshInvoice();
    setMyDeliveryEditId(null);
  };

  const handleInvoiceSubmit = async (invoiceId) => {
    refreshInvoice(true);
    setInvoice((await http.get(`/dr/invoices/${invoiceId}`)).data.data);
    handleInvoiceFormClose();
    setInvoiceEditId(null);
  };

  const handleIdDeliveryEdit = (id) => {
    setIdDeliveryEditId(id);
    setIsIdDeliveryFormOpen(true);
  };

  const handleSgDeliveryEdit = (id) => {
    setSgDeliveryEditId(id);
    setIsSgDeliveryFormOpen(true);
  };
  const handleMyDeliveryEdit = (id) => {
    setMyDeliveryEditId(id);
    setIsMyDeliveryFormOpen(true);
  };

  const handleInvoiceEdit = (id) => {
    setInvoiceEditId(id);
    setIsInvoiceFormOpen(true);
  };

  const handleIdDeliveryDelete = (id) => {
    (async () => {
      try {
        const delivery = (await http.delete(`/dr/id/deliveries/${id}`)).data
          .data;
        refreshInvoice();
        toast.success(`ID Delivery #${delivery.id} deleted.`);
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleSgDeliveryDelete = (id) => {
    (async () => {
      try {
        const delivery = (await http.delete(`/dr/sg/deliveries/${id}`)).data
          .data;
        refreshInvoice();
        toast.success(`SG Delivery #${delivery.id} deleted.`);
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleMyDeliveryDelete = (id) => {
    (async () => {
      try {
        const delivery = (await http.delete(`/dr/my/deliveries/${id}`)).data
          .data;
        refreshInvoice();
        toast.success(`MY Delivery #${delivery.id} deleted.`);
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };
  return (
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
        <Button
          variant="contained"
          onClick={() => setIsIdDeliveryFormOpen(true)}
        >
          Add New ID Delivery
        </Button>
        <Button
          variant="contained"
          onClick={() => setIsSgDeliveryFormOpen(true)}
        >
          Add New SG Delivery
        </Button>
        <Button
          variant="contained"
          onClick={() => setIsMyDeliveryFormOpen(true)}
        >
          Add New MY Delivery
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
                label={invoice.paid ? "paid" : "unpaid"}
                variant="outlined"
                color={invoice.paid ? "success" : "warning"}
              />
            </Box>

            <Box display="flex" gap={2} marginTop={2}>
              <Stack flex={1} gap={2}>
                <ValueDisplay label={"Date"} value={invoice.date} />
                <ValueDisplay
                  label={"Customer"}
                  value={invoice.customerFullName}
                />
                <ValueDisplay
                  label={"Note"}
                  value={invoice.note || "No notes."}
                />
              </Stack>
              <Stack flex={1} gap={2}>
                <ValueDisplay
                  label={"Total Points"}
                  value={invoice.totalPoints}
                />
                <ValueDisplay
                  label={"Discount"}
                  renderValue={() => (
                    <NumericFormatRp value={invoice.totalDiscount} />
                  )}
                />
                <ValueDisplay
                  label={"Total"}
                  renderValue={() => (
                    <NumericFormatRp value={invoice.totalPriceRP} />
                  )}
                />
              </Stack>
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
        open={isIdDeliveryFormOpen}
        onClose={handleIdDeliveryFormClose}
        maxWidth="xl"
      >
        <IdDeliveryCreateForm
          invoice={invoice}
          onSubmit={handleIdDeliverySubmit}
          editId={idDeliveryEditId}
          onCancel={handleIdDeliveryFormClose}
        />
      </Dialog>
      <Dialog
        open={isSgDeliveryFormOpen}
        onClose={handleSgDeliveryFormClose}
        maxWidth="xl"
      >
        <SgDeliveryCreateForm
          invoice={invoice}
          onSubmit={handleSgDeliverySubmit}
          editId={sgDeliveryEditId}
          onCancel={handleSgDeliveryFormClose}
        />
      </Dialog>

      <Dialog
        open={isMyDeliveryFormOpen}
        onClose={handleMyDeliveryFormClose}
        maxWidth="xl"
      >
        <MyDeliveryCreateForm
          invoice={invoice}
          onSubmit={handleMyDeliverySubmit}
          editId={myDeliveryEditId}
          onCancel={handleMyDeliveryFormClose}
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
        <Chip label="ID Deliveries" />
      </Divider>
      <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
        {invoice &&
          invoice.DrIdDeliveries.map((delivery) => {
            return (
              <IdDeliveryDisplay
                actions
                delivery={delivery}
                key={delivery.id}
                onDelete={() => setIdToDeleteId(delivery.id)}
                onEdit={() => handleIdDeliveryEdit(delivery.id)}
              />
            );
          })}
      </Box>
      <Divider>
        <Chip label="SG Deliveries" />
      </Divider>
      <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
        {invoice &&
          invoice.DrSgDeliveries.map((delivery) => {
            return (
              <SgDeliveryDisplay
                actions
                delivery={delivery}
                key={delivery.id}
                onDelete={() => setSgToDeleteId(delivery.id)}
                onEdit={() => handleSgDeliveryEdit(delivery.id)}
              />
            );
          })}
      </Box>
      <Divider>
        <Chip label="MY Deliveries" />
      </Divider>
      <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
        {invoice &&
          invoice.DrMyDeliveries.map((delivery) => {
            return (
              <MyDeliveryDisplay
                actions
                delivery={delivery}
                key={delivery.id}
                onDelete={() => setMyToDeleteId(delivery.id)}
                onEdit={() => handleMyDeliveryEdit(delivery.id)}
              />
            );
          })}
      </Box>
      <DeleteAlert
        message={`Are you sure you want to delete ID delivery #${idToDeleteId} and its details.`}
        toDeleteId={idToDeleteId}
        handleDelete={handleIdDeliveryDelete}
        setToDeleteId={setIdToDeleteId}
        objectName="ID Delivery"
      />
      <DeleteAlert
        message={`Are you sure you want to delete SG delivery #${idToDeleteId} and its details.`}
        toDeleteId={sgToDeleteId}
        handleDelete={handleSgDeliveryDelete}
        setToDeleteId={setSgToDeleteId}
        objectName="SG Delivery"
      />
      <DeleteAlert
        message={`Are you sure you want to delete MY delivery #${idToDeleteId} and its details.`}
        toDeleteId={myToDeleteId}
        handleDelete={handleMyDeliveryDelete}
        setToDeleteId={setMyToDeleteId}
        objectName="MY Delivery"
      />
    </Box>
  );
}
