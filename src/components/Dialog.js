import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function CustomDialog({
  description,
  title,
  open,
  action,
  actionLabel,
  children,
  onClose,
  maxWidth,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      // full width
      fullWidth
      maxWidth={maxWidth}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {action && (
          <Button
            variant="contained"
            onClick={() => {
              action();
            }}
            autoFocus
          >
            {actionLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
