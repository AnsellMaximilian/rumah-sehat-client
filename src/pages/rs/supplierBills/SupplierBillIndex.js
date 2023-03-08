import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
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
import IndividualSupplierInvoice from "../../../components/rs/IndividualSupplierInvoice";
import SupplierInvoiceReport from "../../../components/rs/SupplierInvoiceReport";
import { getWeek } from "../../../helpers/common";

const SupplierBillIndex = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);

  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [startDate, setStartDate] = useState(moment().format("yyyy-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("yyyy-MM-DD"));

  const [billData, setBillData] = useState(null);
  const [reportData, setReportData] = useState(null);

  const [mode, setMode] = useState("individual"); // individual or report

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

  useEffect(() => {
    setBillData(null);
    setReportData(null);
  }, [startDate, endDate, selectedSupplierId]);

  const handleSetWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleSubmit = async () => {
    try {
      if (mode === "individual") {
        const purchases = (
          await http.get(
            `/rs/purchases/individual-invoice?startDate=${startDate}&endDate=${endDate}&supplierId=${selectedSupplierId}`
          )
        ).data.data;

        setBillData(purchases);
        console.log(purchases);
      } else {
        const report = (
          await http.get(
            `/rs/purchases/report-invoice?startDate=${startDate}&endDate=${endDate}`
          )
        ).data.data;
        console.log(report);
        setReportData(report);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return suppliers.length > 0 && selectedSupplierId ? (
    <Box paddingBottom={2}>
      <Box marginBottom={2}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, newMode) => {
            const mode = newMode || "individual";
            setMode(mode);
          }}
          aria-label="text alignment"
        >
          <ToggleButton value="individual" aria-label="left aligned">
            Individual
          </ToggleButton>
          <ToggleButton value="report" aria-label="centered">
            Report
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <Typography variant="subtitle2" textTransform={"uppercase"}>
            Filter {mode === "individual" && "Individual"} Supplier Invoice
          </Typography>
        </Grid>
        {mode === "individual" && (
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
        )}
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
      {(billData && mode === "individual") ||
      (reportData && mode === "report") ? (
        mode === "individual" ? (
          <IndividualSupplierInvoice
            supplier={suppliers.find((sup) => sup.id === selectedSupplierId)}
            startDate={startDate}
            endDate={endDate}
            invoiceDetails={billData.details}
            deliveryCost={billData.cost[0].costTotal}
          />
        ) : (
          <SupplierInvoiceReport
            startDate={startDate}
            endDate={endDate}
            reportData={reportData}
          />
        )
      ) : (
        <h1>Select Filter</h1>
      )}
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default SupplierBillIndex;
