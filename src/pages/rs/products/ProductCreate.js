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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function ProductCreate() {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    (async () => {
      setCategories((await http.get("/rs/product-categories")).data.data);
      setSuppliers((await http.get("/rs/suppliers")).data.data);
    })();
  }, []);

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = (d) => {
    (async () => {
      try {
        await http.post("/rs/products", {
          name: d.name,
          price: d.price,
          resellerPrice: d.resellerPrice,
          cost: d.cost,
          SupplierId: d.SupplierId,
          ProductCategoryId: d.ProductCategoryId,
        });

        navigate("/rs/products");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };
  return categories.length > 0 && suppliers.length > 0 ? (
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
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            label="Category"
            {...register("ProductCategoryId")}
            defaultValue={categories[0].id}
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
            {...register("SupplierId")}
            defaultValue={suppliers[0].id}
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
          {...register("name")}
        />
        <TextField
          margin="normal"
          required
          type="number"
          fullWidth
          label="Price"
          {...register("price")}
        />
        <TextField
          margin="normal"
          required
          type="number"
          fullWidth
          label="Reseller Price"
          {...register("resellerPrice")}
        />

        <TextField
          margin="normal"
          required
          type="number"
          fullWidth
          label="Cost"
          {...register("cost")}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create
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
