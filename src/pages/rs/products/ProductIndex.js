import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import { toast } from "react-toastify";
import NumericFormatRp from "../../../components/NumericFormatRp";
import DeleteAlert from "../../../components/DeleteAlert";

const ProductIndex = () => {
  const [products, setProducts] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

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
    })();
  }, []);

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
      <Card>
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
