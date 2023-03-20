import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NumericFormatRp from "../../components/NumericFormatRp";
import http from "../../http-common";
import PrintIcon from "@mui/icons-material/Print";
import { Link } from "react-router-dom";
import ValueDisplay from "../../components/ValueDisplay";

export default function CustomerShow() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    (async () => {
      setCustomer((await http.get(`/customers/${id}`)).data.data);
    })();
  }, [id]);
  return customer ? (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Paper sx={{ padding: 2, height: "100%" }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="subtitle" fontWeight="bold" color="GrayText">
              #{customer.id}
            </Typography>
            <Typography variant="h5" fontWeight="bold" lineHeight={0.7}>
              {customer.fullName}
            </Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={2} marginTop={2}>
            <ValueDisplay value={customer.phone} label="Phone" />
            <ValueDisplay value={customer.Region.name} label="Region" />
            <ValueDisplay value={customer.address} label="Address" />
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper sx={{ padding: 2, height: "100%" }}>
          <Typography variant="h6" fontWeight="bold">
            Adjustments
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  ) : (
    <h1>Loading...</h1>
  );
}
