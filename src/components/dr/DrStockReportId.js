import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { getProductStockColor } from "../../helpers/rs";
import { Link } from "react-router-dom";
import http from "../../http-common";
import { toast } from "react-toastify";
import moment from "moment";
import Button from "@mui/material/Button";

export default function DrStockReportId({ reportData, refresh }) {
  const handleMatchStock = async (id, stock) => {
    try {
      const body = {
        qty: stock,
        date: moment(),
        description: null,
      };
      const match = (await http.post(`/dr/id/items/${id}/match-stock`, body))
        .data.data;
      refresh();
      toast.success(`Succesfully matched stock. ID: ${match.id}`);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
  };
  return (
    <Box component={Paper} marginTop={2}>
      <Box padding={2} backgroundColor="primary.main" color="white">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Stock Report</Typography>
          <Typography variant="body1">{reportData.length} items</Typography>
        </Box>
      </Box>

      <Box>
        <TableContainer sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Item</TableCell>
                {/* <TableCell align="right">Out</TableCell>
                <TableCell align="right">Adjusted</TableCell>
                <TableCell align="right">Loaned</TableCell> */}
                <TableCell align="right">Available Stock</TableCell>
                <TableCell align="right">Latest Stock Match</TableCell>
                <TableCell align="right">Match Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((pr) => {
                return (
                  <TableRow
                    key={pr.id}
                    sx={{
                      padding: 4,
                      ">td": {
                        fontSize: "20px",
                      },
                    }}
                  >
                    <TableCell>
                      <Link to={`/dr/id/items/${pr.id}`}>{pr.id}</Link>
                    </TableCell>
                    <TableCell>{pr.name}</TableCell>

                    {/* <TableCell align="right">
                      {parseFloat(pr.totalOut)}
                    </TableCell>

                    <TableCell align="right">
                      {parseFloat(pr.totalAdjusted)}
                    </TableCell>
                    <TableCell align="right">
                      {parseFloat(pr.totalLoaned)}
                    </TableCell> */}
                    <TableCell align="right">{parseFloat(pr.stock)}</TableCell>
                    <TableCell align="right">
                      {pr.latestStockMatchDate
                        ? `${moment(pr.latestStockMatchDate).format(
                            "DD-MM-YYYY HH:mm:ss"
                          )} at ${parseFloat(pr.latestStockMatchQty)}`
                        : "No matches"}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          handleMatchStock(pr.id, pr.stock);
                        }}
                      >
                        Match Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
