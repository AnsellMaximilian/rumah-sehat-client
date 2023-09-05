import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
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
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Fab from "@mui/material/Fab";
import Cancel from "@mui/icons-material/Cancel";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import http from "../../../http-common";
import moment from "moment";
import { getPurchaseSubtotal } from "../../../helpers/rs";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AutoSelectTextField from "../../../components/AutoSelectTextField";
import { Typography } from "@mui/material";

export default function ConfigureOverallCost() {
  // Invoice details
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [extraCost, setExtraCost] = useState(0);

  const { id } = useParams();
  const [details, setDetails] = useState([]);

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
      if (suppliers.length > 0) setSelectedSupplierId(suppliers[0].id);
    })();
  }, [id, products, suppliers]);

  const getSupplierProducts = () =>
    products.filter((product) => product.SupplierId === selectedSupplierId);

  const handleAddPurchaseDetail = () => {
    const product = getSupplierProducts()[0];
    setDetails((prev) => {
      return [
        ...prev,
        {
          key: uuidv4(),
          cost: product.cost,
          qty: 0,
          product: product,
          customer: null,
          search: "",
          customerSearch: "",
        },
      ];
    });
  };

  const handleChangePurchaseDetail = (attr, detailKey) => (e) => {
    setDetails((prev) => {
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
    setDetails((prev) => prev.filter((detail) => detail.key !== detailKey));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalQty = details.reduce((s, d) => s + parseFloat(d.qty || 0), 0);
      const splitCost = totalQty
        ? parseFloat((extraCost / totalQty).toFixed(3))
        : 0;
      const body = {
        productIds: details.map((det) => det.product.id),
        splitCost,
      };
      await http.patch("/rs/products/configure-overall-cost", body);
      toast.success("Configured.");
      navigate("/rs/products");
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  const totalQty = details.reduce((s, d) => s + parseFloat(d.qty || 0), 0);
  const splitCost = totalQty
    ? parseFloat((extraCost / totalQty).toFixed(3))
    : 0;

  return selectedSupplierId && products.length > 0 && suppliers.length > 0 ? (
    <Box paddingBottom={10}>
      <Box
        display="flex"
        gap={2}
        alignItems="stretch"
        justifyContent="space-between"
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl margin="none">
            <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
            <Select
              label="Supplier"
              value={selectedSupplierId}
              onChange={(e) => {
                setSelectedSupplierId(e.target.value);
                setDetails([]);
              }}
            >
              {suppliers.map((supplier) => (
                <MenuItem value={supplier.id} key={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <AutoSelectTextField
            margin="none"
            label="Extra Cost"
            type="number"
            value={extraCost}
            onChange={(e) => setExtraCost(e.target.value)}
          />
        </Box>
        <Stack direction="row" gap={2}>
          <Stack>
            <Typography fontWeight="bold">Total Qty</Typography>
            <Typography>{totalQty}</Typography>
          </Stack>
          <Stack>
            <Typography fontWeight="bold">Split Cost</Typography>
            <Typography>
              <NumericFormatRp value={splitCost} />
            </Typography>
          </Stack>
        </Stack>
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
                <TableCell align="right">Base Cost</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Overall Cost</TableCell>
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
                        setDetails((prev) => {
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
                        setDetails((prev) => {
                          return prev.map((currentDetail) => {
                            if (currentDetail.key === detail.key) {
                              return newValue
                                ? {
                                    ...detail,
                                    product: newValue,
                                    cost: newValue.cost,
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
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.name}
                        </li>
                      )}
                      options={getSupplierProducts()}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <TextField
                      size="small"
                      margin="none"
                      variant="standard"
                      type="number"
                      inputProps={{ tabIndex: -1 }}
                      value={detail.cost}
                      onChange={handleChangePurchaseDetail("cost", detail.key)}
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
                    <NumericFormatRp
                      value={parseFloat(detail.cost) + parseFloat(splitCost)}
                    />
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
                  <NumericFormatRp value={getPurchaseSubtotal(details)} />
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
                  <NumericFormatRp value={parseInt(extraCost)} />
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
                    value={getPurchaseSubtotal(details) + parseInt(extraCost)}
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
          Submit
        </Fab>
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
}
