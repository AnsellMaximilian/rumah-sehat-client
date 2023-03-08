import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import http from "../../http-common";
import DashboardModule from "../../components/DashboardModule";
import { getTableColumn } from "../../helpers/rs";

export default function Dashboard() {
  const [designatedSales, setDesignatedSales] = useState([]);
  const [activeInvoices, setActiveInvoices] = useState([]);

  useEffect(() => {
    (async () => {
      setDesignatedSales(
        (await http.get("/rs/purchases/designated-sales")).data.data
      );
      setActiveInvoices((await http.get("/rs/invoices?active=yes")).data.data);
    })();
  }, []);
  console.log(activeInvoices);
  return (
    <Box paddingY={2}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DashboardModule
            title="Dangling Designated Sales"
            rows={designatedSales.map((sale) => ({
              id: sale.id,
              product: sale.Product.name,
              qty: sale.qty,
              recipient: sale.Customer.fullName,
            }))}
            columns={[
              getTableColumn("ID", "id"),
              getTableColumn("Product", "product"),
              getTableColumn("Qty", "qty"),
              getTableColumn("Recipient", "recipient"),
            ]}
          />
        </Grid>
        <Grid item xs={6}>
          <DashboardModule
            title="Active Invoices"
            rows={activeInvoices.map((invoice) => ({
              id: invoice.id,
              total: invoice.totalPrice,
              customer: invoice.Customer.fullName,
            }))}
            columns={[
              getTableColumn("ID", "id"),
              getTableColumn("Customer", "customer"),
              getTableColumn("Total", "total"),
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
