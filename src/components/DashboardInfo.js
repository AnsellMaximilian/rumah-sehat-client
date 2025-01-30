import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function DashboardInfo({ label, value }) {
  return (
    <Box display="flex" alignItems="baseline">
      <Typography variant="body1" fontWeight={500}>
        {label}
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          borderBottom: "3px dotted gray",
          mx: 1,
        }}
      />
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}
