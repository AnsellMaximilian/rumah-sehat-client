import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../http-common";

export default function ProductEdit() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const onSubmit = (d) => {
    (async () => {
      try {
        await http.patch(`/rs/products/${id}`, {
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

  useEffect(() => {
    (async () => {
      if (id) {
        setProduct((await http.get(`/rs/products/${id}`)).data.data);
        setCategories((await http.get("/rs/product-categories")).data.data);
        setSuppliers((await http.get("/rs/suppliers")).data.data);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        resellerPrice: product.resellerPrice,
        cost: product.cost,
        SupplierId: product.SupplierId,
        ProductCategoryId: product.ProductCategoryId,
      });
    }
  }, [product, reset]);
  return product && suppliers.length > 0 && categories.length > 0 ? (
    <Box>
      <Typography component="h1" variant="h5">
        Edit Product
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          label="Name"
          autoFocus
          {...register("name")}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            label="Category"
            {...register("ProductCategoryId")}
            defaultValue={product.ProductCategoryId}
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
            defaultValue={product.SupplierId}
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
          Update
        </Button>
      </Box>
    </Box>
  ) : (
    <Skeleton />
  );
}
