import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import http from "../../../http-common";
import { toast } from "react-toastify";
import { copyElementToClipboard } from "../../../helpers/common";
import StockReport from "../../../components/rs/StockReport";
import RefreshIcon from "@mui/icons-material/Refresh";

const StockReportIndex = () => {
  const reportRef = useRef();

  const [reportData, setReportData] = useState(null);
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    (async () => {
      const stock = (await http.get(`/rs/products/stock-report`)).data.data;
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
      const stock = (await http.get(`/rs/products/stock-report`)).data.data;
      setReportData(stock);
      setNameFilter("");
    })();
  };

  const filteredReportData = useMemo(() => {
    return reportData.filter((item) =>
      item.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }, [reportData, nameFilter]);

  return reportData ? (
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
            <StockReport reportData={filteredReportData} refresh={refresh} />
          </div>
        </Box>
      }
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default StockReportIndex;
