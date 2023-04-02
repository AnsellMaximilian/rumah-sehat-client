import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import WarningIcon from "@mui/icons-material/Error";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
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
import http from "../../../http-common";
import AutoSelectTextField from "../../AutoSelectTextField";
import { getSubtotal } from "../../../helpers/drMy";
import NumericFormatRp from "../../NumericFormatRp";
import { getDiscountTotal } from "../../../helpers/dr";
import NumericFormatRM from "../../NumericFormatRM";

export default function DeliveryCreateForm({
  invoice,
  editId,
  onSubmit,
  onCancel,
}) {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  // Delivery
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [useIndividualDeliveryCost, setUseIndividualDeliveryCost] =
    useState(false);
  const [useDiscount, setUseDiscount] = useState(false);
  const [discountModels, setDiscountModels] = useState([]);
  const [selectedDiscountModel, setSelectedDiscountModel] = useState(null);
  const [cost, setCost] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryCustomer, setDeliveryCustomer] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(11000);

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
      setDiscountModels((await http.get("/dr/discount-models")).data.data);
      setItems((await http.get("/dr/my/items")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (discountModels.length > 0)
        setSelectedDiscountModel(discountModels[0].id);
      if (editId && items.length > 0) {
        const delivery = (await http.get(`/dr/my/deliveries/${editId}`)).data
          .data;
        setDeliveryDate(delivery.date);
        setExchangeRate(delivery.exchangeRate);
        setUseIndividualDeliveryCost(
          delivery.deliveryCostType === "individual"
        );
        setDeliveryNote(delivery.note || "");
        setDeliveryCustomer(delivery.Customer);
        setUseDiscount(!!delivery.DrDiscountModelId);
        setDeliveryDetails(
          delivery.DrMyDeliveryDetails.map((detail) => {
            const item = items.find((item) => item.id === detail.DrMyItemId);
            return {
              key: uuidv4(),
              item: item,
              priceRM: detail.priceRM,
              deliveryCost: detail.deliveryCost,
              points: detail.points,
              qty: detail.qty,
            };
          })
        );
        if (delivery.DrDiscountModelId)
          setSelectedDiscountModel(delivery.DrDiscountModelId);
        setCost(delivery.cost);
      }
    })();
  }, [discountModels, items, editId]);

  useEffect(() => {
    if (invoice) {
      setDeliveryCustomer(invoice.Customer);
    }
  }, [invoice]);

  const handleAddDeliveryDetail = (newRow) => {
    const item = items[0];
    setDeliveryDetails((prev) => [
      ...prev,
      newRow
        ? newRow
        : {
            key: uuidv4(),
            priceRM: item.priceRM,
            deliveryCost: item.deliveryCost,
            points: item.points,
            qty: 0,
            item: item,
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
    setDeliveryDetails([]);
    setSelectedDiscountModel(discountModels[0].id);
    setCost(0);
    setDeliveryDate("");
    setDeliveryNote("");
    setDeliveryCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (deliveryDetails.length === 0) throw new Error("Delivery is empty.");
      if (deliveryCustomer === null)
        throw new Error("Please select a recipient.");

      if (!deliveryDate) throw new Error("Please select date.");

      const body = {
        editId,
        DrInvoiceId: invoice.id,
        cost: cost,
        CustomerId: deliveryCustomer.id,
        date: deliveryDate,
        exchangeRate,
        deliveryCostType: useIndividualDeliveryCost ? "individual" : "whole",
        useDiscount,
        note: deliveryNote,
        DrDiscountModelId: useDiscount ? selectedDiscountModel : null,
        deliveryDetails: deliveryDetails.map((detail) => {
          const { qty, priceRM, points, item, deliveryCost } = detail;
          if (item === null) throw new Error("Please select an item.");
          return {
            qty,
            priceRM,
            points,
            DrMyItemId: item.id,
            deliveryCost: useIndividualDeliveryCost ? deliveryCost : null,

            item,
          };
        }),
      };
      if (!editId) {
        await http.post("/dr/my/deliveries", body);
        toast.success("Created delivery.");
      } else {
        await http.patch(`/dr/my/deliveries/${editId}`, body);
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
    items.length > 0 &&
    discountModels.length > 0 &&
    selectedDiscountModel ? (
      <Box component={Paper} width="90vw">
        <Box>
          {editId && (
            <Box>
              <Typography>Editing delivery #{editId}</Typography>
            </Box>
          )}
        </Box>
        <Box
          marginTop={2}
          marginX={1}
          display="flex"
          gap={2}
          justifyContent="space-between"
        >
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
                label="Exchange Rate"
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
              />

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
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            alignItems="flex-end"
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      setUseIndividualDeliveryCost(e.target.checked)
                    }
                    checked={useIndividualDeliveryCost}
                  />
                }
                label="Apply Individual Delivery Cost"
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => setUseDiscount(e.target.checked)}
                    checked={useDiscount}
                  />
                }
                label="Discount"
              />
            </FormGroup>
            {useDiscount && (
              <FormControl margin="none">
                <InputLabel id="demo-simple-select-label">
                  Discount Model
                </InputLabel>
                <Select
                  size="small"
                  sx={{ width: 200 }}
                  label="Discount Model"
                  value={selectedDiscountModel}
                  onChange={(e) => setSelectedDiscountModel(e.target.value)}
                >
                  {discountModels.map((discountModel) => (
                    <MenuItem value={discountModel.id} key={discountModel.id}>
                      {discountModel.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
        <Box marginTop={2}>
          <Box display="flex" gap={1} marginRight={1}>
            <Box
              sx={{ backgroundColor: "primary.light", color: "white" }}
              padding={1}
              flex={1}
            >
              Items
            </Box>
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
                  <TableCell align="left">Item</TableCell>
                  <TableCell align="right">Points</TableCell>
                  {useIndividualDeliveryCost && (
                    <TableCell align="right">Delivery Cost</TableCell>
                  )}
                  <TableCell align="right">Price (RM)</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Subtotal Points</TableCell>
                  {useIndividualDeliveryCost && (
                    <TableCell align="right">Subtotal Delivery Cost</TableCell>
                  )}
                  <TableCell align="right">Subtotal Price</TableCell>
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
                        value={detail.item}
                        onChange={(e, newValue) => {
                          handleDeliveryDetailAttrChange(
                            "item",
                            detail.key,
                            newValue
                          )(e);

                          if (newValue) {
                            handleDeliveryDetailAttrChange(
                              "priceRM",
                              detail.key,
                              newValue.priceRM
                            )(e);
                            handleDeliveryDetailAttrChange(
                              "deliveryCost",
                              detail.key,
                              newValue.deliveryCost
                            )(e);
                            handleDeliveryDetailAttrChange(
                              "points",
                              detail.key,
                              newValue.points
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
                        options={items}
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
                        sx={{ width: 100 }}
                        value={detail.points}
                        onChange={handleDeliveryDetailAttrChange(
                          "points",
                          detail.key
                        )}
                      />
                    </TableCell>
                    {useIndividualDeliveryCost && (
                      <TableCell align="right">
                        <AutoSelectTextField
                          variant="standard"
                          size="small"
                          margin="none"
                          type="number"
                          inputProps={{ tabIndex: -1 }}
                          sx={{ width: 100 }}
                          value={detail.deliveryCost}
                          onChange={handleDeliveryDetailAttrChange(
                            "deliveryCost",
                            detail.key
                          )}
                        />
                      </TableCell>
                    )}

                    <TableCell align="right">
                      <AutoSelectTextField
                        variant="standard"
                        size="small"
                        margin="none"
                        type="number"
                        inputProps={{ tabIndex: -1 }}
                        sx={{ width: 100 }}
                        value={detail.priceRM}
                        onChange={handleDeliveryDetailAttrChange(
                          "priceRM",
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
                        onChange={handleDeliveryDetailAttrChange(
                          "qty",
                          detail.key
                        )}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {(detail.points * detail.qty).toFixed(0)}
                    </TableCell>
                    {useIndividualDeliveryCost && (
                      <TableCell align="right">
                        <NumericFormatRp
                          value={(detail.deliveryCost * detail.qty).toFixed(0)}
                        />
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <NumericFormatRM
                        value={(detail.priceRM * detail.qty).toFixed(0)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    colSpan={useIndividualDeliveryCost ? 6 : 5}
                    align="right"
                    component="th"
                    sx={{ fontWeight: "500" }}
                  >
                    Subtotal
                  </TableCell>
                  <TableCell align="right">
                    {parseInt(getSubtotal(deliveryDetails, "points"))}
                  </TableCell>
                  {useIndividualDeliveryCost && (
                    <TableCell align="right">
                      <NumericFormatRp
                        value={parseInt(
                          getSubtotal(deliveryDetails, "deliveryCost")
                        )}
                      />
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <NumericFormatRM
                      value={parseInt(getSubtotal(deliveryDetails, "priceRM"))}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={useIndividualDeliveryCost ? 8 : 6}
                    align="right"
                    component="th"
                    sx={{ fontWeight: "500" }}
                  >
                    Subtotal (Rp)
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp
                      value={
                        parseInt(getSubtotal(deliveryDetails, "priceRM")) *
                          exchangeRate +
                        (useIndividualDeliveryCost
                          ? parseInt(
                              getSubtotal(deliveryDetails, "deliveryCost")
                            )
                          : 0)
                      }
                    />
                  </TableCell>
                </TableRow>
                {useDiscount && (
                  <TableRow>
                    <TableCell
                      colSpan={useIndividualDeliveryCost ? 8 : 6}
                      align="right"
                      component="th"
                      sx={{ fontWeight: "500" }}
                    >
                      Discount Total
                    </TableCell>
                    <TableCell align="right">
                      <NumericFormatRp
                        value={getDiscountTotal(
                          discountModels.find(
                            (dm) => dm.id === selectedDiscountModel
                          ),
                          getSubtotal(deliveryDetails, "points")
                        )}
                      />
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell
                    colSpan={useIndividualDeliveryCost ? 8 : 6}
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
                    colSpan={useIndividualDeliveryCost ? 8 : 6}
                    align="right"
                    component="th"
                    sx={{ fontWeight: "500" }}
                  >
                    Total
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp
                      value={parseInt(
                        parseInt(getSubtotal(deliveryDetails, "priceRM")) *
                          exchangeRate +
                          (useIndividualDeliveryCost
                            ? parseInt(
                                getSubtotal(deliveryDetails, "deliveryCost")
                              )
                            : 0) +
                          parseInt(cost) -
                          (useDiscount
                            ? getDiscountTotal(
                                discountModels.find(
                                  (dm) => dm.id === selectedDiscountModel
                                ),
                                getSubtotal(deliveryDetails, "points")
                              )
                            : 0)
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
            <Button variant="contained" fullWidth onClick={handleSubmit}>
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
