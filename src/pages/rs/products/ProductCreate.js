import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function ProductCreate({ edit }) {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [resellerPrice, setResellerPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [unit, setUnit] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

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
        const product = (await http.get(`/rs/products/${id}`)).data.data;
        setName(product.name);
        setPrice(product.price);
        setResellerPrice(product.resellerPrice ? product.resellerPrice : null);
        setCost(product.cost);
        setSelectedCategoryId(product.ProductCategoryId);
        setSelectedSupplierId(product.SupplierId);
        setUnit(product.unit);
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
        cost: cost,
        SupplierId: selectedSupplierId,
        ProductCategoryId: selectedCategoryId,
        unit: unit ? unit : null,
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
        Add New
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <FormControl fullWidth margin="normal">
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
        <FormControl fullWidth margin="normal">
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
        <TextField
          margin="normal"
          required
          fullWidth
          label="Name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Unit"
          value={unit || ""}
          onChange={(e) => setUnit(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          type="number"
          fullWidth
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          type="number"
          fullWidth
          label="Reseller Price"
          onChange={(e) => setResellerPrice(e.target.value)}
          value={resellerPrice || ""}
        />

        <TextField
          margin="normal"
          required
          type="number"
          fullWidth
          label="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          {edit ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  ) : (
    <h1>
      Failed loading suppliers or categories. If you haven't please create at
      least one of each.
    </h1>
  );
}
