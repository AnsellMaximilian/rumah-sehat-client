import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import http from "../../http-common";
import DashboardModule from "../../components/DashboardModule";
import { getTableColumn } from "../../helpers/rs";
import NumericFormatRp from "../../components/NumericFormatRp";
import DashboardInfo from "../../components/DashboardInfo";

export default function Dashboard() {
  const [designatedSales, setDesignatedSales] = useState([]);
  const [danglingAdjustments, setDanglingAdjustments] = useState([]);
  const [danglingPurchases, setDanglingPurchases] = useState([]);
  const [draftInvoices, setDraftInvoices] = useState([]);

  const [pendingInvoices, setPendingInvoices] = useState([]);

  const [info, setInfo] = useState(null);

  useEffect(() => {
    (async () => {
      setDesignatedSales(
        (await http.get("/rs/purchases/designated-sales")).data.data
      );
      setDraftInvoices((await http.get("/rs/invoices?status=draft")).data.data);
      setPendingInvoices(
        (await http.get("/rs/invoices?status=pending")).data.data
      );
      setDanglingAdjustments(
        (await http.get("/rs/adjustments?pending=yes")).data.data
      );
      setDanglingPurchases(
        (await http.get("/rs/purchases?invoiced=false")).data.data
      );

      setInfo((await http.get("/info")).data.data);
    })();
  }, []);
  return (
    <Box paddingY={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Info
            </Typography>

            <DashboardInfo label="Database" value={info?.dbName} />
            <DashboardInfo label="Timestamp" value={info?.serverTimestamp} />
          </Paper>
        </Grid>

        <Grid item xs={6} container alignItems="stretch">
          <DashboardModule
            title={`Dangling Designated Sales (${designatedSales.length})`}
            linkText={`See more (${designatedSales.slice(5).length})`}
            linkTo="/rs/purchases"
            rows={designatedSales
              .map((sale) => ({
                id: sale.id,
                product: sale.Product.name,
                qty: sale.qty,
                recipient: sale.Customer.fullName,
              }))
              .slice(0, 5)}
            columns={[
              getTableColumn("ID", "id"),
              getTableColumn("Product", "product"),
              getTableColumn("Qty", "qty"),
              getTableColumn("Recipient", "recipient"),
            ]}
          />
        </Grid>
        <Grid item xs={6} container alignItems="stretch">
          <DashboardModule
            title={`Draft Invoices (${draftInvoices.length})`}
            linkText={`See more (${draftInvoices.slice(5).length})`}
            linkTo="/rs/invoices"
            rows={draftInvoices
              .map((invoice) => ({
                id: invoice.id,
                total: invoice.totalPrice,
                customer: invoice.Customer.fullName,
              }))
              .slice(0, 5)}
            columns={[
              getTableColumn("ID", "id"),
              getTableColumn("Customer", "customer"),
              getTableColumn("Total", "total", (row) => (
                <NumericFormatRp value={row.total} />
              )),
            ]}
          />
        </Grid>
        <Grid item xs={6} container alignItems="stretch">
          <DashboardModule
            title={`Pending Invoices (${pendingInvoices.length})`}
            linkText={`See more (${pendingInvoices.slice(5).length})`}
            linkTo="/rs/invoices"
            rows={pendingInvoices
              .map((invoice) => ({
                id: invoice.id,
                total: invoice.totalPrice,
                customer: invoice.Customer.fullName,
              }))
              .slice(0, 5)}
            columns={[
              getTableColumn("ID", "id"),
              getTableColumn("Customer", "customer"),
              getTableColumn("Total", "total", (row) => (
                <NumericFormatRp value={row.total} />
              )),
            ]}
          />
        </Grid>
        <Grid item xs={6} container alignItems="stretch">
          <DashboardModule
            title={`Dangling Adjustments (${danglingAdjustments.length})`}
            linkText={`See more (${danglingAdjustments.slice(5).length})`}
            linkTo="/rs/invoices"
            rows={danglingAdjustments
              .map((adj) => ({
                id: adj.id,
                source: adj.SourceInvoiceId,
                customer: adj.Customer.fullName,
                amount: adj.amount,
              }))
              .slice(0, 5)}
            columns={[
              getTableColumn("ID", "id"),
              getTableColumn("Customer", "customer"),
              getTableColumn("Amount", "amount", (row) => (
                <NumericFormatRp value={row.amount} />
              )),
              getTableColumn("Source", "source"),
            ]}
          />
        </Grid>

        <Grid item xs={6} container alignItems="stretch">
          <DashboardModule
            title={`Dangling Purchases (${danglingPurchases.length})`}
            linkText={`See more (${danglingPurchases.slice(5).length})`}
            linkTo="/rs/purchases"
            rows={danglingPurchases
              .map((pr) => ({
                id: pr.id,
                supplier: pr.Supplier.name,
                total: pr.totalPrice,
              }))
              .slice(0, 5)}
            columns={[
              getTableColumn("ID", "id"),
              getTableColumn("Supplier", "supplier"),
              getTableColumn("Total", "total", (row) => (
                <NumericFormatRp value={row.total} />
              )),
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
