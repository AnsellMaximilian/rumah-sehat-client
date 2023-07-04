import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import IconButton from "@mui/material/IconButton";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import { toast } from "react-toastify";
import NumericFormatRp from "../../../components/NumericFormatRp";
import DeleteAlert from "../../../components/DeleteAlert";
import { formQueryParams } from "../../../helpers/common";
import ShowIcon from "@mui/icons-material/RemoveRedEye";

const ProductIndex = () => {
  const [products, setProducts] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

  //filters
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [deleteMsg, setDeleteMsg] = useState("Loading...");

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/products/${id}`);
        setProducts((products) =>
          products.filter((product) => product.id !== id)
        );
        toast.success("Product deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      try {
        if (toDeleteId) {
          const product = (await http.get(`/rs/products/${toDeleteId}`)).data
            .data;
          setDeleteMsg(
            `Are you sure you want to delete delivery #${toDeleteId} and its details? This product has ${product.DeliveryDetails.length} sales and ${product.PurchaseDetails.length} purchases.`
          );
        } else {
          setDeleteMsg("Loading...");
        }
      } catch (error) {
        const errorValue = error?.response?.data?.error;
        const errorMsg = errorValue ? errorValue : error.message;
        toast.error(errorMsg);
      }
    })();
  }, [toDeleteId]);

  useEffect(() => {
    (async () => {
      setProducts((await http.get("/rs/products")).data.data);
      setSuppliers((await http.get("/rs/suppliers")).data.data);
      setCategories((await http.get("/rs/product-categories")).data.data);
    })();
  }, []);

  const handleClearFilter = async () => {
    setSelectedSupplier(null);
    setSelectedCategory(null);
    setName("");

    setProducts((await http.get("/rs/products")).data.data);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      SupplierId: selectedSupplier ? selectedSupplier.id : undefined,
      name,
      ProductCategoryId: selectedCategory ? selectedCategory.id : undefined,
    });
    // console.log(queryParams);
    setProducts((await http.get(`/rs/products?${queryParams}`)).data.data);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "unit", headerName: "Unit", width: 130 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "supplier", headerName: "Supplier", width: 130 },
    {
      field: "price",
      headerName: "Price",
      width: 130,

      renderCell: (params) => <NumericFormatRp value={params.row.price} />,
    },
    {
      field: "resellerPrice",
      headerName: "Reseller Price",
      width: 130,
      renderCell: (params) =>
        params.row.resellerPrice ? (
          <NumericFormatRp value={params.row.resellerPrice} />
        ) : (
          "None"
        ),
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 130,

      renderCell: (params) => <NumericFormatRp value={params.row.cost} />,
    },
    {
      field: "keepStockSince",
      headerName: "Keep Stock",
      width: 175,

      renderCell: (params) => (
        <Typography>
          {params.row.keepStockSince === null
            ? "No"
            : `Since ${params.row.keepStockSince}`}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="warning"
              component={Link}
              to={`/rs/products/edit/${params.row.id}`}
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setToDeleteId(params.row.id);
              }}
            >
              <Delete />
            </IconButton>
            <IconButton
              color="primary"
              component={Link}
              to={`/rs/products/${params.row.id}`}
            >
              <ShowIcon />
            </IconButton>
          </>
        );
      },
      width: 300,
    },
  ];

  return (
    <Box>
      <Box paddingBottom={2}>
        <Button variant="contained" component={Link} to={"/rs/products/create"}>
          New Product
        </Button>
      </Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              value={selectedSupplier}
              onChange={(e, newValue) => {
                setSelectedSupplier(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Typography>{option.name}</Typography>
                </li>
              )}
              getOptionLabel={(option) => `(#${option.id}) ${option.name}`}
              options={suppliers}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Supplier" size="small" />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              value={selectedCategory}
              onChange={(e, newValue) => {
                setSelectedCategory(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Typography>{option.name}</Typography>
                </li>
              )}
              getOptionLabel={(option) => `(#${option.id}) ${option.name}`}
              options={categories}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Category" size="small" />
              )}
            />
          </Grid>
        </Grid>
        <Box display="flex" gap={2} marginTop={2}>
          <Button variant="outlined" fullWidth onClick={handleClearFilter}>
            Clear Filter
          </Button>
          <Button variant="contained" fullWidth onClick={handleFilter}>
            Filter
          </Button>
        </Box>
      </Box>
      <Card sx={{ marginTop: 4 }}>
        <SmartTable
          rows={products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.ProductCategory.name,
            supplier: product.Supplier.name,
            resellerPrice: product.resellerPrice,
            cost: product.cost,
            unit: product.unit,
            keepStockSince: product.keepStockSince,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={deleteMsg}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Delivery"
      />
    </Box>
  );
};

export default ProductIndex;
