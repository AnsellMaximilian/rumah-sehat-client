import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useRef, useState } from "react";
import { copyElementToClipboard, getWeek } from "../../../helpers/common";
import http from "../../../http-common";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getTableColumn } from "../../../helpers/rs";
import NumericFormatRp from "../../../components/NumericFormatRp";
import SmartTable from "../../../components/SmartTable";
import moment from "moment";

export default function CompareReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [compareData, setCompareData] = useState(null);
  const reportRef = useRef();

  const handleSetWeek = () => {
    const { weekStart, weekEnd } = getWeek();

    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please input both dates.");
      return;
    }
    const { purchases, sales } = (
      await http.get(
        `/rs/reports/purchase-compare?startDate=${startDate}&endDate=${endDate}`
      )
    ).data.data;

    setCompareData(
      purchases.map((p) => {
        const matchingProductSale = sales.find(
          (s) => s.productId === p.productId
        );
        const totalPurchased = p.totalPurchased || 0;
        const totalSold = matchingProductSale.totalSold || 0;

        return {
          ...p,
          ...matchingProductSale,
          id: p.productId,
          match: totalSold === totalPurchased ? "MATCH" : "MISMATCH",
        };
      })
    );
  };

  const handleCopyToClipboard = async () => {
    try {
      if (reportRef) {
        const res = await copyElementToClipboard(reportRef.current);
        if (res) toast.success("Copied to clipboard.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Box paddingBottom={2}>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <Typography variant="subtitle2" textTransform={"uppercase"}>
            Filter Comparison Report
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            InputLabelProps={{
              shrink: true,
            }}
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
      {compareData ? (
        <Box marginTop={2}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              endIcon={<ContentCopyIcon />}
              variant="outlined"
              onClick={handleCopyToClipboard}
            >
              Copy to Clipboard
            </Button>
          </Box>
          <Box component={Paper} marginTop={2}>
            <Box padding={2} backgroundColor="primary.main" color="white">
              <Box marginBottom={1}>
                <Typography variant="h6">Comparison Report</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
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
                </Grid>
              </Grid>
            </Box>
            <SmartTable
              rows={compareData}
              columns={[
                getTableColumn("ID", "id"),
                getTableColumn("Product", "productName", undefined, undefined, {
                  width: 220,
                }),
                getTableColumn("Total Purchased", "totalPurchased", (params) =>
                  parseFloat(params.row.totalPurchased || 0)
                ),
                getTableColumn("Total Sold", "totalSold", (params) =>
                  parseFloat(params.row.totalSold || 0)
                ),
                getTableColumn("Total Cost", "totalCost", (params) => (
                  <NumericFormatRp
                    value={parseFloat(params.row.totalCost || 0)}
                  />
                )),
                getTableColumn("Total Sales", "totalSales", (params) => (
                  <NumericFormatRp
                    value={parseFloat(params.row.totalSales || 0)}
                  />
                )),
                getTableColumn("Equality", "match"),
                // getTableColumn("Total Sales", "comparison", (params) =>
                //   params.row.match ? (
                //     <Chip
                //       label="Same"
                //       size="small"
                //       color="success"
                //       variant="contained"
                //     />
                //   ) : (
                //     <Chip
                //       label="Bruh"
                //       size="small"
                //       color="error"
                //       variant="contained"
                //     />
                //   )
                // ),
              ]}
            />
          </Box>
        </Box>
      ) : (
        <h1>Filter</h1>
      )}
    </Box>
  );
}
