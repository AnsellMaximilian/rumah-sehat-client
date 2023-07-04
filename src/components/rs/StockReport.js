import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function StockReport({ reportData }) {
  return (
    <Box component={Paper} marginTop={2}>
      <Box padding={2} backgroundColor="primary.main" color="white">
        <Box>
          <Typography variant="h6">Stock Report</Typography>
        </Box>
      </Box>

      <Box>
        <TableContainer sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">In</TableCell>
                <TableCell align="right">Out</TableCell>
                <TableCell align="right">Drawn</TableCell>
                <TableCell align="right">Available Stock</TableCell>
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
                    <TableCell>{pr.id}</TableCell>
                    <TableCell>{pr.name}</TableCell>
                    <TableCell align="right">
                      {parseFloat(pr.totalIn)}
                    </TableCell>
                    <TableCell align="right">
                      {parseFloat(pr.totalOut)}
                    </TableCell>
                    <TableCell align="right">
                      {parseFloat(pr.totalDrawn)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontSize={24} fontWeight="bold">
                        {parseFloat(pr.totalIn) -
                          parseFloat(pr.totalOut) -
                          parseFloat(pr.totalDrawn)}
                      </Typography>
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
