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
import Table from "../../Table";
import { getTableColumn } from "../../../helpers/rs";
import NumericFormatRp from "../../NumericFormatRp";
import { useState } from "react";
import NumericFormatRM from "../../NumericFormatRM";

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
          <Typography variant="subtitle2">Delivery Cost Type</Typography>
          <Typography>{delivery.deliveryCostType}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Subtotal</Typography>
          <Typography>
            <NumericFormatRp value={delivery.subtotalPriceRPAndDeliveryCost} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">TOTAL</Typography>
          <Typography>
            <NumericFormatRp value={delivery.totalPriceRP} />
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
          rows={delivery.DrMyDeliveryDetails}
          columns={[
            getTableColumn("Item", "itemName"),

            getTableColumn("Points", "points", null, { align: "right" }),
            ...(delivery.deliveryCostType === "individual"
              ? [
                  getTableColumn(
                    "Delivery Cost",
                    "deliveryCost",
                    (row) => (
                      <NumericFormatRp value={parseFloat(row.deliveryCost)} />
                    ),

                    { align: "right" }
                  ),
                ]
              : []),
            getTableColumn(
              "Price",
              "priceRM",
              (row) => <NumericFormatRM value={parseFloat(row.priceRM)} />,

              { align: "right" }
            ),
            getTableColumn(
              "Qty",
              "qty",
              (row) => parseFloat(row.qty),

              { align: "center" }
            ),

            getTableColumn("Subtotal Points", "totalPoints", null, {
              align: "right",
            }),
            ...(delivery.deliveryCostType === "individual"
              ? [
                  getTableColumn(
                    "Total Delivery Cost",
                    "totalDeliveryCost",
                    (row) => (
                      <NumericFormatRp
                        value={parseFloat(row.totalDeliveryCost)}
                      />
                    ),
                    { align: "right" }
                  ),
                ]
              : []),
            getTableColumn(
              "Subtotal Price",
              "totalPriceRM",
              (row) => <NumericFormatRM value={parseFloat(row.totalPriceRM)} />,
              { align: "right" }
            ),
          ]}
          tableBottom={
            <>
              <TableRow>
                <TableCell
                  colSpan={delivery.deliveryCostType === "individual" ? 5 : 4}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Subtotal
                </TableCell>
                <TableCell align="right">{delivery.subtotalPoints}</TableCell>
                {delivery.deliveryCostType === "individual" && (
                  <TableCell align="right">
                    <NumericFormatRp value={delivery.totalDeliveryCost} />
                  </TableCell>
                )}
                <TableCell align="right">
                  <NumericFormatRp value={parseInt(delivery.subtotalPriceRM)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={delivery.deliveryCostType === "individual" ? 7 : 5}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Subtotal (Rp)
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp
                    value={parseInt(delivery.subtotalPriceRPAndDeliveryCost)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={delivery.deliveryCostType === "individual" ? 7 : 5}
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
                  colSpan={delivery.deliveryCostType === "individual" ? 7 : 5}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Total
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp value={delivery.totalPriceRP} />
                </TableCell>
              </TableRow>
            </>
          }
        />
      </Collapse>
    </Paper>
  );
}
