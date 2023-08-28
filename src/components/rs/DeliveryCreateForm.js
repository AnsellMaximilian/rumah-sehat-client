import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import WarningIcon from "@mui/icons-material/Error";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";

import Cancel from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import http from "../../http-common";
import AutoSelectTextField from "../AutoSelectTextField";
import { getPurchaseSubtotal, getSubtotal } from "../../helpers/rs";
import NumericFormatRp from "../NumericFormatRp";

export default function DeliveryCreateForm({
  invoice,
  editId,
  onSubmit,
  onCancel,
}) {
  const [customers, setCustomers] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [disableDesignatedSalesInput, setDisableDesignatedSalesInput] =
    useState(true);

  // Delivery
  const [mode, setMode] = useState("own");
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [deliveryTypeId, setDeliveryTypeId] = useState("none");
  const [cost, setCost] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryCustomer, setDeliveryCustomer] = useState(null);

  // Supplier Mode
  const [supplierId, setSupplierId] = useState(null);
  const [supplierCost, setSupplierCost] = useState(0);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
      setDeliveryTypes((await http.get("/rs/delivery-types")).data.data);
      setProducts((await http.get("/rs/products")).data.data);
      setSuppliers((await http.get("/rs/suppliers/active")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (suppliers.length > 0) setSupplierId(suppliers[0].id);
      if (editId && products.length > 0) {
        const delivery = (await http.get(`/rs/deliveries/${editId}`)).data.data;
        setDeliveryDate(delivery.date);
        setDeliveryNote(delivery.note || "");
        setMode("own");
        setDeliveryCustomer(delivery.Customer);
        setDeliveryDetails(
          delivery.DeliveryDetails.map((detail) => {
            const product = products.find(
              (product) => product.id === detail.ProductId
            );
            return {
              key: uuidv4(),
              product: product,
              price: detail.price,
              cost: detail.cost,
              qty: detail.qty,
              PurchaseDetailId: detail.PurchaseDetailId,
            };
          })
        );
        setDeliveryTypeId(delivery.DeliveryTypeId);
        setCost(delivery.cost);
      }
    })();
  }, [deliveryTypes, products, suppliers, editId]);

  useEffect(() => {
    if (invoice) {
      setDeliveryCustomer(invoice.Customer);
    }
  }, [invoice]);

  // Change default delivery cost
  useEffect(() => {
    if (deliveryTypeId !== "none" && deliveryTypes.length > 0) {
      const deliveryType = deliveryTypes.find(
        (type) => type.id === deliveryTypeId
      );
      setCost(deliveryType.defaultCost);
    }
  }, [deliveryTypeId, deliveryTypes]);

  const handleAddDeliveryDetail = (newRow) => {
    const product = products.filter(
      (product) => product.SupplierId === supplierId
    )[0];
    setDeliveryDetails((prev) => [
      ...prev,
      newRow
        ? newRow
        : {
            key: uuidv4(),
            price: product.price,
            cost: product.cost,
            qty: 0,
            product: product,
          },
    ]);
  };

  const handleRemoveDeliveryDetail = (detailKey) => {
    setDeliveryDetails((prev) =>
      prev.filter((detail) => detail.key !== detailKey)
    );
  };

  const handleDeliveryDetailAttrChange =
    (attr, detailKey, customValue) => (e) => {
      setDeliveryDetails((prev) =>
        prev.map((detail) => {
          if (detail.key === detailKey) {
            return {
              ...detail,
              [attr]: customValue !== undefined ? customValue : e.target.value,
            };
          }

          return detail;
        })
      );
    };

  const reset = () => {
    setMode("own");
    setDeliveryDetails([]);
    setDeliveryTypeId(deliveryTypes[0].id);
    setCost(0);
    setDeliveryDate("");
    setDeliveryNote("");
    setDeliveryCustomer(null);

    // Supplier Mode
    setSupplierId(suppliers[0].id);
    setSupplierCost(0);
  };

  const handleSubmit = async (e) => {
    setIsSubmitButtonDisabled(true);

    e.preventDefault();
    try {
      if (deliveryDetails.length === 0) throw new Error("Delivery is empty.");
      if (deliveryTypeId === "none")
        throw new Error("Please choose a delivery type.");
      if (deliveryCustomer === null)
        throw new Error("Please select a recipient.");

      if (!deliveryDate) throw new Error("Please select date.");

      const body = {
        editId,
        InvoiceId: invoice.id,
        cost: cost,
        CustomerId: deliveryCustomer.id,
        date: deliveryDate,
        mode: mode,
        note: deliveryNote,
        DeliveryTypeId: deliveryTypeId,
        deliveryDetails: deliveryDetails.map((detail) => {
          const {
            qty,
            price,
            cost,
            product,
            designatedSaleId,
            PurchaseDetailId,
          } = detail;
          if (product === null) throw new Error("Please select a product.");
          return {
            qty,
            price,
            ProductId: product.id,
            PurchaseDetailId,
            cost,
            designatedSaleId,
            product,
          };
        }),
        // Supplier delivery
        SupplierId: supplierId,
        supplierCost: supplierCost,
      };
      if (!editId) {
        await http.post("/rs/deliveries", body);
        toast.success("Created delivery.");
      } else {
        await http.patch(`/rs/deliveries/${editId}`, body);
        toast.success("Updated delivery.");
      }
      reset();
      onSubmit();
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return invoice ? (
    customers.length > 0 &&
    products.length > 0 &&
    suppliers.length > 0 &&
    deliveryTypes.length > 0 &&
    deliveryTypeId ? (
      <Box component={Paper} width="90vw">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          {editId ? (
            <Box>
              <Typography>Editing delivery #{editId}</Typography>
            </Box>
          ) : (
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, newMode) => {
                const mode = newMode || "own";
                setMode(mode);
                setDeliveryDetails((prev) => (mode === "own" ? prev : []));
              }}
              aria-label="text alignment"
            >
              <ToggleButton value="own" aria-label="left aligned">
                Own Delivery
              </ToggleButton>
              <ToggleButton value="supplier" aria-label="centered">
                Supplier Delivery
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          {mode === "own" && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      setDisableDesignatedSalesInput(e.target.checked)
                    }
                    checked={disableDesignatedSalesInput}
                  />
                }
                label="Disable Designated Sale Inputs"
              />
            </FormGroup>
          )}
        </Box>
        <Box marginTop={2} marginX={1} display="flex" gap={2}>
          <Box display="flex" gap={2}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                size="small"
                label="Date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                size="small"
                multiline
                margin="none"
                label="Delivery Note"
                rows={3.45}
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
              />
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl margin="none">
                <InputLabel id="demo-simple-select-label">
                  Delivery Type
                </InputLabel>
                <Select
                  size="small"
                  label="Delivery Type"
                  value={deliveryTypeId}
                  onChange={(e) => setDeliveryTypeId(e.target.value)}
                >
                  <MenuItem value="none">None</MenuItem>

                  {deliveryTypes.map((deliveryType) => (
                    <MenuItem value={deliveryType.id} key={deliveryType.id}>
                      {deliveryType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box display="flex" gap={1} alignItems="center">
                <Autocomplete
                  value={deliveryCustomer}
                  onChange={(e, newValue) => {
                    setDeliveryCustomer(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.fullName}
                    </li>
                  )}
                  getOptionLabel={(option) =>
                    `(#${option.id}) ${option.fullName}`
                  }
                  options={customers}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      sx={{ width: 200 }}
                      label="Recipient"
                    />
                  )}
                />
                {invoice.CustomerId !== deliveryCustomer?.id && (
                  <Tooltip title="Recipient is different from invoice receiver.">
                    <WarningIcon color="warning" />
                  </Tooltip>
                )}
              </Box>

              <AutoSelectTextField
                size="small"
                margin="none"
                label="Delivery Cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </Box>
          </Box>

          {mode === "supplier" && (
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              marginLeft="auto"
            >
              <FormControl margin="none">
                <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
                <Select
                  size="small"
                  label="Supplier"
                  value={supplierId}
                  onChange={(e) => {
                    setDeliveryDetails([]);
                    setSupplierId(e.target.value);
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
                size="small"
                margin="none"
                label="Supplier Delivery Cost"
                type="number"
                value={supplierCost}
                onChange={(e) => setSupplierCost(e.target.value)}
              />
              <Box>
                <Typography fontSize={12} color="lightslategray">
                  Purchase Total
                </Typography>
                <Typography variant="subtitle">
                  <NumericFormatRp
                    value={(
                      getPurchaseSubtotal(deliveryDetails) +
                      parseInt(supplierCost)
                    ).toFixed(0)}
                  />
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box marginTop={2}>
          <Box display="flex" gap={1} marginRight={1}>
            <Box
              sx={{ backgroundColor: "primary.light", color: "white" }}
              padding={1}
              flex={1}
            >
              Products
            </Box>
            {mode === "own" && (
              <Button
                variant="outlined"
                onClick={async () => {
                  try {
                    const customerId = deliveryCustomer?.id;
                    if (!customerId)
                      throw new Error("Please select recipient.");
                    const exclude = deliveryDetails
                      .map((detail) => detail.designatedSaleId)
                      .filter((id) => id);
                    const sales = (
                      await http.get(
                        `/customers/${
                          deliveryCustomer.id
                        }/designated-sales?exclude=${exclude.join(",")}`
                      )
                    ).data.data;
                    if (sales.length === 0)
                      throw new Error(
                        "No designated sales for this recipient."
                      );
                    for (const sale of sales) {
                      const product = (
                        await http.get(`/rs/products/${sale.ProductId}`)
                      ).data.data;
                      handleAddDeliveryDetail({
                        key: uuidv4(),
                        price: product.price,
                        cost: sale.price,
                        qty: parseFloat(sale.qty),
                        product: product,
                        designatedSaleId: sale.id,
                      });
                    }
                  } catch (error) {
                    const errorValue = error?.response?.data;
                    const errorMsg = errorValue ? errorValue : error.message;
                    toast.error(errorMsg);
                  }
                }}
              >
                Add Purchase
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => handleAddDeliveryDetail()}
            >
              Add Row
            </Button>
          </Box>
          <TableContainer sx={{ marginTop: 1 }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Actions</TableCell>
                  <TableCell align="left">Product</TableCell>
                  <TableCell align="right">Cost</TableCell>

                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Subtotal Cost</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveryDetails.map((detail) => (
                  <TableRow
                    key={detail.key}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Box display="flex" gap={2}>
                        <IconButton
                          tabIndex={-1}
                          onClick={() => handleRemoveDeliveryDetail(detail.key)}
                        >
                          <Cancel color="error" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Autocomplete
                        value={detail.product}
                        disabled={
                          disableDesignatedSalesInput && detail.designatedSaleId
                        }
                        onChange={(e, newValue) => {
                          handleDeliveryDetailAttrChange(
                            "product",
                            detail.key,
                            newValue
                          )(e);

                          if (newValue) {
                            handleDeliveryDetailAttrChange(
                              "price",
                              detail.key,
                              newValue.price
                            )(e);
                            handleDeliveryDetailAttrChange(
                              "cost",
                              detail.key,
                              newValue.cost
                            )(e);
                          }
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
                        options={
                          mode === "own"
                            ? products
                            : products.filter(
                                (product) => product.SupplierId === supplierId
                              )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            sx={{ width: 200 }}
                          />
                        )}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <AutoSelectTextField
                        variant="standard"
                        size="small"
                        margin="none"
                        type="number"
                        inputProps={{ tabIndex: -1 }}
                        disabled={
                          disableDesignatedSalesInput && detail.designatedSaleId
                        }
                        sx={{ width: 100 }}
                        value={detail.cost}
                        onChange={handleDeliveryDetailAttrChange(
                          "cost",
                          detail.key
                        )}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <AutoSelectTextField
                        variant="standard"
                        size="small"
                        margin="none"
                        type="number"
                        inputProps={{ tabIndex: -1 }}
                        disabled={
                          disableDesignatedSalesInput && detail.designatedSaleId
                        }
                        sx={{ width: 100 }}
                        value={detail.price}
                        onChange={handleDeliveryDetailAttrChange(
                          "price",
                          detail.key
                        )}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <AutoSelectTextField
                        size="small"
                        margin="none"
                        sx={{ width: 50 }}
                        type="number"
                        value={detail.qty}
                        variant="standard"
                        inputProps={{ min: 0 }}
                        disabled={
                          disableDesignatedSalesInput && detail.designatedSaleId
                        }
                        onChange={handleDeliveryDetailAttrChange(
                          "qty",
                          detail.key
                        )}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <NumericFormatRp
                        value={(detail.cost * detail.qty).toFixed(0)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <NumericFormatRp
                        value={(detail.price * detail.qty).toFixed(0)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="right"
                    component="th"
                    sx={{ fontWeight: "500" }}
                  >
                    Subtotal
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp
                      value={parseInt(getSubtotal(deliveryDetails))}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={6}
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
                    colSpan={6}
                    align="right"
                    component="th"
                    sx={{ fontWeight: "500" }}
                  >
                    Total
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp
                      value={parseInt(
                        getSubtotal(deliveryDetails) + parseInt(cost)
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            marginTop={2}
            display="flex"
            justifyContent="flex-en"
            padding={2}
            gap={2}
          >
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={isSubmitButtonDisabled}
            >
              {editId ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Box>
    ) : (
      <h1>Load</h1>
    )
  ) : (
    <span>Select invoice</span>
  );
}
