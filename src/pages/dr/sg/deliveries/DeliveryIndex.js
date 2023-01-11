import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../../../http-common";
import SmartTable from "../../../../components/SmartTable";
import NumericFormatRp from "../../../../components/NumericFormatRp";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import { toast } from "react-toastify";

const DrSgDeliveryIndex = () => {
  const [deliveries, setDeliveries] = useState([]);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/dr/sg/deliveries/${id}`);
        setDeliveries((deliveries) =>
          deliveries.filter((delivery) => delivery.id !== id)
        );
        toast.success("Deleted delivery.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setDeliveries((await http.get("/dr/sg/deliveries")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "customer", headerName: "Customer", width: 100 },
    { field: "cost", headerName: "Delivery Cost", width: 100 },
    {
      field: "discount",
      headerName: "Discount",
      width: 120,
      renderCell: (params) =>
        params.row.totalDiscount ? (
          <NumericFormatRp value={params.row.totalDiscount} />
        ) : (
          "No"
        ),
    },
    {
      field: "totalPriceRP",
      headerName: "Total (Rp)",
      width: 100,
      renderCell: (params) => (
        <NumericFormatRp value={params.row.totalPriceRP} />
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
              to={`/dr/sg/deliveries/edit/${params.row.id}`}
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
                navigate(`/dr/sg/deliveries/${params.row.id}`);
              }}
            >
              <ShowIcon />
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
          to={"/dr/sg/deliveries/create"}
        >
          New Delivery
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={deliveries.map((delivery) => ({
            id: delivery.id,
            cost: delivery.cost,
            date: delivery.date,
            customer: delivery.Customer.fullName,
            totalDiscount: delivery.totalDiscount,
            totalPriceRP: delivery.totalPriceRP,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default DrSgDeliveryIndex;
