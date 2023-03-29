import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../http-common";
import { Link } from "react-router-dom";

import ValueDisplay from "../../components/ValueDisplay";
import AdjustmentForm from "../../components/rs/AdjustmentForm";
import Table from "../../components/Table";
import { getTableColumn } from "../../helpers/rs";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import DeleteAlert from "../../components/DeleteAlert";
import { toast } from "react-toastify";

export default function CustomerShow() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  // Adjustments
  const [adjustmentFormOpen, setAdjustmentFormOpen] = useState(false);

  //edit
  const [editId, setEditId] = useState(null);

  //delete
  const [toDeleteId, setToDeleteId] = useState(null);

  const handleAdjustmentFormClose = () => setAdjustmentFormOpen(false);
  const handleAdjustmentSubmit = async () => {
    handleAdjustmentFormClose();
    setCustomer((await http.get(`/customers/${id}`)).data.data);

    setEditId(null);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setAdjustmentFormOpen(true);
  };

  const handleDelete = (id) => {
    (async () => {
      try {
        const adjustment = (await http.delete(`/rs/adjustments/${id}`)).data
          .data;
        setCustomer((await http.get(`/customers/${customer.id}`)).data.data);

        toast.success(`Adjustment #${adjustment.id} deleted.`);
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setCustomer((await http.get(`/customers/${id}`)).data.data);
    })();
  }, [id]);
  return customer ? (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Box display="flex" flexDirection="column">
              <Typography variant="subtitle" fontWeight="bold" color="GrayText">
                #{customer.id}
              </Typography>
              <Typography variant="h5" fontWeight="bold" lineHeight={0.7}>
                {customer.fullName}
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={2} marginTop={2}>
              <ValueDisplay value={customer.phone} label="Phone" />
              <ValueDisplay value={customer.Region.name} label="Region" />
              <ValueDisplay value={customer.address} label="Address" />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={8}>
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
              sx={{ marginTop: 2 }}
              size="small"
              rows={customer.Adjustments.map((adjustment) => ({
                id: adjustment.id,
                SourceInvoiceId: adjustment.SourceInvoiceId,
                amount: adjustment.amount,
                description: adjustment.description,
                AdjustedInvoiceId: adjustment.AdjustedInvoiceId,
              }))}
              columns={[
                getTableColumn("ID", "id"),
                getTableColumn("Source", "SourceInvoiceId"),
                getTableColumn("Amount", "amount"),
                getTableColumn("Description", "description"),
                getTableColumn("Adjusted", "AdjustedInvoiceId", (row) => (
                  <Link to={`/rs/invoices/${row.AdjustedInvoiceId}`}>
                    #{row.AdjustedInvoiceId}
                  </Link>
                )),
                getTableColumn("Actions", "actions", (row) => (
                  <>
                    <IconButton
                      color="warning"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(row.id);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setToDeleteId(row.id);
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
                CustomerId={customer.id}
                onSubmit={handleAdjustmentSubmit}
                onCancel={handleAdjustmentFormClose}
                editId={editId}
              />
            </Dialog>
          </Paper>
        </Grid>
      </Grid>
      <DeleteAlert
        message={`Are you sure you want to delete adjustment #${toDeleteId}.`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Adjustment"
      />
    </>
  ) : (
    <h1>Loading...</h1>
  );
}
