import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function Actions() {
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
      <Box>
        <Button variant="contained" onClick={exportSheets}>
          Export Sales Data to Sheets
        </Button>
      </Box>
    </Box>
  );
}
