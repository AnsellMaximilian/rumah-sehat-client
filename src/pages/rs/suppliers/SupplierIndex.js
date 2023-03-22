import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";

const SupplierIndex = () => {
  const [suppliers, setSuppliers] = useState([]);

  const navigate = useNavigate();

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/suppliers/${id}`);
        setSuppliers((suppliers) => suppliers.filter((item) => item.id !== id));
        toast.success("Item deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setSuppliers((await http.get("/rs/suppliers")).data.data);
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
              to={`/rs/suppliers/edit/${params.row.id}`}
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
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/rs/suppliers/${params.row.id}`);
              }}
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
        <Button
          variant="contained"
          component={Link}
          to={"/rs/suppliers/create"}
        >
          New Supplier
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={suppliers.map((item) => ({
            id: item.id,
            name: item.name,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default SupplierIndex;
