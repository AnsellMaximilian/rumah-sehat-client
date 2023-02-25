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
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CloseIcon from "@mui/icons-material/Close";
import Cancel from "@mui/icons-material/Cancel";
import Autocomplete from "@mui/material/Autocomplete";
import Fab from "@mui/material/Fab";

import WarningIcon from "@mui/icons-material/Error";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import http from "../../../http-common";
import moment from "moment";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { getSubtotal } from "../../../helpers/rs";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function InvoiceCreate({ edit }) {
  // Invoice details
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [status, setStatus] = useState("draft");
  const [date, setDate] = useState(moment().format("yyyy-MM-DD"));
  const [invoiceNote, setInvoiceNote] = useState(undefined);

  const { id } = useParams();

  // Deliveries
  /*
    {   
        key: string,
        mode: 'supplier' | 'own',
        supplierDeliveryData: {
            SupplierId: SupplierId,
            cost: number,
            date: string
        } | null,
        deliveryData: {
            date: string,
            cost: number,
            note: string,
            DeliveryTypeId: DeliveryTypeId,
            CustomerId: CustomerId
        },
        deliveryDetails: Array<{
            key: string,
            qty: number,
            price: number,
            product: Product,
            makePurchase: bool
        }>

    }
  */
  const [deliveries, setDeliveries] = useState([]);

  // Select values
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
      setProducts((await http.get("/rs/products")).data.data);
      setSuppliers((await http.get("/rs/suppliers/active")).data.data);
      setDeliveryTypes((await http.get("/rs/delivery-types")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (customers.length > 0) setSelectedCustomer(customers[0]);
      if (edit) {
        if (products.length > 0) {
          const invoice = (await http.get(`/rs/invoices/${id}`)).data.data;
          setInvoiceNote(invoice.note || "");
          setDate(invoice.date);
          setSelectedCustomer(invoice.Customer);
          setStatus(invoice.status);

          setDeliveries(
            invoice.Deliveries.map((delivery, index) => {
              return {
                key: uuidv4(),
                mode: "own",
                edit: true,
                deliveryData: {
                  date: delivery.date,
                  cost: delivery.cost,
                  note: delivery.note || "",
                  DeliveryTypeId: delivery.DeliveryTypeId,
                  customer: delivery.Customer,
                },
                deliveryDetails: delivery.DeliveryDetails.map((detail) => {
                  const product = products.find(
                    (product) => product.id === detail.ProductId
                  );
                  return {
                    key: uuidv4(),
                    qty: detail.qty,
                    price: detail.price,
                    product: product,
                    search: "",

                    makePurchase: false,
                  };
                }),
              };
            })
          );
        }
      }
    })();
  }, [customers, edit, id, products]);

  // Deliveries
  const handleAddDelivery = () => {
    setDeliveries((prev) => [
      ...prev,
      {
        key: uuidv4(),
        mode: "own",
        supplierDeliveryData: {
          SupplierId: suppliers[0].id,
          cost: 0,
        },
        deliveryData: {
          date: moment().format("yyyy-MM-DD"),
          cost: 0,
          note: undefined,
          DeliveryTypeId: deliveryTypes[0].id,
          customer: selectedCustomer ? selectedCustomer : customers[0],
        },
        deliveryDetails: [],
      },
    ]);
  };

  const handleRemoveDelivery = (key) => {
    setDeliveries((prev) => prev.filter((delivery) => delivery.key !== key));
  };

  const handleChangeDelivery = (key, newValue) => {
    setDeliveries((prev) =>
      prev.map((delivery) => {
        if (delivery.key === key) return newValue;

        return delivery;
      })
    );
  };

  const handleAddDeliveryRow = (key) => {
    const delivery = deliveries.find((del) => del.key === key);
    const product = !delivery.edit
      ? products.filter(
          (product) =>
            product.SupplierId ===
            deliveries.find((delivery) => delivery.key === key)
              .supplierDeliveryData.SupplierId
        )[0]
      : products[0];
    setDeliveries((prev) =>
      prev.map((delivery) => {
        if (delivery.key === key)
          return {
            ...delivery,
            deliveryDetails: [
              ...delivery.deliveryDetails,
              {
                key: uuidv4(),
                price: product.price,
                qty: 0,
                product: product,
                makePurchase: false,
                search: "",
              },
            ],
          };

        return delivery;
      })
    );
  };

  // Delivery details

  const handleDeliveryDetailAttrChange =
    (attr, deliveryKey, detailKey, customValue) => (e) => {
      setDeliveries((prev) =>
        prev.map((delivery) => {
          if (delivery.key === deliveryKey)
            return {
              ...delivery,
              deliveryDetails: delivery.deliveryDetails.map((detail) => {
                if (detail.key === detailKey) {
                  return {
                    ...detail,
                    [attr]:
                      customValue !== undefined ? customValue : e.target.value,
                  };
                }

                return detail;
              }),
            };

          return delivery;
        })
      );
    };

  const handleRemoveDeliveryDetail = (deliveryKey, detailKey) => {
    setDeliveries((prev) =>
      prev.map((delivery) => {
        if (delivery.key === deliveryKey)
          return {
            ...delivery,
            deliveryDetails: delivery.deliveryDetails.filter(
              (detail) => detail.key !== detailKey
            ),
          };

        return delivery;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (deliveries.length === 0) throw new Error("Invoice is empty.");
      if (selectedCustomer === null)
        throw new Error("Please select a customer.");
      const body = {
        date: moment(date).format("YYYY-MM-DD"),
        CustomerId: selectedCustomer.id,
        status,
        note: invoiceNote,
        deliveries: deliveries.map((delivery, index) => {
          const { mode, deliveryData, supplierDeliveryData, deliveryDetails } =
            delivery;
          if (delivery.deliveryData.customer === null)
            throw new Error(
              `Delivery recipient can't be empty (Delivery ${index + 1}).`
            );
          console.log("made it");

          return {
            mode,
            deliveryData: {
              ...deliveryData,
              CustomerId: deliveryData.customer.id,
            },
            supplierDeliveryData: !delivery.edit
              ? {
                  ...supplierDeliveryData,
                  date: moment(supplierDeliveryData.date).format("YYYY-MM-DD"),
                }
              : {},
            deliveryDetails: deliveryDetails.map((detail) => {
              const { qty, price, makePurchase, product } = detail;
              if (product === null) throw new Error("Please select a product.");
              return {
                qty,
                makePurchase,
                product,
                price,
                cost: product.cost,
                ProductId: product.id,
              };
            }),
          };
        }),
      };

      if (!edit) {
        await http.post("/rs/invoices", body);
        toast.success("Created invoice.");
        navigate("/rs/invoices");
      } else {
        await http.patch(`/rs/invoices/${id}`, body);
        toast.success("Updated invoice.");
        navigate("/rs/invoices");
      }
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return deliveryTypes.length > 0 &&
    products.length > 0 &&
    suppliers.length > 0 ? (
    <Box paddingBottom={16}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
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
          <Autocomplete
            value={selectedCustomer}
            onChange={(e, newValue) => {
              setSelectedCustomer(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => `(#${option.id}) ${option.fullName}`}
            options={customers}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} sx={{ width: 220 }} label="Customer" />
            )}
          />
        </Box>
        <Box display="flex" gap={2}>
          <FormControl margin="none">
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>
          <TextField
            multiline
            margin="none"
            label="Invoice Note"
            rows={4}
            value={invoiceNote}
            onChange={(e) => setInvoiceNote(e.target.value)}
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
            Deliveries
          </Box>
          <Button
            variant="contained"
            sx={{ boxShadow: "none" }}
            onClick={handleAddDelivery}
          >
            Add Delivery
          </Button>
        </Box>
        <Box>
          {deliveries.map((delivery) => {
            return (
              <Box
                key={delivery.key}
                marginTop={4}
                component={Paper}
                marginLeft={2}
              >
                <Box
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="space-between"
                >
                  {!delivery.edit ? (
                    <ToggleButtonGroup
                      value={delivery.mode}
                      exclusive
                      onChange={(e, newMode) => {
                        const mode = newMode || "own";
                        handleChangeDelivery(delivery.key, {
                          ...delivery,
                          mode: mode,
                          deliveryDetails:
                            mode === "own" ? delivery.deliveryDetails : [],
                        });
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
                  ) : (
                    <Typography padding={2} fontWeight="bold">
                      Previously Created
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveDelivery(delivery.key)}
                  >
                    <CloseIcon />
                  </Button>
                </Box>
                <Box marginTop={2} marginX={1} display="flex" gap={2}>
                  <Box display="flex" gap={2}>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        size="small"
                        label="Date"
                        type="date"
                        value={delivery.deliveryData.date}
                        onChange={(e) =>
                          handleChangeDelivery(delivery.key, {
                            ...delivery,
                            deliveryData: {
                              ...delivery.deliveryData,
                              date: e.target.value,
                            },
                          })
                        }
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
                        value={delivery.deliveryData.note}
                        onChange={(e) =>
                          handleChangeDelivery(delivery.key, {
                            ...delivery,
                            deliveryData: {
                              ...delivery.deliveryData,
                              note: e.target.value,
                            },
                          })
                        }
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
                          value={delivery.deliveryData.DeliveryTypeId}
                          onChange={(e) =>
                            handleChangeDelivery(delivery.key, {
                              ...delivery,
                              deliveryData: {
                                ...delivery.deliveryData,
                                DeliveryTypeId: e.target.value,
                              },
                            })
                          }
                        >
                          {deliveryTypes.map((deliveryType) => (
                            <MenuItem
                              value={deliveryType.id}
                              key={deliveryType.id}
                            >
                              {deliveryType.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Box display="flex" gap={1} alignItems="center">
                        <Autocomplete
                          value={delivery.deliveryData.customer}
                          onChange={(e, newValue) => {
                            handleChangeDelivery(delivery.key, {
                              ...delivery,
                              deliveryData: {
                                ...delivery.deliveryData,
                                customer: newValue,
                              },
                            });
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
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
                        {selectedCustomer?.id !==
                          delivery.deliveryData.customer?.id && (
                          <Tooltip title="Recipient is different from invoice receiver.">
                            <WarningIcon color="warning" />
                          </Tooltip>
                        )}
                      </Box>

                      <TextField
                        size="small"
                        margin="none"
                        label="Delivery Cost"
                        type="number"
                        value={delivery.deliveryData.cost}
                        onChange={(e) =>
                          handleChangeDelivery(delivery.key, {
                            ...delivery,
                            deliveryData: {
                              ...delivery.deliveryData,
                              cost: e.target.value,
                            },
                          })
                        }
                      />
                    </Box>
                  </Box>

                  {delivery.mode === "supplier" && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={2}
                      marginLeft="auto"
                    >
                      <FormControl margin="none">
                        <InputLabel id="demo-simple-select-label">
                          Supplier
                        </InputLabel>
                        <Select
                          size="small"
                          label="Supplier"
                          value={delivery.supplierDeliveryData.SupplierId}
                          onChange={(e) =>
                            handleChangeDelivery(delivery.key, {
                              ...delivery,
                              deliveryDetails: [],
                              supplierDeliveryData: {
                                ...delivery.supplierDeliveryData,
                                SupplierId: e.target.value,
                              },
                            })
                          }
                        >
                          {suppliers.map((supplier) => (
                            <MenuItem value={supplier.id} key={supplier.id}>
                              {supplier.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        margin="none"
                        label="Supplier Delivery Cost"
                        type="number"
                        value={delivery.supplierDeliveryData.cost}
                        onChange={(e) =>
                          handleChangeDelivery(delivery.key, {
                            ...delivery,
                            supplierDeliveryData: {
                              ...delivery.supplierDeliveryData,
                              cost: e.target.value,
                            },
                          })
                        }
                      />
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
                    <Button
                      variant="outlined"
                      onClick={() => handleAddDeliveryRow(delivery.key)}
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
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Unit</TableCell>
                          <TableCell align="right">Qty</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {delivery.deliveryDetails.map((detail) => (
                          <TableRow
                            key={detail.key}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Box display="flex" gap={2}>
                                <IconButton
                                  onClick={() =>
                                    handleRemoveDeliveryDetail(
                                      delivery.key,
                                      detail.key
                                    )
                                  }
                                >
                                  <Cancel color="error" />
                                </IconButton>
                                {delivery.mode === "own" && !delivery.edit && (
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          size="small"
                                          checked={detail.makePurchase}
                                          onChange={handleDeliveryDetailAttrChange(
                                            "makePurchase",
                                            delivery.key,
                                            detail.key,
                                            !detail.makePurchase
                                          )}
                                        />
                                      }
                                      label="Make Purchase"
                                    />
                                  </FormGroup>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Autocomplete
                                value={detail.product}
                                onInputChange={(e, newValue) => {
                                  handleDeliveryDetailAttrChange(
                                    "search",
                                    delivery.key,
                                    detail.key,
                                    newValue
                                  )(e);
                                }}
                                onChange={(e, newValue) => {
                                  handleDeliveryDetailAttrChange(
                                    "product",
                                    delivery.key,
                                    detail.key,
                                    newValue
                                  )(e);

                                  if (newValue)
                                    handleDeliveryDetailAttrChange(
                                      "price",
                                      delivery.key,
                                      detail.key,
                                      newValue.price
                                    )(e);
                                }}
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
                                getOptionLabel={(option) => option.name}
                                options={
                                  delivery.mode === "own"
                                    ? products
                                    : products.filter(
                                        (product) =>
                                          product.SupplierId ===
                                          delivery.supplierDeliveryData
                                            .SupplierId
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
                              <TextField
                                size="small"
                                margin="none"
                                type="number"
                                sx={{ width: 100 }}
                                value={detail.price}
                                onChange={handleDeliveryDetailAttrChange(
                                  "price",
                                  delivery.key,
                                  detail.key
                                )}
                              />
                            </TableCell>
                            <TableCell align="right">
                              {detail.product?.unit}
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                size="small"
                                margin="none"
                                sx={{ width: 75 }}
                                type="number"
                                value={detail.qty}
                                onChange={handleDeliveryDetailAttrChange(
                                  "qty",
                                  delivery.key,
                                  detail.key
                                )}
                                onFocus={(e) => e.target.select()}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <NumericFormatRp
                                value={detail.price * detail.qty}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="right"
                            component="th"
                            sx={{ fontWeight: "500" }}
                          >
                            Subtotal
                          </TableCell>
                          <TableCell align="right">
                            <NumericFormatRp
                              value={getSubtotal(delivery.deliveryDetails)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="right"
                            component="th"
                            sx={{ fontWeight: "500" }}
                          >
                            Delivery Cost
                          </TableCell>
                          <TableCell align="right">
                            <NumericFormatRp
                              value={parseInt(delivery.deliveryData.cost)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="right"
                            component="th"
                            sx={{ fontWeight: "500" }}
                          >
                            Total
                          </TableCell>
                          <TableCell align="right">
                            <NumericFormatRp
                              value={
                                getSubtotal(delivery.deliveryDetails) +
                                parseInt(delivery.deliveryData.cost)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            );
          })}
        </Box>
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
