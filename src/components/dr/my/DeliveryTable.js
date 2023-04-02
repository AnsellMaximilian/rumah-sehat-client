import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import NumericFormatRp from "../../NumericFormatRp";
import NumericFormatRM from "../../NumericFormatRM";

export default function DrMyDeliveryTable({ delivery }) {
  const individualDelCost = delivery?.deliveryCostType === "individual";

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Points</TableCell>
            {individualDelCost && (
              <TableCell align="right">Delivery Cost</TableCell>
            )}
            <TableCell align="right">Price (RM)</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Total Points</TableCell>
            {individualDelCost && (
              <TableCell align="right">Total Delivery Cost</TableCell>
            )}

            <TableCell align="right">Total Price (RM)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {delivery.DrMyDeliveryDetails.map((detail) => (
            <TableRow
              key={detail.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {detail.itemName}
              </TableCell>
              <TableCell align="right">{detail.points}</TableCell>
              {individualDelCost && (
                <TableCell align="right">
                  <NumericFormatRp value={detail.deliveryCost} />
                </TableCell>
              )}

              <TableCell align="right">
                <NumericFormatRM value={detail.priceRM} />
              </TableCell>
              <TableCell align="right">{detail.qty}</TableCell>
              <TableCell align="right">{detail.totalPoints}</TableCell>

              {individualDelCost && (
                <TableCell align="right">
                  <NumericFormatRp value={detail.totalDeliveryCost} />
                </TableCell>
              )}
              <TableCell align="right">
                <NumericFormatRM value={detail.totalPriceRM} />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={individualDelCost ? 5 : 4} align="right">
              Subtotal
            </TableCell>
            <TableCell align="right">{delivery.subtotalPoints}</TableCell>
            {individualDelCost && (
              <TableCell align="right">
                <NumericFormatRp value={delivery.totalDeliveryCost} />
              </TableCell>
            )}

            <TableCell align="right">
              <NumericFormatRM value={delivery.subtotalPriceRM} />
            </TableCell>
          </TableRow>
          {delivery.DrDiscountModelId && (
            <TableRow>
              <TableCell colSpan={individualDelCost ? 5 : 4} align="right">
                Discount
              </TableCell>
              <TableCell align="right" colSpan={3}>
                <NumericFormatRp value={delivery.totalDiscount} />
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell colSpan={individualDelCost ? 5 : 4} align="right">
              Delivery
            </TableCell>
            <TableCell align="right" colSpan={3}>
              <NumericFormatRp value={delivery.cost} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={individualDelCost ? 5 : 4} align="right">
              Total
            </TableCell>
            <TableCell align="right" colSpan={3}>
              <NumericFormatRp value={delivery.totalPriceRP} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
