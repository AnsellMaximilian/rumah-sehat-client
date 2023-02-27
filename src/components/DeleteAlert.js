import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function DeleteAlert({
  toDeleteId,
  setToDeleteId,
  handleDelete,
  objectName,
  message,
}) {
  return (
    <Dialog
      open={toDeleteId !== null}
      onClose={() => setToDeleteId(null)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete {objectName.toLowerCase()} with ID {toDeleteId}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setToDeleteId(null)}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setToDeleteId(null);
            handleDelete(toDeleteId);
          }}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
