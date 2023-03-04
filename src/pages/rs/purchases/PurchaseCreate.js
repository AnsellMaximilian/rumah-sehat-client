import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
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
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Fab from "@mui/material/Fab";
import Cancel from "@mui/icons-material/Cancel";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import http from "../../../http-common";
import moment from "moment";
import { getSubtotal } from "../../../helpers/rs";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AutoSelectTextField from "../../../components/AutoSelectTextField";

export default function PurchaseCreate({ edit }) {
  // Invoice details
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [date, setDate] = useState(moment().format("yyyy-MM-DD"));
  const [note, setNote] = useState(undefined);
  const [cost, setCost] = useState(0);

  const { id } = useParams();
  const [purchaseDetails, setPurchaseDetails] = useState([]);

  // Select values
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setProducts((await http.get("/rs/products")).data.data);
      setSuppliers((await http.get("/rs/suppliers/active")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const purchase = edit
        ? (await http.get(`/rs/purchases/${id}`)).data.data
        : null;
      if (suppliers.length > 0)
        setSelectedSupplierId(edit ? purchase.SupplierId : suppliers[0].id);

      if (edit) {
        if (products.length > 0) {
          setNote(purchase.note || "");
          setDate(moment(purchase.date).format("yyyy-MM-DD"));
          setSelectedSupplierId(purchase.SupplierId);
          setCost(purchase.cost);

          setPurchaseDetails(
            purchase.PurchaseDetails.map((detail) => {
              const product = products.find(
                (product) => product.id === detail.ProductId
              );
              return {
                key: uuidv4(),
                price: detail.price,
                qty: detail.qty,
                product: product,
                search: "",
              };
            })
          );
        }
      }
    })();
  }, [edit, id, products, suppliers]);

  const getSupplierProducts = () =>
    products.filter((product) => product.SupplierId === selectedSupplierId);

  const handleAddPurchaseDetail = () => {
    const product = getSupplierProducts()[0];
    setPurchaseDetails((prev) => {
      return [
        ...prev,
        {
          key: uuidv4(),
          price: product.cost,
          qty: 0,
          product: product,
          search: "",
        },
      ];
    });
  };

  const handleChangePurchaseDetail = (attr, detailKey) => (e) => {
    setPurchaseDetails((prev) => {
      return prev.map((detail) => {
        if (detail.key === detailKey)
          return {
            ...detail,
            [attr]: e.target.value,
          };
        return detail;
      });
    });
  };

  const handleRemoveDetail = (detailKey) => () =>
    setPurchaseDetails((prev) =>
      prev.filter((detail) => detail.key !== detailKey)
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        cost: cost,
        SupplierId: selectedSupplierId,
        note: note,
        purchaseDetails: purchaseDetails.map((detail) => {
          const { qty, price, product } = detail;

          if (product === null) throw new Error("Select a product");
          return {
            qty,
            price,
            ProductId: product.id,
          };
        }),
        date: moment(date).format("YYYY-MM-DD"),
      };
      if (!edit) {
        await http.post("/rs/purchases", body);
        toast.success("Created purchase.");
        navigate("/rs/purchases");
      } else {
        await http.patch(`/rs/purchases/${id}`, body);
        toast.success("Updated purchase.");
        navigate(`/rs/purchases/`);
      }
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return selectedSupplierId && products.length > 0 && suppliers.length > 0 ? (
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
                setPurchaseDetails([]);
              }}
            >
              {suppliers.map((supplier) => (
                <MenuItem value={supplier.id} key={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="none"
            label="Delivery Cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </Box>
        <Box>
          <TextField
            multiline
            margin="none"
            label="Purchase Note"
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
            Products
          </Box>
          <Button
            variant="contained"
            sx={{ boxShadow: "none" }}
            onClick={handleAddPurchaseDetail}
          >
            Add Row
          </Button>
        </Box>
      </Box>
      <Box>
        <TableContainer sx={{ marginTop: 1 }}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell align="left">Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseDetails.map((detail) => (
                <TableRow
                  key={detail.key}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box display="flex" gap={2}>
                      <IconButton
                        onClick={handleRemoveDetail(detail.key)}
                        tabIndex={-1}
                      >
                        <Cancel color="error" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Autocomplete
                      value={detail.product}
                      onInputChange={(e, newValue) => {
                        setPurchaseDetails((prev) => {
                          return prev.map((currentDetail) => {
                            if (currentDetail.key === detail.key) {
                              return {
                                ...detail,
                                search: newValue,
                              };
                            }
                            return currentDetail;
                          });
                        });
                      }}
                      onChange={(event, newValue) => {
                        setPurchaseDetails((prev) => {
                          return prev.map((currentDetail) => {
                            if (currentDetail.key === detail.key) {
                              return newValue
                                ? {
                                    ...detail,
                                    product: newValue,
                                    price: newValue.cost,
                                  }
                                : {
                                    ...detail,
                                    product: newValue,
                                  };
                            }
                            return currentDetail;
                          });
                        });
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      getOptionLabel={(option) => option.name}
                      options={getSupplierProducts()}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <TextField
                      size="small"
                      margin="none"
                      variant="standard"
                      type="number"
                      inputProps={{ tabIndex: -1 }}
                      value={detail.price}
                      onChange={handleChangePurchaseDetail("price", detail.key)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <AutoSelectTextField
                      size="small"
                      margin="none"
                      variant="standard"
                      sx={{ width: 75 }}
                      type="number"
                      value={detail.qty}
                      onChange={handleChangePurchaseDetail("qty", detail.key)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={detail.price * detail.qty} />
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
                  Subtotal
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp value={getSubtotal(purchaseDetails)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="right"
                  component="th"
                  sx={{ fontWeight: "500" }}
                >
                  Delivery Cost
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp value={parseInt(cost)} />
                </TableCell>
              </TableRow>
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
                  <NumericFormatRp
                    value={getSubtotal(purchaseDetails) + parseInt(cost)}
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
