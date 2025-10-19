import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [suppliers, setSuppliers] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reportData, setReportData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const [productsRes, suppliersRes] = await Promise.all([
        http.get("/rs/products"),
        http.get("/rs/suppliers"),
      ]);
      setProducts(productsRes.data.data);
      setSuppliers(suppliersRes.data.data);

      // Initialize from URL
      const params = new URLSearchParams(location.search);
      const s = params.get("startDate") || "";
      const e = params.get("endDate") || "";
      const productId = params.get("productId");
      const supplierId = params.get("supplierId");
      setStartDate(s);
      setEndDate(e);
      if (productId) {
        const found = productsRes.data.data.find(
          (p) => String(p.id) === productId
        );
        if (found) setSelectedProduct(found);
      }
      if (supplierId) {
        const found = suppliersRes.data.data.find(
          (sp) => String(sp.id) === supplierId
        );
        if (found) {
          setSelectedSupplier(found);
          setSelectedProduct(null);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (products.length > 0) setSelectedProduct(products[0]);
    })();
  }, [products]);

  useEffect(() => {
    setReportData(null);
  }, [startDate, endDate, selectedProduct, selectedSupplier]);

  const handleSetWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedProduct && !selectedSupplier)
        throw new Error("Select product or supplier.");
      if (!startDate || !endDate) throw new Error("Please input both dates.");
      let productsData;
      if (selectedSupplier) {
        const search = `?startDate=${startDate}&endDate=${endDate}&supplierId=${selectedSupplier.id}`;
        productsData = (await http.get(`/rs/reports/products-by-supplier${search}`)).data.data;
        navigate({ search });
      } else {
        const search = `?startDate=${startDate}&endDate=${endDate}&productId=${selectedProduct.id}`;
        productsData = (await http.get(`/rs/reports/products${search}`)).data.data;
        navigate({ search });
      }

      setReportData(productsData);
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
        <Grid item xs={6}>
          <Autocomplete
            value={selectedProduct}
            onChange={(e, newValue) => {
              setSelectedProduct(newValue);
              if (newValue) setSelectedSupplier(null);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            options={products}
            renderInput={(params) => <TextField {...params} fullWidth label="Product" />}
            disabled={!!selectedSupplier}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            value={selectedSupplier}
            onChange={(e, newValue) => {
              setSelectedSupplier(newValue);
              if (newValue) setSelectedProduct(null);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            options={suppliers}
            renderInput={(params) => <TextField {...params} fullWidth label="Supplier" />}
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
      {reportData && (selectedProduct || selectedSupplier) && (
        <Box component={Paper} marginTop={2}>
          <Box padding={2} backgroundColor="primary.main" color="white">
            <Box marginBottom={1}>
              <Typography variant="h6">Product Report</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h5">
                  {selectedProduct ? selectedProduct.name : selectedSupplier.name}
                </Typography>
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
              getTableColumn("Delivery ID", "DeliveryId"),
              getTableColumn("Invoice ID", "InvoiceId"),
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
