import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DrMydDeliveryTable from "../../../../components/dr/my/DeliveryTable";
import http from "../../../../http-common";

export default function DrMyDeliveryShow() {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);

  useEffect(() => {
    (async () =>
      setDelivery((await http.get(`/dr/my/deliveries/${id}`)).data.data))();
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
        <DrMydDeliveryTable delivery={delivery} />
      </CardContent>
    </Card>
  ) : (
    <h1>Loading...</h1>
  );
}
