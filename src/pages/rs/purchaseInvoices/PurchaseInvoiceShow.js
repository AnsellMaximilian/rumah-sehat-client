import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import http from "../../../http-common";
import { useParams } from "react-router-dom";
import NumericFormatRp from "../../../components/NumericFormatRp";

export default function PurchaseInvoiceShow() {
  const { id } = useParams();

  const [purchaseInvoice, setPurchaseInvoice] = useState(null);

  useEffect(() => {
    (async () => {
      const fetchedPurchaseInvoice = (
        await http.get(`/rs/purchase-invoices/${id}`)
      ).data.data;
      setPurchaseInvoice(fetchedPurchaseInvoice);
    })();
  }, [id]);

  return purchaseInvoice ? (
    <Paper sx={{ paddingX: 4, paddingY: 2 }}>
      <Stack marginBottom={4}>
        <Typography fontSize={24} fontWeight="bold">
          Purchase Invoice #{purchaseInvoice.id}
        </Typography>
        <Typography fontSize={20} fontWeight="medium">
          {purchaseInvoice.Supplier.name}
        </Typography>
      </Stack>
      <Stack>
        <Box display="flex" gap={2}>
          <Typography fontWeight="bold">Date</Typography>
          <Typography>{purchaseInvoice.date}</Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Typography fontWeight="bold">Note</Typography>
          <Typography>
            {purchaseInvoice.note ? purchaseInvoice.note : "No notes."}
          </Typography>
        </Box>
      </Stack>
      <Box>
        <Box marginTop={2}>
          <Box display="flex" gap={1}>
            <Box
              sx={{ backgroundColor: "primary.dark", color: "white" }}
              padding={1}
              flex={1}
            >
              Purchases
            </Box>
          </Box>
        </Box>
        <Box>
          <TableContainer sx={{ marginTop: 1 }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">Purchase ID</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Product</TableCell>
                  <TableCell align="right">Buy Price</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseInvoice.Purchases.reduce((pd, p) => {
                  const detailRows = p.PurchaseDetails.map((detail) => {
                    return (
                      <TableRow
                        key={detail.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left">{detail.id}</TableCell>
                        <TableCell align="left">{p.id}</TableCell>
                        <TableCell align="left">{p.date}</TableCell>

                        <TableCell align="left">
                          {detail.Product.name}
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormatRp value={detail.price} />
                        </TableCell>
                        <TableCell align="right">{detail.qty}</TableCell>
                        <TableCell align="right">
                          <NumericFormatRp value={detail.totalPrice} />
                        </TableCell>
                      </TableRow>
                    );
                  });
                  return [...pd, ...detailRows];
                }, [])}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="right"
                    component="th"
                    sx={{ fontWeight: "500" }}
                  >
                    Grand Total
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={purchaseInvoice.totalPrice} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Paper>
  ) : (
    <Typography>Loading...</Typography>
  );
}
