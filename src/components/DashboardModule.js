import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Table from "./Table";

export default function DashboardModule({ columns, rows, title }) {
  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      <Table rows={rows} columns={columns} size="small" />
      <Link color="primary" href="#" sx={{ mt: 3 }}>
        See more orders
      </Link>
    </Paper>
  );
}
