import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useRef, useState } from "react";
import { copyElementToClipboard, getWeek } from "../../../helpers/common";
import http from "../../../http-common";
import { toast } from "react-toastify";
import ProfitsReport from "../../../components/rs/ProfitsReport";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

export default function ProfitsIndex() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reportData, setReportData] = useState(null);

  const [isReportCompact, setIsReportCompact] = useState(false);

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
    const profits = (
      await http.get(
        `/rs/reports/profits?startDate=${startDate}&endDate=${endDate}`
      )
    ).data.data;
    setReportData(profits);
    console.log(profits);
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
            Filter Profits Report
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ToggleButtonGroup
            value={isReportCompact}
            exclusive
            onChange={(e, newMode) => {
              const mode = newMode === null ? false : newMode;
              setIsReportCompact(mode);
            }}
            aria-label="text alignment"
          >
            <ToggleButton value={true} aria-label="left aligned">
              Compact
            </ToggleButton>
            <ToggleButton value={false} aria-label="centered">
              Detailed
            </ToggleButton>
          </ToggleButtonGroup>
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
              endIcon={<ContentCopyIcon />}
              variant="outlined"
              onClick={handleCopyToClipboard}
            >
              Copy to Clipboard
            </Button>
          </Box>

          <div ref={reportRef}>
            <ProfitsReport
              compact={isReportCompact}
              startDate={startDate}
              endDate={endDate}
              profits={reportData.profits}
              suppliers={reportData.suppliers}
              totals={reportData.totals}
            />
          </div>
        </Box>
      ) : (
        <h1>Filter</h1>
      )}
    </Box>
  );
}
