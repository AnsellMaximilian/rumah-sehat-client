import { Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function DataLayout({ title, titleVariant = "h3" }) {
  return (
    <main>
      <Typography variant={titleVariant} marginY={2} component="h1">
        {title}
      </Typography>
      <Outlet />
    </main>
  );
}
