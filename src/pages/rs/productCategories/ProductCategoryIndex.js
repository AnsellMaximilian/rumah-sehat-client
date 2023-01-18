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

const ProductCategoryIndex = () => {
  const [productCategories, setProductCategories] = useState([]);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/product-categories/${id}`);
        setProductCategories((productCategories) =>
          productCategories.filter((item) => item.id !== id)
        );
        toast.success("Category deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setProductCategories(
        (await http.get("/rs/product-categories")).data.data
      );
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="warning"
              component={Link}
              to={`/rs/product-categories/edit/${params.row.id}`}
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(params.row.id);
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
        <Button
          variant="contained"
          component={Link}
          to={"/rs/product-categories/create"}
        >
          New Category
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={productCategories.map((item) => ({
            id: item.id,
            name: item.name,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default ProductCategoryIndex;
