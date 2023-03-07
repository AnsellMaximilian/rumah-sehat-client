import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";

import Cancel from "@mui/icons-material/Cancel";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../http-common";
import { v4 as uuidv4 } from "uuid";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { getSubtotal } from "../../../helpers/rs";

export default function DeliveryCreate({ edit }) {
  const [customers, setCustomers] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [deliveryTypeId, setDeliveryTypeId] = useState(undefined);
  const [cost, setCost] = useState(0);

  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  // for edit mode
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
      setDeliveryTypes((await http.get("/rs/delivery-types")).data.data);
      setProducts((await http.get("/rs/products")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (deliveryTypes.length > 0) setDeliveryTypeId(deliveryTypes[0].id);
      reset({
        date: moment().format("yyyy-MM-DD"),
      });
      if (edit && products.length > 0) {
        const delivery = (await http.get(`/rs/deliveries/${id}`)).data.data;
        setDeliveryDetails(
          delivery.DeliveryDetails.map((detail) => {
            const product = products.find(
              (product) => product.id === detail.ProductId
            );
            return {
              key: uuidv4(),
              product: product,
              price: detail.price,
              qty: detail.qty,
            };
          })
        );
        reset({
          customerId: delivery.CustomerId,
          date: moment(delivery.date).format("yyyy-MM-DD"),
          note: delivery.note,
        });
        setDeliveryTypeId(delivery.DeliveryTypeId);
        setCost(delivery.cost);
      }
    })();
  }, [reset, deliveryTypes, edit, id, products]);

  const handleAddRow = () => {
    const firstProduct = products[0];
    setDeliveryDetails((prev) => [
      ...prev,
      {
        key: uuidv4(),
        product: firstProduct,
        price: firstProduct.price,
        qty: 0,
      },
    ]);
  };

  const handleRemoveRow = (key) => {
    setDeliveryDetails((prev) => prev.filter((detail) => detail.key !== key));
  };

  const handleProductSelectChange = (key, productId) => {
    setDeliveryDetails((prev) =>
      prev.map((detail) => {
        const newProduct = products.find((product) => product.id === productId);
        if (detail.key === key) {
          return {
            ...detail,
            product: newProduct,
            price: newProduct.price,
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
        note: d.note,
        deliveryDetails: deliveryDetails.map((detail) => {
          const {
            qty,
            price,
            product: { id },
          } = detail;
          return {
            qty,
            price,
            ProductId: id,
          };
        }),
        date: moment().format("YYYY-MM-DD"),
      };
      if (!edit) {
        await http.post("/rs/deliveries", body);
        toast.success("Created delivery.");
        navigate("/rs/deliveries");
      } else {
        await http.patch(`/rs/deliveries/${id}`, body);
        toast.success("Updated delivery.");
        navigate(`/rs/deliveries/${id}`);
      }
    } catch ({ response: { data: error } }) {
      toast.error(error);
    }
  };

  return customers.length > 0 &&
    products.length > 0 &&
    deliveryTypes.length > 0 &&
    deliveryTypeId ? (
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

        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Delivery Type</InputLabel>
          <Select
            label="Delivery Type"
            value={deliveryTypeId}
            onChange={(e) => setDeliveryTypeId(e.target.value)}
          >
            {deliveryTypes.map((deliveryType) => (
              <MenuItem value={deliveryType.id} key={deliveryType.id}>
                {deliveryType.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            Products
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
                <TableCell align="right">Price (Rp)</TableCell>
                <TableCell align="center">Qty</TableCell>
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
                          handleProductSelectChange(detail.key, e.target.value)
                        }
                        value={detail.product.id}
                      >
                        {products.map((product) => (
                          <MenuItem value={product.id} key={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      margin="none"
                      type="number"
                      value={detail.price}
                      onChange={handleDetailAttrChange("price", detail.key)}
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
                    <NumericFormatRp value={detail.price * detail.qty} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align="right">
                  Subtotal
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp value={getSubtotal(deliveryDetails)} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={4} align="right">
                  Delivery
                </TableCell>
                <TableCell align="right">
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
                <TableCell colSpan={4} align="right">
                  Total
                </TableCell>
                <TableCell align="right">
                  <NumericFormatRp
                    value={getSubtotal(deliveryDetails) + cost}
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
