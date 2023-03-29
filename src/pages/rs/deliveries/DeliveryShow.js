import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NumericFormatRp from "../../../components/NumericFormatRp";
import http from "../../../http-common";
import PrintIcon from "@mui/icons-material/Print";
import DeliveryDisplay from "../../../components/rs/DeliveryDisplay";
import { getTableColumn } from "../../../helpers/rs";
import Table from "../../../components/Table";
import { toast } from "react-toastify";
import DeleteAlert from "../../../components/DeleteAlert";
import { Dialog } from "@mui/material";
import AdjustmentForm from "../../../components/rs/AdjustmentForm";
import InvoiceDisplay from "../invoices/InvoiceDisplay";

const DeliveryShow = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [switchFormOpen, setSwitchFormOpen] = useState(false);

  const [draftInvoices, setDraftInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleSwitchFormClose = () => setSwitchFormOpen(false);

  useEffect(() => {
    (async () => {
      setDelivery((await http.get(`/rs/deliveries/${id}`)).data.data);
      setDraftInvoices((await http.get("/rs/invoices?status=draft")).data.data);
    })();
  }, [id]);

  useEffect(() => {
    if (delivery && delivery.Invoice) setSelectedInvoice(delivery.Invoice);
  }, [delivery]);

  const switchInvoice = async () => {
    try {
      if (!selectedInvoice) throw new Error("Please select invoice.");
      const res = (
        await http.patch(`/rs/deliveries/${id}/switch-invoice`, {
          InvoiceId: selectedInvoice.id,
        })
      ).data.data;
      setDelivery((await http.get(`/rs/deliveries/${id}`)).data.data);

      if (res) toast.success("Switched invoice.");
      handleSwitchFormClose();
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return delivery ? (
    <Box marginBottom={4}>
      <Box display="flex" justifyContent="flex-end" marginBottom={1} gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSwitchFormOpen(true)}
        >
          Switch Invoice
        </Button>
      </Box>
      <DeliveryDisplay delivery={delivery} />
      <Divider sx={{ marginTop: 2 }}>
        <Chip label="Invoice" />
      </Divider>
      <Card sx={{ padding: 2, marginTop: 2 }}>
        <InvoiceDisplay invoice={delivery.Invoice} />
      </Card>
      <Dialog
        open={switchFormOpen}
        onClose={handleSwitchFormClose}
        maxWidth="xl"
      >
        {draftInvoices.length > 0 ? (
          delivery.Invoice && delivery.Invoice.status !== "draft" ? (
            <h1>Source invoice has to be a draft.</h1>
          ) : (
            <Box componen={Paper} padding={2}>
              <Box display="flex" gap={2}>
                <Autocomplete
                  value={selectedInvoice}
                  onChange={(e, newValue) => {
                    setSelectedInvoice(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.id} - {option.customerFullName}
                    </li>
                  )}
                  getOptionLabel={(option) =>
                    `(#${option.id}) ${option.customerFullName}`
                  }
                  options={draftInvoices}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ width: 300 }}
                      label="Invoice"
                    />
                  )}
                />
                <Button variant="contained" onClick={switchInvoice}>
                  Switch
                </Button>
              </Box>
            </Box>
          )
        ) : (
          <h1>Loading draft invoices...</h1>
        )}
      </Dialog>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default DeliveryShow;
