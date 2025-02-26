import Button from "@mui/material/Button";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import http from "../../../http-common";
import { toast } from "react-toastify";
import { copyElementToClipboard } from "../../../helpers/common";
import DrStockReport from "../../../components/dr/DrStockReportId";
import RefreshIcon from "@mui/icons-material/Refresh";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import moment from "moment";

const DrStockReportIndexId = () => {
  const reportRef = useRef();

  const [reportData, setReportData] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [unmatchedFilter, setUnmatchedFilter] = useState(false);

  useEffect(() => {
    (async () => {
      const stock = (await http.get(`/dr/id/items/stock-report`)).data.data;
      setReportData(stock);
    })();
  }, []);

  const handleCopyToClipboard = async () => {
    try {
      if (reportRef) {
        const res = await copyElementToClipboard(reportRef.current);
        if (res) toast.success("Copied to clipboard.");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const refresh = async () => {
    (async () => {
      const stock = (await http.get(`/dr/id/items/stock-report`)).data.data;
      setReportData(stock);
    })();
  };

  const filteredReportData = useMemo(() => {
    if (!reportData) return null;

    return reportData.filter((item) => {
      return (
        item.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        (!unmatchedFilter ||
          !moment(item.latestStockMatchDate).isSame(moment(), "day"))
      );
    });
  }, [reportData, nameFilter, unmatchedFilter]);

  return filteredReportData ? (
    <Box paddingBottom={2}>
      {
        <Box marginTop={2}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <TextField
              sx={{
                flexGrow: 1,
              }}
              size="small"
              label="Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => setUnmatchedFilter(e.target.checked)}
                    checked={unmatchedFilter}
                  />
                }
                label="Unmatched?"
              />
            </FormGroup>
            <Button
              endIcon={<RefreshIcon />}
              variant="outlined"
              onClick={refresh}
            >
              Refresh
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
            <DrStockReport reportData={filteredReportData} refresh={refresh} />
          </div>
        </Box>
      }
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default DrStockReportIndexId;
