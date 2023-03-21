import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import http from "../../http-common";
import DashboardModule from "../../components/DashboardModule";
import { getTableColumn } from "../../helpers/rs";
import NumericFormatRp from "../../components/NumericFormatRp";

export default function Dashboard() {
  const [designatedSales, setDesignatedSales] = useState([]);
  const [activeInvoices, setActiveInvoices] = useState([]);
  const [danglingAdjustments, setDanglingAdjustments] = useState([]);

  useEffect(() => {
    (async () => {
      setDesignatedSales(
        (await http.get("/rs/purchases/designated-sales")).data.data
      );
      setActiveInvoices((await http.get("/rs/invoices?active=yes")).data.data);
      setDanglingAdjustments(
        (await http.get("/rs/adjustments?pending=yes")).data.data
      );
    })();
  }, []);
  return (
    <Box paddingY={2}>
      <Grid container spacing={2}>
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
            title={`Active Invoices (${activeInvoices.length})`}
            linkText={`See more (${activeInvoices.slice(5).length})`}
            linkTo="/rs/invoices"
            rows={activeInvoices
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
      </Grid>
    </Box>
  );
}
