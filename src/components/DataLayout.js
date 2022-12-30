import { Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function DataLayout({ title }) {
  return (
    <main>
      <Typography variant="h3" marginY={2} component="h1">
        {title}
      </Typography>
      <Outlet />
    </main>
  );
}
