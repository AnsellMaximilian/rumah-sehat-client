import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Fab from "@mui/material/Fab";

import { useEffect, useState } from "react";

import http from "../../../http-common";
import moment from "moment";
import { getPurchaseInvoiceTotal } from "../../../helpers/rs";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Typography } from "@mui/material";

export default function PurchaseInvoiceEdit({}) {
  // Invoice details
  const [date, setDate] = useState(moment().format("yyyy-MM-DD"));
  const [note, setNote] = useState("");

  const { id } = useParams();

  const [purchases, setPurchases] = useState([]);
  const [currentPurchaseInvoice, setCurrentPurchaseInvoice] = useState(null);

  // Select values
  const [suppliers, setSuppliers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setSuppliers((await http.get("/rs/suppliers/active")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const purchaseInvoice = (await http.get(`/rs/purchase-invoices/${id}`))
        .data.data;
      setCurrentPurchaseInvoice(purchaseInvoice);
      const linkedPurchases = purchaseInvoice.Purchases;
      const unlinkedPurchases = (
        await http.get(
          `/rs/purchases?SupplierId=${purchaseInvoice.SupplierId}&invoiced=false`
        )
      ).data.data;

      setPurchases([
        ...unlinkedPurchases.map((p) => ({ ...p, selected: false })),
        ...linkedPurchases.map((p) => ({ ...p, selected: true })),
      ]);

      setNote(purchaseInvoice.note || "");
      setDate(moment(purchaseInvoice.date).format("yyyy-MM-DD"));
    })();
  }, [id, suppliers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        note: note,
        purchaseIds: purchases.filter((pc) => pc.selected).map((pc) => pc.id),
        date: moment(date).format("YYYY-MM-DD"),
      };
      await http.patch(`/rs/purchase-invoices/${id}`, body);
      toast.success("Updated purchase.");
      navigate(`/rs/purchase-invoices/`);
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return currentPurchaseInvoice ? (
    <Box paddingBottom={10}>
      <Box marginBottom={2}>
        <Typography fontWeight="bold">
          Purchase Invoice #{currentPurchaseInvoice.id} -{" "}
          {currentPurchaseInvoice.Supplier.name}
        </Typography>
      </Box>
      <Box display="flex" gap={2} alignItems="stretch">
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box>
          <TextField
            multiline
            margin="none"
            label="Purchase Invoice Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={7.25}
          />
        </Box>
      </Box>
      <Box marginTop={2}>
        <Box display="flex" gap={1}>
          <Box
            sx={{ backgroundColor: "primary.dark", color: "white" }}
            padding={1}
            flex={1}
          >
            Purchases
          </Box>
        </Box>
      </Box>
      <Box>
        <TableContainer sx={{ marginTop: 1 }}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell align="left">Purchase ID</TableCell>
                <TableCell align="right">Notes</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((detail) => (
                <TableRow
                  key={detail.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) =>
                              setPurchases((prev) =>
                                prev.map((pc) => {
                                  if (pc.id === detail.id) {
                                    return { ...pc, selected: !pc.selected };
                                  } else {
                                    return pc;
                                  }
                                })
                              )
                            }
                            checked={detail.selected}
                          />
                        }
                        label="Include"
                      />
                    </FormGroup>
                  </TableCell>
                  <TableCell align="left">{detail.id}</TableCell>

                  <TableCell align="right">
                    {detail.note ? detail.note : "No notes."}
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={detail.totalPrice} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Grand Total
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp
                    value={getPurchaseInvoiceTotal(
                      purchases.filter((pc) => pc.selected)
                    )}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ position: "absolute", right: 20, bottom: 20 }}>
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          onClick={handleSubmit}
        >
          Update
        </Fab>
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
}
