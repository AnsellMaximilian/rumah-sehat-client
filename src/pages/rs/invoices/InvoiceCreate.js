import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
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

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import http from "../../../http-common";
import moment from "moment";
import { Button } from "@mui/material";

export default function InvoiceCreate() {
  // Invoice details
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [date, setDate] = useState(moment().format("yyyy-MM-DD"));
  const [invoiceNote, setInvoiceNote] = useState(undefined);

  // Deliveries
  /*
    {
        mode: 'supplier' | 'own',
        supplierDelieryData: {
            supplier: SupplierId,
            cost: number,
            data: string
        } | null,
        deliveryData: {
            date: string,
            cost: number,
            note: string,
            DeliveryTypeId: DeliveryTypeId
        },
        deliveryDetails: Array<{
            qty: number,
            price: number,
            product: Product
        }>

    }
  */
  const [deliveries, setDeliveries] = useState([]);

  // Select values
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
      setProducts((await http.get("/rs/products")).data.data);
      setDeliveryTypes((await http.get("/rs/delivery-types")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (customers.length > 0) setSelectedCustomerId(customers[0].id);
    })();
  }, [customers]);

  // Deliveries
  const handleAddDelivery = () => {
    setDeliveries((prev) => [
      ...prev,
      {
        key: uuidv4(),
        mode: "own",
        deliveryData: {
          date: moment().format("yyyy-MM-DD"),
          cost: 0,
          note: undefined,
          DeliveryTypeId: deliveryTypes[0].id,
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
    const product = products[0];
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
              },
            ],
          };

        return delivery;
      })
    );
  };

  // Delivery details
  const handleDeliveryDetailProductChange = (
    deliveryKey,
    detailKey,
    productId
  ) => {
    const product = products.find((product) => product.id === productId);
    setDeliveries((prev) =>
      prev.map((delivery) => {
        if (delivery.key === deliveryKey)
          return {
            ...delivery,
            deliveryDetails: delivery.deliveryDetails.map((detail) => {
              if (detail.key === detailKey)
                return {
                  ...detail,
                  price: product.price,
                  product: product,
                };
              return detail;
            }),
          };

        return delivery;
      })
    );
  };

  const handleDeliveryDetailAttrChange =
    (attr, deliveryKey, detailKey) => (e) => {
      setDeliveries((prev) =>
        prev.map((delivery) => {
          if (delivery.key === deliveryKey)
            return {
              ...delivery,
              deliveryDetails: delivery.deliveryDetails.map((detail) => {
                if (detail.key === detailKey)
                  return {
                    ...detail,
                    [attr]: e.target.value,
                  };
                return detail;
              }),
            };

          return delivery;
        })
      );
    };

  return selectedCustomerId &&
    deliveryTypes.length > 0 &&
    products.length > 0 ? (
    <Box>
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
          <FormControl margin="none">
            <InputLabel id="demo-simple-select-label">Customer</InputLabel>
            <Select
              label="Customer"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              {customers.map((customer) => (
                <MenuItem value={customer.id} key={customer.id}>
                  {customer.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
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
                  <ToggleButtonGroup
                    value={delivery.mode}
                    exclusive
                    onChange={(e, newMode) =>
                      handleChangeDelivery(delivery.key, {
                        ...delivery,
                        mode: newMode || "own",
                      })
                    }
                    aria-label="text alignment"
                  >
                    <ToggleButton value="own" aria-label="left aligned">
                      Own Delivery
                    </ToggleButton>
                    <ToggleButton value="supplier" aria-label="centered">
                      Supplier Delivery
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveDelivery(delivery.key)}
                  >
                    <CloseIcon />
                  </Button>
                </Box>
                <Box marginTop={2} marginX={1}>
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
                              note: e.target.value,
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
                        label="Invoice Note"
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
                              {detail.product.name}
                            </TableCell>
                            <TableCell align="left">
                              <FormControl margin="none" size="small">
                                <Select
                                  value={detail.product.id}
                                  onChange={(e) =>
                                    handleDeliveryDetailProductChange(
                                      delivery.key,
                                      detail.key,
                                      e.target.value
                                    )
                                  }
                                >
                                  {products.map((product) => (
                                    <MenuItem
                                      value={product.id}
                                      key={product.id}
                                    >
                                      {product.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>

                            <TableCell align="right">
                              <TextField
                                size="small"
                                margin="none"
                                type="number"
                                value={detail.price}
                                onChange={handleDeliveryDetailAttrChange(
                                  "price",
                                  delivery.key,
                                  detail.key
                                )}
                              />
                            </TableCell>
                            <TableCell align="right">{detail.unit}</TableCell>
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
                              />
                            </TableCell>
                            <TableCell align="right">
                              {detail.price * detail.qty}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  ) : (
    <h1>Loading...</h1>
  );
}
