import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
// import Table from "@mui/material/Table";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NumericFormatRp from "../../../components/NumericFormatRp";
import http from "../../../http-common";
import PrintIcon from "@mui/icons-material/Print";
import { Link } from "react-router-dom";
import ValueDisplay from "../../../components/ValueDisplay";
import DeliveryDisplay from "../../../components/rs/DeliveryDisplay";
import { getTableColumn } from "../../../helpers/rs";
import Table from "../../../components/Table";
import { toast } from "react-toastify";
import DeleteAlert from "../../../components/DeleteAlert";
import { Dialog } from "@mui/material";
import AdjustmentForm from "../../../components/rs/AdjustmentForm";

const InvoiceShow = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  const [adjustmentFormOpen, setAdjustmentFormOpen] = useState(false);

  const [adjustmentEditId, setAdjustmentEditId] = useState(null);

  const [adjustmentDeleteId, setAdjustmentDeleteId] = useState(null);

  const handleAdjustmentFormClose = () => setAdjustmentFormOpen(false);
  const handleAdjustmentSubmit = async () => {
    handleAdjustmentFormClose();
    setInvoice((await http.get(`/rs/invoices/${invoice.id}`)).data.data);

    setAdjustmentEditId(null);
  };

  const handleAdjsutmentEdit = (id) => {
    setAdjustmentEditId(id);
    setAdjustmentFormOpen(true);
  };

  const handleAdjustmentDelete = (id) => {
    (async () => {
      try {
        const adjustment = (await http.delete(`/rs/adjustments/${id}`)).data
          .data;
        setInvoice((await http.get(`/rs/invoices/${invoice.id}`)).data.data);

        toast.success(`Adjustment #${adjustment.id} deleted.`);
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setInvoice((await http.get(`/rs/invoices/${id}`)).data.data);
    })();
  }, [id]);

  const pay = async () => {
    const invoice = (await http.patch(`/rs/invoices/${id}/pay`)).data.data;
    setInvoice(invoice);
  };

  return invoice ? (
    <Box>
      <Box display="flex" justifyContent="flex-end" marginBottom={1} gap={2}>
        <Button
          variant={invoice.paid ? "contained" : "outlined"}
          color="success"
          onClick={pay}
        >
          {invoice.paid ? "Paid" : invoice.status}
        </Button>
        <Button
          component={Link}
          to={`/rs/invoices/edit/${id}`}
          underline={"none"}
          variant="outlined"
        >
          Edit
        </Button>
        <Button
          href={` http://localhost:1107/rs/invoices/${id}/print`}
          target="__blank"
          component="a"
          variant="contained"
          color="error"
        >
          <PrintIcon color="white" />
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h6" fontWeight="bold">
                INVOICE #{invoice.id}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
              marginTop={2}
            >
              <ValueDisplay
                value={invoice.customerFullName}
                label="Invoiced To"
              />
              <ValueDisplay value={invoice.date} label="Date" />
              <ValueDisplay
                renderValue={() => (
                  <NumericFormatRp value={invoice.totalPrice} />
                )}
                label="Total"
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Box display="flex" justifyContent="space-between" gap={2}>
              <Typography variant="h6" fontWeight="bold">
                Adjustments
              </Typography>
              <Button
                variant="contained"
                onClick={() => setAdjustmentFormOpen(true)}
              >
                Create
              </Button>
            </Box>
            <Table
              size="small"
              rows={invoice.InvoiceAdjustments.map((adjustment) => ({
                id: adjustment.id,
                amount: adjustment.amount,
                description: adjustment.description,
                AdjustedInvoiceId: adjustment.AdjustedInvoiceId,
              }))}
              columns={[
                getTableColumn("ID", "id"),
                getTableColumn("Source", "SourceInvoiceId"),
                getTableColumn("Amount", "amount", (row) => (
                  <Typography color={row.amount > 0 ? "default" : "error"}>
                    <NumericFormatRp value={row.amount} />
                  </Typography>
                )),
                getTableColumn("Description", "description"),
                getTableColumn("Actions", "actions", (row) => (
                  <>
                    <IconButton
                      color="warning"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdjsutmentEdit(row.id);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAdjustmentDeleteId(row.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </>
                )),
              ]}
            />
            <Dialog
              open={adjustmentFormOpen}
              onClose={handleAdjustmentFormClose}
              maxWidth="xl"
            >
              <AdjustmentForm
                CustomerId={invoice.CustomerId}
                onSubmit={handleAdjustmentSubmit}
                onCancel={handleAdjustmentFormClose}
                editId={adjustmentEditId}
                AdjustedInvoiceId={invoice.id}
              />
            </Dialog>
          </Paper>
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: 2 }}>
        <Chip label="Deliveries" />
      </Divider>
      <Box marginTop={2} display="flex" flexDirection="column" gap={2}>
        {invoice.Deliveries.map((delivery) => {
          return (
            <DeliveryDisplay
              // actions
              delivery={delivery}
              key={delivery.id}
              // onDelete={() => setAdjustmentDeleteId(delivery.id)}
              // onEdit={() => handleDeliveryEdit(delivery.id)}
            />
          );
        })}
      </Box>
      <DeleteAlert
        message={`Are you sure you want to delete adjustment #${adjustmentDeleteId}.`}
        toDeleteId={adjustmentDeleteId}
        handleDelete={handleAdjustmentDelete}
        setToDeleteId={setAdjustmentDeleteId}
        objectName="Adjustment"
      />
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default InvoiceShow;
