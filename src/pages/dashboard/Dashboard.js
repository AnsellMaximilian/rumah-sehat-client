import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import http from "../../http-common";
import DashboardModule from "../../components/DashboardModule";

export default function Dashboard() {
  const [designatedSales, setDesignatedSales] = useState([]);

  useEffect(() => {
    (async () => {
      setDesignatedSales(
        (await http.get("/rs/purchases/designated-sales")).data.data
      );
    })();
  }, []);

  return (
    <Box>
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
              {
                headerName: "ID",
                field: "id",
              },
              {
                headerName: "Product",
                field: "product",
              },
              {
                headerName: "Qty",
                field: "qty",
              },
              {
                headerName: "Recipient",
                field: "recipient",
              },
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
