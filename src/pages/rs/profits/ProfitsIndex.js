import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { useState } from "react";
import { getWeek } from "../../../helpers/common";
import http from "../../../http-common";
import { toast } from "react-toastify";
import ProfitsReport from "../../../components/rs/ProfitsReport";

export default function ProfitsIndex() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reportData, setReportData] = useState(null);

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
    const profits = (
      await http.get(
        `/rs/reports/profits?startDate=${startDate}&endDate=${endDate}`
      )
    ).data.data;
    setReportData(profits);
    console.log(profits);
  };
  return (
    <Box paddingBottom={2}>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <Typography variant="subtitle2" textTransform={"uppercase"}>
            Filter Profits Report
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
      {reportData ? (
        <ProfitsReport
          startDate={startDate}
          endDate={endDate}
          profits={reportData.profits}
          suppliers={reportData.suppliers}
        />
      ) : (
        <h1>Filter</h1>
      )}
    </Box>
  );
}
