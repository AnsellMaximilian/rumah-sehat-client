import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Table from "./Table";

export default function DashboardModule({
  columns,
  rows,
  title,
  linkText = "See More",
  linkTo = "/",
}) {
  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      <Table rows={rows} columns={columns} size="small" />
      <Link
        color="primary"
        sx={{ mt: 3, textDecoration: "none" }}
        component={RouterLink}
        to={linkTo}
        underline="hover"
      >
        {linkText}
      </Link>
    </Paper>
  );
}
