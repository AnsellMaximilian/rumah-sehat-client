import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import Cancel from "@mui/icons-material/Cancel";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../../http-common";
import { v4 as uuidv4 } from "uuid";
import { getSubtotal } from "../../../../helpers/drId";
import { getDiscountTotal } from "../../../../helpers/dr";
import NumericFormatRp from "../../../../components/NumericFormatRp";

export default function DrIdDeliveryCreate({ edit }) {
  const [customers, setCustomers] = useState([]);
  const [discountModels, setDiscountModels] = useState([]);
  const [items, setItems] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [useDiscount, setUseDiscount] = useState(false);
  const [discountModelId, setDiscountModelId] = useState(undefined);
  const [cost, setCost] = useState(0);

  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  // for edit mode
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
      setDiscountModels((await http.get("/dr/discount-models")).data.data);
      setItems((await http.get("/dr/id/items")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (discountModels.length > 0) setDiscountModelId(discountModels[0].id);
      reset({
        date: moment().format("yyyy-MM-DD"),
      });
      if (edit) {
        if (items.length > 0) {
          const delivery = (await http.get(`/dr/id/deliveries/${id}`)).data
            .data;
          setDeliveryDetails(
            delivery.DrIdDeliveryDetails.map((detail) => {
              const item = items.find((item) => item.id === detail.DrIdItemId);
              return {
                key: uuidv4(),
                item: item,
                priceRP: detail.priceRP,
                points: detail.points,
                qty: detail.qty,
              };
            })
          );
          reset({
            customerId: delivery.CustomerId,
            date: moment(delivery.date).format("yyyy-MM-DD"),
            note: delivery.note,
          });
          setUseDiscount(!!delivery.DrDiscountModelId);
          if (delivery.DrDiscountModelId)
            setDiscountModelId(delivery.DrDiscountModelId);
          setCost(delivery.cost);
        }
      }
    })();
  }, [reset, discountModels, edit, id, items]);

  const handleAddRow = () => {
    const firstItem = items[0];
    setDeliveryDetails((prev) => [
      ...prev,
      {
        key: uuidv4(),
        item: firstItem,
        priceRP: firstItem.priceRP,
        points: firstItem.points,
        qty: 0,
      },
    ]);
  };

  const handleRemoveRow = (key) => {
    setDeliveryDetails((prev) => prev.filter((detail) => detail.key !== key));
  };

  const handleItemSelectChange = (key, itemId) => {
    setDeliveryDetails((prev) =>
      prev.map((detail) => {
        const newItem = items.find((item) => item.id === itemId);
        if (detail.key === key) {
          return {
            ...detail,
            item: newItem,
            priceRP: newItem.priceRP,
            points: newItem.points,
          };
        }
        return detail;
      })
    );
  };

  const handleDetailAttrChange = (attr, key) => (e) => {
    setDeliveryDetails((prev) =>
      prev.map((detail) => {
        if (detail.key === key) return { ...detail, [attr]: e.target.value };
        return detail;
      })
    );
  };

  const onSubmit = async (d) => {
    try {
      const body = {
        cost: cost,
        CustomerId: d.CustomerId,
        DrDiscountModelId: useDiscount ? discountModelId : null,
        note: d.note,
        deliveryDetails: deliveryDetails.map((detail) => {
          const {
            qty,
            priceRP,
            points,
            item: { id },
          } = detail;
          return {
            qty,
            priceRP,
            points,
            DrIdItemId: id,
          };
        }),
        date: moment().format("YYYY-MM-DD"),
      };
      if (!edit) {
        await http.post("/dr/id/deliveries", body);
        toast.success("Created delivery.");
        navigate("/dr/id/deliveries");
      } else {
        await http.patch(`/dr/id/deliveries/${id}`, body);
        toast.success("Updated delivery.");
        navigate(`/dr/id/deliveries/${id}`);
      }
    } catch ({ response: { data: error } }) {
      toast.error(error);
    }
  };

  return customers.length > 0 &&
    items.length > 0 &&
    discountModels.length > 0 &&
    discountModelId ? (
    <Box>
      <Typography component="h1" variant="h5">
        Add New
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <TextField
            {...register("date")}
            label="Date"
            type="date"
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useDiscount}
                  onChange={() => setUseDiscount(!useDiscount)}
                />
              }
              label="Discount"
            />
          </FormGroup>
        </Box>

        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Customer</InputLabel>
          <Select
            label="Customer"
            {...register("CustomerId")}
            defaultValue={customers[0].id}
          >
            {customers.map((customer) => (
              <MenuItem value={customer.id} key={customer.id}>
                {customer.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {useDiscount && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">
              Discount Model
            </InputLabel>
            <Select
              label="Discount Model"
              value={discountModelId}
              onChange={(e) => setDiscountModelId(e.target.value)}
            >
              {discountModels.map((discountModel) => (
                <MenuItem value={discountModel.id} key={discountModel.id}>
                  {discountModel.description}
                  {discountModel.description && " - "}
                  {`({points} - ${discountModel.subtractor}) x ${discountModel.base} x ${discountModel.percentage}%`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          margin="normal"
          fullWidth
          multiline
          label="Delivery Note"
          {...register("note")}
        />

        <hr style={{ margin: "16px 0" }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          marginBottom={2}
        >
          <Typography component="h2" variant="h6">
            Items
          </Typography>
          <Button variant="contained" onClick={handleAddRow}>
            New Row
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>

                <TableCell>Name</TableCell>
                <TableCell align="right">Points</TableCell>
                <TableCell align="right">Price (Rp)</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="right">Total Points</TableCell>
                <TableCell align="right">Total Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryDetails.map((detail) => (
                <TableRow
                  key={detail.key}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <IconButton onClick={() => handleRemoveRow(detail.key)}>
                      <Cancel color="error" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth margin="none">
                      <Select
                        onChange={(e) =>
                          handleItemSelectChange(detail.key, e.target.value)
                        }
                        value={detail.item.id}
                      >
                        {items.map((item) => (
                          <MenuItem value={item.id} key={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      margin="none"
                      type="number"
                      value={detail.points}
                      onChange={handleDetailAttrChange("points", detail.key)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      margin="none"
                      type="number"
                      value={detail.priceRP}
                      onChange={handleDetailAttrChange("priceRP", detail.key)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={detail.qty}
                      sx={{ width: 75 }}
                      onChange={handleDetailAttrChange("qty", detail.key)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {detail.points * detail.qty}
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={detail.priceRP * detail.qty} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5} align="right">
                  Subtotal
                </TableCell>
                <TableCell align="right">
                  {getSubtotal(deliveryDetails, "points")}
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp
                    value={getSubtotal(deliveryDetails, "priceRP")}
                  />
                </TableCell>
              </TableRow>
              {useDiscount && (
                <TableRow>
                  <TableCell colSpan={5} align="right">
                    Discount
                  </TableCell>
                  <TableCell align="right" colSpan={2}>
                    <NumericFormatRp
                      value={getDiscountTotal(
                        discountModels.find(
                          (model) => model.id === discountModelId
                        ),
                        getSubtotal(deliveryDetails, "points")
                      )}
                    />
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell colSpan={5} align="right">
                  Delivery
                </TableCell>
                <TableCell align="right" colSpan={2}>
                  <Box
                    display="flex"
                    alignItems="flex-end"
                    justifyContent="flex-end"
                    gap={1}
                  >
                    <span>Rp</span>
                    <TextField
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(parseInt(e.target.value))}
                      sx={{ width: 100, padding: 0 }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} align="right">
                  Total
                </TableCell>
                <TableCell align="right" colSpan={2}>
                  <NumericFormatRp
                    value={
                      getSubtotal(deliveryDetails, "priceRP") +
                      cost -
                      (useDiscount
                        ? getDiscountTotal(
                            discountModels.find(
                              (model) => model.id === discountModelId
                            ),
                            getSubtotal(deliveryDetails, "points")
                          )
                        : 0)
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {edit ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
}
