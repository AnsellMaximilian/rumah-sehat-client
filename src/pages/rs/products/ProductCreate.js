import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";
import moment from "moment";

export default function ProductCreate({ edit }) {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [resellerPrice, setResellerPrice] = useState(0);
  const [restockNumber, setRestockNumber] = useState(0);
  const [cost, setCost] = useState(0);
  const [overallCost, setOverallCost] = useState(0);
  const [unit, setUnit] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // STOCK
  const [keepStockSince, setKeepStockSince] = useState("");
  const [keepStock, setKeepStock] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      setCategories((await http.get("/rs/product-categories")).data.data);
      setSuppliers((await http.get("/rs/suppliers")).data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (suppliers.length > 0) setSelectedSupplierId(suppliers[0].id);
      if (categories.length > 0) setSelectedCategoryId(categories[0].id);

      if (edit) {
        const product = (
          await http.get(
            `/rs/products/${id}?excludeDeliveries=true&excludePurchases=true`
          )
        ).data.data;
        setName(product.name);
        setPrice(product.price);
        setResellerPrice(product.resellerPrice ? product.resellerPrice : null);
        setCost(product.cost);
        setRestockNumber(product.restockNumber ? product.restockNumber : 0);
        setOverallCost(product.overallCost ? product.overallCost : null);
        setSelectedCategoryId(product.ProductCategoryId);
        setSelectedSupplierId(product.SupplierId);
        setUnit(product.unit);
        if (product.keepStockSince) {
          setKeepStock(true);
          setKeepStockSince(
            moment(product.keepStockSince).format("yyyy-MM-DD")
          );
        }
      }
    })();
  }, [edit, id, suppliers, categories]);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: name,
        price: price,
        resellerPrice: resellerPrice ? resellerPrice : null,
        restockNumber: restockNumber ? restockNumber : 0,
        overallCost: overallCost ? overallCost : null,
        cost: cost,
        SupplierId: selectedSupplierId,
        ProductCategoryId: selectedCategoryId,
        unit: unit ? unit : null,
        keepStockSince: keepStock ? keepStockSince : null,
      };

      if (!edit) {
        await http.post("/rs/products", body);
        navigate("/rs/products");
        toast.success("Created product.");
      } else {
        await http.patch(`/rs/products/${id}`, body);
        toast.success("Updated product.");
        navigate(`/rs/products`);
      }
    } catch ({ response: { data: error } }) {
      toast.error(error);
    }
  };
  return categories.length > 0 &&
    suppliers.length > 0 &&
    selectedCategoryId &&
    selectedSupplierId ? (
    <Box>
      <Typography component="h1" variant="h5">
        {edit ? "Edit" : "Add New"}
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <Grid spacing={2} container>
          <Grid item xs={4}>
            <TextField
              required
              fullWidth
              label="Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
              <Select
                label="Supplier"
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
              >
                {suppliers.map((supplier) => (
                  <MenuItem value={supplier.id} key={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              type="number"
              fullWidth
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              type="number"
              fullWidth
              label="Cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              type="number"
              fullWidth
              label="Overall Cost"
              value={overallCost}
              onChange={(e) => setOverallCost(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              type="number"
              fullWidth
              label="Reseller Price"
              onChange={(e) => setResellerPrice(e.target.value)}
              value={resellerPrice || ""}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                label="Category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem value={category.id} key={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Unit"
              value={unit || ""}
              onChange={(e) => setUnit(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              required
              type="number"
              fullWidth
              label="Restock Number"
              onChange={(e) => setRestockNumber(e.target.value)}
              value={restockNumber}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Keep Stock Since"
              type="date"
              value={keepStockSince}
              onChange={(e) => setKeepStockSince(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <ToggleButtonGroup
              value={keepStock}
              exclusive
              fullWidth
              onChange={(e, value) => {
                setKeepStock(!!value);
              }}
              aria-label="text alignment"
            >
              <ToggleButton value={true} aria-label="left aligned">
                Keep Stock
              </ToggleButton>
              <ToggleButton value={false} aria-label="centered">
                Don't Keep Stock
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
            >
              {edit ? "Update" : "Create"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : (
    <h1>
      Failed loading suppliers or categories. If you haven't please create at
      least one of each.
    </h1>
  );
}
