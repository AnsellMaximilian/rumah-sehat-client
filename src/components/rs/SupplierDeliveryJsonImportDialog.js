import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

import { parseSupplierDeliveryDraft } from "../../helpers/supplierDeliveryDraft";

export default function SupplierDeliveryJsonImportDialog({
  open,
  onClose,
  onImport,
  hasExistingRows,
  context,
}) {
  const [rawJson, setRawJson] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open]);

  const handleImport = () => {
    try {
      const draft = parseSupplierDeliveryDraft(rawJson, context);
      onImport(draft);
      setRawJson("");
      setError("");
      onClose();
    } catch (importError) {
      setError(importError.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Import supplier-delivery JSON</DialogTitle>
      <DialogContent>
        <DialogContentText marginBottom={2}>
          Paste a reviewed deliveryPayload from the invoice reader. Loading it
          fills this form only; it does not create the delivery.
        </DialogContentText>
        {hasExistingRows && (
          <Alert severity="warning" sx={{ marginBottom: 2 }}>
            Loading a draft will replace the product rows currently in this
            form.
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={14}
          label="Supplier delivery JSON"
          placeholder={'{\n  "InvoiceId": 9249,\n  "mode": "supplier",\n  ...\n}'}
          value={rawJson}
          onChange={(event) => {
            setRawJson(event.target.value);
            if (error) setError("");
          }}
          inputProps={{ spellCheck: false }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={!rawJson.trim()}
        >
          Load into form
        </Button>
      </DialogActions>
    </Dialog>
  );
}
