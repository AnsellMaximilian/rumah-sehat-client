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
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";

const DrInvoiceIndex = () => {
  const [deliveries, setDeliveries] = useState([]);
  const navigate = useNavigate();

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
    (async () => {
      setDeliveries((await http.get("/dr/id/deliveries")).data.data);
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
      renderCell: (params) => (
        <NumericFormatRp value={params.row.totalDiscount} />
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
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dr/id/deliveries/${params.row.id}`);
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
        <Button variant="contained" component={Link} to={"/dr/invoices/create"}>
          New Invoice
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={deliveries.map((delivery) => ({
            id: delivery.id,
            cost: delivery.cost,
            date: delivery.date,
            customer: delivery.Customer.fullName,
            totalDiscount: delivery.DrDiscountModelId
              ? delivery.totalDiscount
              : "No",
            totalPriceRP: delivery.totalPriceRP,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default DrInvoiceIndex;
