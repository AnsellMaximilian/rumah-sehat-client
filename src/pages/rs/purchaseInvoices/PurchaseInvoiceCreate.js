import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
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
import { Link, useNavigate, useParams } from "react-router-dom";

export default function PurchaseInvoiceCreate({ edit }) {
  // Invoice details
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [date, setDate] = useState(moment().format("yyyy-MM-DD"));
  const [note, setNote] = useState(undefined);

  const { id } = useParams();

  const [purchases, setPurchases] = useState([]);

  const [customers, setCustomers] = useState([]);

  // Select values
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setProducts((await http.get("/rs/products")).data.data);
      setSuppliers((await http.get("/rs/suppliers/active")).data.data);
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedSupplierId) {
        const fetchedPurchases = (
          await http.get(
            `/rs/purchases?SupplierId=${selectedSupplierId}&invoiced=false`
          )
        ).data.data;
        setPurchases(fetchedPurchases.map((p) => ({ ...p, selected: true })));
      }
    })();
  }, [selectedSupplierId]);

  useEffect(() => {
    (async () => {
      const purchase = edit
        ? (await http.get(`/rs/purchases-invoices/${id}`)).data.data
        : null;
      if (suppliers.length > 0)
        setSelectedSupplierId(edit ? purchase.SupplierId : suppliers[0].id);

      if (edit) {
        if (products.length > 0 && customers.length > 0) {
          setNote(purchase.note || "");
          setDate(moment(purchase.date).format("yyyy-MM-DD"));
          setSelectedSupplierId(purchase.SupplierId);
        }
      }
    })();
  }, [edit, id, products, suppliers, customers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        SupplierId: selectedSupplierId,
        note: note,
        purchaseIds: purchases.filter((pc) => pc.selected).map((pc) => pc.id),
        date: moment(date).format("YYYY-MM-DD"),
      };
      if (!edit) {
        await http.post("/rs/purchase-invoices", body);
        toast.success("Created purchase invoice.");
        navigate("/rs/purchase-invoices");
      } else {
        await http.patch(`/rs/purchase-invoices/${id}`, body);
        toast.success("Updated purchase.");
        navigate(`/rs/purchase-invoices/`);
      }
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return selectedSupplierId &&
    products.length > 0 &&
    suppliers.length > 0 &&
    customers.length > 0 ? (
    <Box paddingBottom={10}>
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

          <FormControl margin="none">
            <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
            <Select
              label="Supplier"
              value={selectedSupplierId}
              onChange={(e) => {
                setSelectedSupplierId(e.target.value);
              }}
            >
              {suppliers.map((supplier) => (
                <MenuItem value={supplier.id} key={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                  <TableCell align="left">
                    <Link to={`/rs/purchases/${detail.id}`}>{detail.id}</Link>
                  </TableCell>

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
          {edit ? "Update" : "Create"}
        </Fab>
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
}
