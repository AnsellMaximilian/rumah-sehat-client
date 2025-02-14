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
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import CustomDialog from "../Dialog";

export default function DrStockReportId({ reportData, refresh }) {
  const [selectedStockMatches, setSelectedStockMatches] = useState([]);

  const handleMatchStock = async (id, stock) => {
    try {
      const body = {
        qty: stock,
        date: moment(),
        description: null,
      };
      const match = (await http.post(`/dr/sg/items/${id}/match-stock`, body))
        .data.data;
      refresh();
      toast.success(`Succesfully matched stock. ID: ${match.id}`);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
  };

  const handleGetSelectedStockMatches = async (id) => {
    try {
      const matches = (
        await http.get(`/dr/sg/items/${id}/stock-matches?limit=10`)
      ).data.data;
      setSelectedStockMatches(matches);
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
                      <Link to={`/dr/sg/items/${pr.id}`}>{pr.id}</Link>
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
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems="center"
                        justifyContent="end"
                      >
                        <Typography>
                          {pr.latestStockMatchDate
                            ? `${moment(pr.latestStockMatchDate).format(
                                "DD-MM-YYYY HH:mm:ss"
                              )} at ${parseFloat(pr.latestStockMatchQty)}`
                            : "No matches"}
                        </Typography>
                        {pr.latestStockMatchDate && (
                          <IconButton
                            onClick={() => {
                              handleGetSelectedStockMatches(pr.id);
                            }}
                          >
                            <VisibilityIcon color="primary" />
                          </IconButton>
                        )}
                      </Stack>
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
      <CustomDialog
        action={null}
        open={selectedStockMatches.length > 0}
        onClose={() => setSelectedStockMatches([])}
        title="Stock Matches"
        description="Stock matches for the selected product"
      >
        <TableContainer sx={{ marginTop: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedStockMatches.map((match) => {
                return (
                  <TableRow key={match.id}>
                    <TableCell>
                      {moment(match.date).format("DD-MM-YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell>{match.qty}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomDialog>
    </Box>
  );
}
