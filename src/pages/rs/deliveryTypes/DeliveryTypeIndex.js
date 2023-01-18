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

const DeliveryTypeIndex = () => {
  const [deliveryTypes, setDeliveryTypes] = useState([]);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/delivery-types/${id}`);
        setDeliveryTypes((deliveryTypes) =>
          deliveryTypes.filter((item) => item.id !== id)
        );
        toast.success("Delivery Type deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setDeliveryTypes((await http.get("/rs/delivery-types")).data.data);
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
              to={`/rs/delivery-types/edit/${params.row.id}`}
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
          to={"/rs/delivery-types/create"}
        >
          New Delivery Type
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={deliveryTypes.map((item) => ({
            id: item.id,
            name: item.name,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default DeliveryTypeIndex;
