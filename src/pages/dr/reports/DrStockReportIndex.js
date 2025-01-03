import Button from "@mui/material/Button";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import http from "../../../http-common";
import { toast } from "react-toastify";
import { copyElementToClipboard } from "../../../helpers/common";
import DrStockReport from "../../../components/dr/DrStockReport";

const DrStockReportIndex = () => {
  const reportRef = useRef();

  const [reportData, setReportData] = useState(null);

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

  console.log({ reportData });

  return reportData ? (
    <Box paddingBottom={2}>
      {
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
          <div ref={reportRef}>
            <DrStockReport reportData={reportData} />
          </div>
        </Box>
      }
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
};

export default DrStockReportIndex;
