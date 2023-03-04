import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import http from "../../../http-common";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import moment from "moment";
import { getBillSubtotal } from "../../../helpers/rs";

const SupplierBillIndex = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);

  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [startDate, setStartDate] = useState(moment().format("yyyy-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("yyyy-MM-DD"));

  const [billData, setBillData] = useState(null);

  useEffect(() => {
    (async () => {
      setSuppliers((await http.get("/rs/suppliers")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (suppliers.length > 0) setSelectedSupplierId(suppliers[0].id);
    })();
  }, [suppliers]);

  const handleSetWeek = () => {
    const currentDate = moment();
    const weekStart = currentDate
      .clone()
      .startOf("week")
      .add(1, "day")
      .format("yyyy-MM-DD");
    const weekEnd = currentDate
      .clone()
      .endOf("week")
      .add(1, "day")
      .format("yyyy-MM-DD");

    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleSubmit = async () => {
    try {
      const purchases = (
        await http.get(
          `/rs/purchases/bill?startDate=${startDate}&endDate=${endDate}&supplierId=${selectedSupplierId}`
        )
      ).data.data;

      setBillData(purchases);
      console.log(purchases);
    } catch (error) {
      console.log(error);
    }
  };
  return suppliers.length > 0 && selectedSupplierId ? (
    <Box>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <FormControl margin="none" fullWidth>
            <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
            <Select
              label="Supplier"
              value={selectedSupplierId}
              fullWidth
              onChange={(e) => {
                setSelectedSupplierId(e.target.value);
              }}
            >
              {suppliers.map((supplier) => (
                <MenuItem value={supplier.id} key={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" height="100%">
            <Button variant="outlined" fullWidth onClick={handleSetWeek}>
              This Week
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            Filter
          </Button>
        </Grid>
      </Grid>
      <Box component={Paper} marginTop={2}>
        <Box padding={2} backgroundColor="primary.main" color="white">
          <Typography variant="h3" fontWeight="500">
            {suppliers.find((sup) => sup.id === selectedSupplierId).name}
          </Typography>
          <Typography variant="h6">Supplier Invoice</Typography>
          <Typography variant="subtitle1">
            {moment(startDate).format("DD MMMM YYYY")} -{" "}
            {moment(endDate).format("DD MMMM YYYY")}
          </Typography>
        </Box>
        {billData ? (
          <Box>
            <TableContainer sx={{ marginTop: 2 }}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billData.details.map((detail) => (
                    <TableRow
                      key={detail.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {detail.name}
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormatRp value={detail.productPrice} />
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(detail.qty.toFixed(3))}
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormatRp value={detail.total} />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      Subtotal
                    </TableCell>
                    <TableCell align="right">
                      <NumericFormatRp
                        value={getBillSubtotal(billData.details)}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      Delivery
                    </TableCell>
                    <TableCell align="right" colSpan={2}>
                      <NumericFormatRp value={billData.cost[0].costTotal} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      Total
                    </TableCell>
                    <TableCell align="right" colSpan={2}>
                      <NumericFormatRp
                        value={
                          getBillSubtotal(billData.details) +
                          parseInt(billData.cost[0].costTotal)
                        }
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <h1>Loading bill data...</h1>
        )}
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default SupplierBillIndex;
