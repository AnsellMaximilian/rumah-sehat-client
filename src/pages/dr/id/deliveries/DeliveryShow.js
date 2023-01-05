import {
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NumericFormatRp from "../../../../components/NumericFormatRp";
import http from "../../../../http-common";

export default function DrIdDeliveryShow() {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  useEffect(() => {
    (async () =>
      setDelivery((await http.get(`/dr/id/deliveries/${id}`)).data.data))();
  }, [id]);
  return delivery ? (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Delivery #{id}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle" gutterBottom color="gray" margin={0}>
              Customer
            </Typography>
            <Typography variant="h6" gutterBottom display="block" margin={0}>
              {delivery.customerFullName}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="subtitle" gutterBottom color="gray" margin={0}>
              Delivery Date
            </Typography>
            <Typography variant="h6" gutterBottom display="block" margin={0}>
              {delivery.date}
            </Typography>
          </Grid>
        </Grid>
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
      </CardContent>
    </Card>
  ) : (
    <h1>Loading...</h1>
  );
}
