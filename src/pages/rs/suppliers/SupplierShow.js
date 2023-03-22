import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NumericFormatRp from "../../../components/NumericFormatRp";
import http from "../../../http-common";
import PrintIcon from "@mui/icons-material/Print";

import { Link } from "react-router-dom";
import ValueDisplay from "../../../components/ValueDisplay";
import AdjustmentForm from "../../../components/rs/AdjustmentForm";
import Table from "../../../components/Table";
import { getTableColumn } from "../../../helpers/rs";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import DeleteAlert from "../../../components/DeleteAlert";
import { toast } from "react-toastify";
import PurchaseAdjustmentForm from "../../../components/rs/PurchaseAdjustmentForm";

export default function SupplierShow() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);

  // Adjustments
  const [adjustmentFormOpen, setAdjustmentFormOpen] = useState(false);

  //edit
  const [adjustmentEditId, setAdjustmentEditId] = useState(null);

  //delete
  const [adjustmentDeleteId, setToDeleteId] = useState(null);

  const handleAdjustmentFormClose = () => setAdjustmentFormOpen(false);
  const handleAdjustmentSubmit = async () => {
    handleAdjustmentFormClose();
    setSupplier((await http.get(`/rs/suppliers/${id}`)).data.data);

    setAdjustmentEditId(null);
  };

  const handleAdjustmentEdit = (id) => {
    setAdjustmentEditId(id);
    setAdjustmentFormOpen(true);
  };

  const handleAdjustmentDelete = (id) => {
    (async () => {
      try {
        const adjustment = (await http.delete(`/rs/purchase-adjustments/${id}`))
          .data.data;
        setSupplier((await http.get(`/rs/suppliers/${supplier.id}`)).data.data);

        toast.success(`Adjustment #${adjustment.id} deleted.`);
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setSupplier((await http.get(`/rs/suppliers/${id}`)).data.data);
    })();
  }, [id]);
  return supplier ? (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Box display="flex" flexDirection="column">
              <Typography variant="subtitle" fontWeight="bold" color="GrayText">
                #{supplier.id}
              </Typography>
              <Typography variant="h5" fontWeight="bold" lineHeight={0.7}>
                {supplier.name}
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={2} marginTop={2}>
              {/* <ValueDisplay value={supplier.phone} label="Phone" />
              <ValueDisplay value={supplier.Region.name} label="Region" />
              <ValueDisplay value={supplier.address} label="Address" /> */}
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
              sx={{ marginTop: 2 }}
              size="small"
              rows={supplier.PurchaseAdjustments.map((adjustment) => ({
                id: adjustment.id,
                SourcePurchaseId: adjustment.SourcePurchaseId,
                amount: adjustment.amount,
                description: adjustment.description,
                AdjustmentId: adjustment.AdjustmentId,
              }))}
              columns={[
                getTableColumn("ID", "id"),
                getTableColumn("Purchase Source", "SourcePurchaseId"),
                getTableColumn("Amount", "amount"),
                getTableColumn("Description", "description"),
                getTableColumn("Adjustment", "AdjustmentId"),
                getTableColumn("Actions", "actions", (row) => (
                  <>
                    <IconButton
                      color="warning"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdjustmentEdit(row.id);
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
              <PurchaseAdjustmentForm
                SupplierId={supplier.id}
                onSubmit={handleAdjustmentSubmit}
                onCancel={handleAdjustmentFormClose}
                editId={adjustmentEditId}
              />
            </Dialog>
          </Paper>
        </Grid>
      </Grid>
      <DeleteAlert
        message={`Are you sure you want to delete adjustment #${adjustmentDeleteId}.`}
        toDeleteId={adjustmentDeleteId}
        handleDelete={handleAdjustmentDelete}
        setToDeleteId={setToDeleteId}
        objectName="Adjustment"
      />
    </>
  ) : (
    <h1>Loading...</h1>
  );
}
