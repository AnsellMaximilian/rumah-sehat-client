import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";

// import moment from "moment";
import Table from "../Table";
import { getSubtotal, getTableColumn } from "../../helpers/rs";
import NumericFormatRp from "../NumericFormatRp";
import { useState } from "react";

export default function DeliveryDisplay({
  delivery,
  onDelete,
  onEdit,
  actions,
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Paper sx={{ paddingBottom: 2 }}>
      <Box xs={12} display="flex" alignItems="flex-start" paddingLeft={2}>
        <Box paddingY={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            #{delivery.id}
          </Typography>
        </Box>
        {actions && (
          <Box sx={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="warning"
              onClick={onEdit}
              sx={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                boxShadow: "none",
              }}
            >
              <EditIcon />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onDelete}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                boxShadow: "none",
              }}
            >
              <CloseIcon />
            </Button>
          </Box>
        )}
      </Box>
      <Grid container spacing={1} sx={{ padding: 2 }}>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Date</Typography>
          <Typography>{delivery.date}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Recipient</Typography>
          <Typography>{delivery.customerFullName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Note</Typography>
          <Typography>{delivery.note || "None"}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Delivery Type</Typography>
          <Typography>{delivery.DeliveryType.name}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">TOTAL</Typography>
          <Typography>
            <NumericFormatRp value={delivery.totalPrice} />
          </Typography>
        </Grid>
      </Grid>
      <Box display="flex" gap={2} marginRight={1}>
        <Box
          sx={{ backgroundColor: "primary.light", color: "white", flex: 1 }}
          display="flex"
          alignItems="center"
          paddingLeft={2}
        >
          <Typography>Details</Typography>
        </Box>
        <Button variant="outlined" onClick={() => setIsOpen(!isOpen)}>
          Collapse
        </Button>
      </Box>
      <Collapse in={isOpen}>
        <Table
          size="small"
          rows={delivery.DeliveryDetails}
          columns={[
            getTableColumn("Product", "productName"),
            getTableColumn("Cost", "cost", (row) => (
              <NumericFormatRp value={parseFloat(row.cost)} />
            )),
            getTableColumn("Price", "price", (row) => (
              <NumericFormatRp value={parseFloat(row.price)} />
            )),
            getTableColumn("Qty", "qty", (row) => parseFloat(row.qty)),
            getTableColumn(
              "Subtotal",
              "totalPrice",
              (row) => <NumericFormatRp value={parseFloat(row.totalPrice)} />,
              { align: "right" }
            ),
          ]}
          tableBottom={
            <>
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Subtotal
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp
                    value={parseInt(getSubtotal(delivery.DeliveryDetails))}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Delivery Cost
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp value={parseInt(delivery.cost)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Total
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp
                    value={parseInt(
                      getSubtotal(delivery.DeliveryDetails) +
                        parseInt(delivery.cost)
                    )}
                  />
                </TableCell>
              </TableRow>
            </>
          }
        />
      </Collapse>
    </Paper>
  );
}
