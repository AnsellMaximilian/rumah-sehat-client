import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import http from "../../../../http-common";
import SmartTable from "../../../../components/SmartTable";
import NumericFormatRp from "../../../../components/NumericFormatRp";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import { toast } from "react-toastify";
import DeleteAlert from "../../../../components/DeleteAlert";

const DrSgDeliveryIndex = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

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
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setToDeleteId(params.row.id);
              }}
            >
              <Delete />
            </IconButton>
            <IconButton
              component={Link}
              to={`/dr/sg/deliveries/${params.row.id}`}
              color="primary"
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
      <DeleteAlert
        message={`Are you sure you want to delete SG delivery #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Delivery"
      />
    </Box>
  );
};

export default DrSgDeliveryIndex;
