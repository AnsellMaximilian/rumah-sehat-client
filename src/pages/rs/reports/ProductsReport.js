import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import http from "../../../http-common";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import { getWeek } from "../../../helpers/common";
import SmartTable from "../../../components/SmartTable";
import { getTableColumn } from "../../../helpers/rs";
import moment from "moment";

const ProductsReport = () => {
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    (async () => {
      setProducts((await http.get("/rs/products")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (products.length > 0) setSelectedProduct(products[0]);
    })();
  }, [products]);

  useEffect(() => {
    setReportData(null);
  }, [startDate, endDate, selectedProduct]);

  const handleSetWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleSubmit = async () => {
    try {
      if (selectedProduct === null) throw new Error("Select product.");
      if (!startDate || !endDate) throw new Error("Please input both dates.");
      const products = (
        await http.get(
          `/rs/reports/products?startDate=${startDate}&endDate=${endDate}&productId=${selectedProduct.id}`
        )
      ).data.data;

      setReportData(products);
      console.log(products);
    } catch (error) {
      toast.error(error);
    }
  };
  return products.length > 0 ? (
    <Box paddingBottom={2}>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <Typography variant="subtitle2" textTransform={"uppercase"}>
            Filter Products Report
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            value={selectedProduct}
            onChange={(e, newValue) => {
              setSelectedProduct(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            options={products}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>

        <Grid item xs={5}>
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
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
      {reportData && selectedProduct && (
        <Box component={Paper} marginTop={2}>
          <Box padding={2} backgroundColor="primary.main" color="white">
            <Box marginBottom={1}>
              <Typography variant="h6">Product Report</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h5">{selectedProduct.name}</Typography>
                <Typography variant="subtitle1">
                  {moment(startDate).format("DD MMMM YYYY")} -{" "}
                  {moment(endDate).format("DD MMMM YYYY")}
                </Typography>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={12}>
                  <Typography variant="h6" textAlign="right">
                    Summary
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" textAlign="right">
                    Total Sold
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" textAlign="right">
                    {parseFloat(reportData.totals[0]?.totalQty || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" textAlign="right">
                    Total Cost
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" textAlign="right">
                    <NumericFormatRp
                      value={parseFloat(reportData.totals[0]?.totalCost || 0)}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" textAlign="right">
                    Total Sales
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" textAlign="right">
                    <NumericFormatRp
                      value={parseFloat(reportData.totals[0]?.totalPrice || 0)}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" textAlign="right">
                    Total Profits
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" textAlign="right">
                    <NumericFormatRp
                      value={parseFloat(reportData.totals[0]?.profit || 0)}
                    />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <SmartTable
            rows={reportData.products}
            columns={[
              getTableColumn("ID", "id"),
              getTableColumn("Date", "saleDate"),
              getTableColumn("Product", "product"),
              getTableColumn("Supplier", "supplierName"),
              getTableColumn("Customer", "customerName"),
              getTableColumn("Buy Price", "cost", (params) => (
                <NumericFormatRp value={params.row.cost} />
              )),
              getTableColumn("Sale Price", "price", (params) => (
                <NumericFormatRp value={params.row.price} />
              )),
              getTableColumn("Qty", "totalQty", (params) =>
                parseFloat(params.row.totalQty)
              ),
              getTableColumn("Total Cost", "totalCost", (params) => (
                <NumericFormatRp value={parseFloat(params.row.totalCost)} />
              )),
              getTableColumn("Total Sales", "totalPrice", (params) => (
                <NumericFormatRp value={parseFloat(params.row.totalPrice)} />
              )),
              getTableColumn("Profit", "profit", (params) => (
                <NumericFormatRp value={parseFloat(params.row.profit)} />
              )),
            ]}
          />
        </Box>
      )}
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default ProductsReport;
