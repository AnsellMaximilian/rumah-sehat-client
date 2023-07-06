import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function Actions() {
  const [fullReportEndDate, setFullReportEndDate] = useState("");
  const [fullReportStartDate, setFullReportStartDate] = useState("");
  const exportSheets = async () => {
    try {
      const res = (await http.get("/rs/exports/export-to-sheets")).data.data;
      toast.success(res.status);
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <Box paddingBottom={4}>
      <Box paddingBottom={2}>
        <Button variant="contained" onClick={exportSheets}>
          Export Sales Data to Sheets
        </Button>
      </Box>
      <Card sx={{ padding: 2 }}>
        <Stack spacing={2}>
          <Typography fontWeight={"bold"} variant="h4">
            Full Report
          </Typography>
          <Stack spacing={2} direction="row">
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={fullReportStartDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setFullReportStartDate(e.target.value)}
            />

            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={fullReportEndDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setFullReportEndDate(e.target.value)}
            />
            <Button
              href={`http://localhost:1107/rs/reports/full-report?startDate=${fullReportStartDate}&endDate=${fullReportEndDate}`}
              target="__blank"
              component="a"
              variant="contained"
              fullWidth
            >
              Full Report
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
