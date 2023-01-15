import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DrIdDeliveryTable from "../../../components/dr/id/DeliveryTable";
import DrSgDeliveryTable from "../../../components/dr/sg/DeliveryTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import http from "../../../http-common";
import PrintIcon from "@mui/icons-material/Print";

const DrInvoiceShow = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    (async () => {
      setInvoice((await http.get(`/dr/invoices/${id}`)).data.data);
    })();
  }, [id]);
  return invoice ? (
    <Box>
      <Box display="flex" justifyContent="flex-end" marginBottom={1}>
        <Button
          href={` http://localhost:1107/dr/invoices/${id}/print`}
          target="__blank"
          component="a"
          variant="contained"
          color="error"
          sx={{ marginLeft: "auto" }}
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
              Invoice
            </Typography>
            <Typography variant="subtitle1">Dr's Secret</Typography>
          </Box>
          <Box padding={2}>
            <Typography variant="title" component="h1">
              Invoice #{invoice.id}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box display="flex" justifyContent="space-between" marginY={2}>
          <Box paddingX={2}>
            <Box marginBottom={2}>
              <Typography variant="subtitle2">DATE</Typography>
              <Typography>
                {moment(invoice.date).format("DD/MM/YYYY")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">INVOICED TO</Typography>
              <Typography>{invoice.recipient}</Typography>
            </Box>
          </Box>
          <Box paddingX={2}>
            <Typography variant="subtitle2" textAlign="right">
              PEMBAYARAN
            </Typography>
            <Typography>BCA: 035 0889191 (F.M. Fenty Effendy)</Typography>
          </Box>
        </Box>

        <Divider />

        {/* INDONESIA */}
        {invoice.DrIdDeliveries.length > 0 && (
          <Box marginTop={2}>
            <Box sx={{ backgroundColor: "primary.main", color: "white" }}>
              <Typography
                textAlign="center"
                variant="subtitle1"
                fontWeight="bold"
              >
                Indonesia
              </Typography>
            </Box>
            {invoice.DrIdDeliveries.map((delivery, index) => (
              <Box
                key={delivery.id}
                sx={{
                  borderBottom: "0.5rem solid",
                  borderColor:
                    invoice.DrIdDeliveries.length - 1 === index
                      ? "transparent"
                      : "primary.main",
                }}
                marginBottom={2}
              >
                <Box paddingX={2} display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="caption">DELIVERY #</Typography>
                    <Typography variant="subtitle2">{delivery.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption">DELIVERY DATE</Typography>
                    <Typography variant="subtitle2">{delivery.date}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption">RECIPIENT</Typography>
                    <Typography variant="subtitle2">
                      {delivery.customerFullName}
                    </Typography>
                  </Box>
                </Box>
                <DrIdDeliveryTable delivery={delivery} />
              </Box>
            ))}
          </Box>
        )}

        {/* SINGAPORE */}
        {invoice.DrSgDeliveries.length > 0 && (
          <Box marginTop={2}>
            <Box sx={{ backgroundColor: "primary.main", color: "white" }}>
              <Typography
                textAlign="center"
                variant="subtitle1"
                fontWeight="bold"
              >
                Singapore
              </Typography>
            </Box>
            {invoice.DrSgDeliveries.map((delivery, index) => (
              <Box
                key={delivery.id}
                marginBottom={2}
                sx={{
                  borderBottom: "0.5rem solid",
                  borderColor:
                    invoice.DrSgDeliveries.length - 1 === index
                      ? "transparent"
                      : "primary.main",
                }}
              >
                <Box paddingX={2} display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="caption">DELIVERY #</Typography>
                    <Typography variant="subtitle2">{delivery.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption">DELIVERY DATE</Typography>
                    <Typography variant="subtitle2">{delivery.date}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption">RECIPIENT</Typography>
                    <Typography variant="subtitle2">
                      {delivery.customerFullName}
                    </Typography>
                  </Box>
                </Box>
                <DrSgDeliveryTable delivery={delivery} />
              </Box>
            ))}
          </Box>
        )}
        <Box
          textAlign="right"
          padding={2}
          sx={{ backgroundColor: "primary.main", color: "white" }}
        >
          <Typography variant="h5" fontWeight="bold">
            AMOUNT DUE
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            <NumericFormatRp value={invoice.totalPriceRP} />
          </Typography>
        </Box>
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default DrInvoiceShow;
