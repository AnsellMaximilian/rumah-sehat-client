import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NumericFormatRp from "../../../components/NumericFormatRp";
import http from "../../../http-common";
import PrintIcon from "@mui/icons-material/Print";

const PurchaseShow = () => {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    (async () => {
      setPurchase((await http.get(`/rs/purchases/${id}`)).data.data);
    })();
  }, [id]);
  return purchase ? (
    <Box>
      <Box display="flex" justifyContent="flex-end" marginBottom={1} gap={2}>
        <Button
          color="warning"
          variant="outlined"
          component={Link}
          to={`/rs/purchases/edit/${id}`}
        >
          Edit
        </Button>
        {purchase.Delivery && (
          <Button
            color="primary"
            variant="outlined"
            component={Link}
            to={`/rs/deliveries/${purchase.Delivery.id}`}
          >
            Delivery #{purchase.Delivery.id}
          </Button>
        )}
        <Button
          href={` http://localhost:1107/rs/purchases/${id}/print`}
          target="__blank"
          component="a"
          variant="contained"
          color="error"
        >
          <PrintIcon color="white" />
        </Button>
      </Box>
      <Box component={Paper}>
        <Box
          display="flex"
          paddingY={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              padding: 2,
              width: "60%",
            }}
          >
            <Typography variant="title" component="h1">
              Purchase
            </Typography>
          </Box>
          <Box padding={2}>
            <Typography variant="title" component="h1">
              Purchase #{purchase.id}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box display="flex" justifyContent="space-between" marginY={2}>
          <Box paddingX={2}>
            <Box marginBottom={2}>
              <Typography variant="subtitle2">DATE</Typography>
              <Typography>
                {moment(purchase.date).format("DD/MM/YYYY")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">SUPPLIER</Typography>
              <Typography>{purchase.Supplier.name}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box marginTop={2}>
          <TableContainer sx={{ marginTop: 2 }}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Designated Recipient</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchase.PurchaseDetails.map((detail) => (
                  <TableRow
                    key={detail.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {detail.Customer ? detail.Customer.fullName : "None"}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {detail.productName}
                    </TableCell>
                    <TableCell align="right">
                      <NumericFormatRp value={detail.price} />
                    </TableCell>
                    <TableCell align="right">{detail.qty}</TableCell>
                    <TableCell align="right">
                      <NumericFormatRp value={detail.totalPrice} />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Subtotal
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={purchase.subtotalPrice} />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Delivery
                  </TableCell>
                  <TableCell align="right" colSpan={2}>
                    <NumericFormatRp value={purchase.cost} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Total
                  </TableCell>
                  <TableCell align="right" colSpan={2}>
                    <NumericFormatRp value={purchase.totalPrice} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box
          textAlign="right"
          padding={2}
          sx={{ backgroundColor: "primary.main", color: "white" }}
        >
          <Typography variant="h5" fontWeight="bold">
            AMOUNT DUE
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            <NumericFormatRp value={purchase.totalPrice} />
          </Typography>
        </Box>
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default PurchaseShow;
