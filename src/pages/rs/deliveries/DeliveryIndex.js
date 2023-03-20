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
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCart from "@mui/icons-material/ShoppingCart";

const DeliveryIndex = () => {
  const [deliveries, setDeliveries] = useState([]);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/deliveries/${id}`);
        setDeliveries((deliveries) =>
          deliveries.filter((delivery) => delivery.id !== id)
        );
        toast.success("Delivery deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setDeliveries((await http.get("/rs/deliveries")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "customer", headerName: "Customer", width: 100 },
    { field: "deliveryType", headerName: "Type", width: 100 },
    {
      field: "cost",
      headerName: "Delivery Cost",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.cost} />,
    },
    {
      field: "totalPrice",
      headerName: "Total (Rp)",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
    },
    {
      field: "invoice",
      headerName: "Invoice",
      width: 100,
      renderCell: (params) =>
        params.row.invoice ? (
          <IconButton
            color="primary"
            component={Link}
            to={`/rs/invoices/${params.row.invoice.id}`}
          >
            <ReceiptIcon />
          </IconButton>
        ) : (
          <span>None</span>
        ),
    },
    {
      field: "purchase",
      headerName: "Purchase",
      width: 100,
      renderCell: (params) => (
        <IconButton
          disabled={!!!params.row.purchase}
          color="warning"
          component={Link}
          to={`/rs/purchases/${params.row.purchase?.id}`}
        >
          <ShoppingCart />
        </IconButton>
      ),
    },

    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           color="warning"
    //           component={Link}
    //           to={`/rs/deliveries/edit/${params.row.id}`}
    //         >
    //           <Edit />
    //         </IconButton>
    //         <IconButton
    //           color="error"
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             handleDelete(params.row.id);
    //           }}
    //         >
    //           <Delete />
    //         </IconButton>
    //         <IconButton
    //           color="primary"
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             navigate(`/rs/deliveries/${params.row.id}`);
    //           }}
    //         >
    //           <ShowIcon />
    //         </IconButton>
    //       </>
    //     );
    //   },
    //   width: 200,
    // },
  ];
  return (
    <Box>
      <Box paddingBottom={2}>
        <Button
          variant="contained"
          component={Link}
          to={"/rs/deliveries/create"}
        >
          New Delivery
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={deliveries.map((delivery) => ({
            id: delivery.id,
            cost: delivery.cost,
            deliveryType: delivery.DeliveryType.name,
            date: delivery.date,
            customer: delivery.Customer.fullName,
            totalPrice: delivery.totalPrice,
            invoice: delivery.Invoice,
            purchase: delivery.Purchase,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default DeliveryIndex;
