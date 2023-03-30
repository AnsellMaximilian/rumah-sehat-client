import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputLabel from "@mui/material/InputLabel";
import Tooltip from "@mui/material/Tooltip";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import http from "../../../http-common";
import { toast } from "react-toastify";
import moment from "moment";
import IndividualSupplierInvoice from "../../../components/rs/IndividualSupplierInvoice";
import SupplierInvoiceReport from "../../../components/rs/SupplierInvoiceReport";
import { copyElementToClipboard, getWeek } from "../../../helpers/common";

const SupplierBillIndex = () => {
  const reportRef = useRef();

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

  const handleCopyToClipboard = async () => {
    try {
      if (mode === "report" && reportRef) {
        const res = await copyElementToClipboard(reportRef.current);
        if (res) toast.success("Copied to clipboard.");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const handlePayPurchases = async () => {
    try {
      if (!startDate || !endDate) throw new Error("Please select dates.");
      const res = (
        await http.post("/rs/purchases/pay", {
          startDate,
          endDate,
        })
      ).data.data;
      toast.success(`Updated ${res[0]} purchases.`);
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  const handleSubmit = async (unpaidFilter) => {
    console.log(unpaidFilter);
    try {
      if (mode === "individual") {
        const purchases = (
          await http.get(
            `/rs/purchases/individual-invoice?startDate=${startDate}&endDate=${endDate}&supplierId=${selectedSupplierId}${
              unpaidFilter ? "&unpaid=yes" : ""
            }`
          )
        ).data.data;

        setBillData(purchases);
        console.log(purchases);
      } else {
        const report = (
          await http.get(
            `/rs/purchases/report-invoice?startDate=${startDate}&endDate=${endDate}${
              unpaidFilter ? "&unpaid=yes" : ""
            }`
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
        <Grid item xs={4}>
          <Tooltip title="Generate ALL unpaid supplier invoice WITH adjustments from selected dates.">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSubmit(true)}
            >
              Unpaid
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={8}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleSubmit(false)}
          >
            Filter
          </Button>
        </Grid>
      </Grid>

      {(billData && mode === "individual") ||
      (reportData && mode === "report") ? (
        <Box marginTop={2}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              component="a"
              href={` http://localhost:1107/rs/reports/print?startDate=${startDate}&endDate=${endDate}`}
              color="error"
              target="_blank"
              variant="contained"
            >
              PRINT REPORT
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handlePayPurchases}
            >
              Pay
            </Button>
            <Button
              endIcon={<ContentCopyIcon />}
              variant="outlined"
              onClick={handleCopyToClipboard}
            >
              Copy to Clipboard
            </Button>
          </Box>
          {mode === "individual" ? (
            <IndividualSupplierInvoice
              supplier={suppliers.find((sup) => sup.id === selectedSupplierId)}
              startDate={startDate}
              endDate={endDate}
              invoiceDetails={billData.details}
              deliveryCost={billData.cost[0].costTotal}
              adjustmentTotal={billData.adjustment[0].adjustmentTotal}
            />
          ) : (
            <div ref={reportRef}>
              <SupplierInvoiceReport
                startDate={startDate}
                endDate={endDate}
                reportData={reportData}
              />
            </div>
          )}
        </Box>
      ) : (
        <h1>Select Filter</h1>
      )}
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default SupplierBillIndex;
