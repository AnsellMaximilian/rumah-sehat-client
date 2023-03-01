import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import ButtonGroup from "@mui/material/ButtonGroup";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import NumericFormatRp from "../NumericFormatRp";
import AutoSelectTextField from "../AutoSelectTextField";
import { getPurchaseSubtotal } from "../../helpers/rs";
import { Button } from "@mui/material";

export default function BulkAdd({ products, open, handleClose, onSubmit }) {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    setDetails(
      products.map((product) => ({
        key: product.id,
        product,
        qty: 0,
        price: product.price,
        cost: product.cost,
      }))
    );
  }, [products]);

  const handleChangeDetail = (detailKey, attr, customValue) => (e) => {
    setDetails((prev) =>
      prev.map((detail) => {
        if (detailKey === detail.key) {
          return {
            ...detail,
            [attr]: customValue !== undefined ? customValue : e.target.value,
          };
        }
        return detail;
      })
    );
  };

  const handleSubmit = () => {
    onSubmit(details.filter((detail) => detail.qty > 0));
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      sx={{ fontSize: 4 }}
    >
      <TableContainer sx={{ marginTop: 1 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left">Product</TableCell>
              <TableCell align="right">Cost</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Unit</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((detail) => (
              <TableRow
                key={detail.key}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="left">{detail.product.name}</TableCell>

                <TableCell align="right">
                  <TextField
                    size="small"
                    margin="none"
                    variant="standard"
                    type="number"
                    sx={{ width: 100 }}
                    value={detail.cost}
                    onChange={handleChangeDetail(detail.key, "cost")}
                    inputProps={{ tabIndex: -1 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup
                    variant="outlined"
                    aria-label="text button group"
                    sx={{ marginRight: 1 }}
                  >
                    <Button
                      onClick={handleChangeDetail(
                        detail.key,
                        "qty",
                        parseFloat((parseFloat(detail.qty) + 0.1).toFixed(2))
                      )}
                      size="small"
                    >
                      +0.1
                    </Button>
                    <Button
                      onClick={handleChangeDetail(
                        detail.key,
                        "qty",
                        parseFloat((parseFloat(detail.qty) + 0.25).toFixed(2))
                      )}
                      size="small"
                    >
                      +0.25
                    </Button>
                  </ButtonGroup>
                  <AutoSelectTextField
                    size="small"
                    margin="none"
                    sx={{ width: 50 }}
                    type="number"
                    variant="standard"
                    value={detail.qty}
                    onChange={handleChangeDetail(detail.key, "qty")}
                  />
                </TableCell>
                <TableCell align="right">{detail.product.unit}</TableCell>

                <TableCell align="right">
                  <NumericFormatRp value={detail.cost * detail.qty} />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell
                colSpan={4}
                align="right"
                component="th"
                sx={{ fontWeight: "500" }}
              >
                Total
              </TableCell>
              <TableCell align="right">
                <NumericFormatRp value={getPurchaseSubtotal(details)} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box marginTop={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          fullWidth
          sx={{ borderRadius: 0 }}
          onClick={handleSubmit}
        >
          Add
        </Button>
      </Box>
    </Dialog>
  );
}
