import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../../../http-common";
import SmartTable from "../../../../components/SmartTable";
import { toast } from "react-toastify";

const DrIdDeliveryIndex = () => {
  const [deliveries, setDeliveries] = useState([]);

  const handleDelete = (id) => {
    // (async () => {
    //   const { error } = (await http.delete(`/dr/id/deliveries/${id}`)).data;
    //   if (!error) {
    //     setDeliveries((deliveries) =>
    //       deliveries.filter((delivery) => delivery.id !== id)
    //     );
    //   } else {
    //     toast.error("Failed to delete");
    //   }
    // })();
  };

  useEffect(() => {
    // (async () => {
    //   setDeliveries((await http.get("/dr/id/deliveries")).data.data);
    // })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "customer", headerName: "Customer", width: 100 },
    { field: "cost", headerName: "Cost", width: 100 },
    {
      field: "discount",
      headerName: "Discount",
      width: 75,
    },
    {
      field: "note",
      headerName: "Note",
      width: 200,
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
              to={`/dr/id/deliveries/edit/${params.row.id}`}
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
      width: 200,
    },
  ];
  return (
    <Box>
      <Box paddingBottom={2}>
        <Button
          variant="contained"
          component={Link}
          to={"/dr/id/deliveries/create"}
        >
          New Delivery
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={deliveries.map((delivery) => ({
            id: delivery.id,
            name: delivery.name,
            priceRP: delivery.priceRP,
            points: delivery.points,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default DrIdDeliveryIndex;
