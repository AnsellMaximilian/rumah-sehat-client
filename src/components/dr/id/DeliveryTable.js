import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import NumericFormatRp from "../../NumericFormatRp";

export default function DrIdDeliveryTable({ delivery }) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell align="right">Price (Rp)</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Total Points</TableCell>
            <TableCell align="right">Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {delivery.DrIdDeliveryDetails.map((detail) => (
            <TableRow
              key={detail.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {detail.itemName}
              </TableCell>
              <TableCell align="right">{detail.points}</TableCell>
              <TableCell align="right">
                <NumericFormatRp value={detail.priceRP} />
              </TableCell>
              <TableCell align="right">{detail.qty}</TableCell>
              <TableCell align="right">{detail.totalPoints}</TableCell>
              <TableCell align="right">
                <NumericFormatRp value={detail.totalPriceRP} />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} align="right">
              Subtotal
            </TableCell>
            <TableCell align="right">{delivery.subtotalPoints}</TableCell>
            <TableCell align="right">
              <NumericFormatRp value={delivery.subtotalPriceRP} />
            </TableCell>
          </TableRow>
          {delivery.DrDiscountModelId && (
            <TableRow>
              <TableCell colSpan={4} align="right">
                Discount
              </TableCell>
              <TableCell align="right" colSpan={2}>
                <NumericFormatRp value={delivery.totalDiscount} />
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell colSpan={4} align="right">
              Delivery
            </TableCell>
            <TableCell align="right" colSpan={2}>
              <NumericFormatRp value={delivery.cost} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4} align="right">
              Total
            </TableCell>
            <TableCell align="right" colSpan={2}>
              <NumericFormatRp value={delivery.totalPriceRP} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
