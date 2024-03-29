import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import LinkOff from "@mui/icons-material/LinkOff";
import ReceiptIcon from "@mui/icons-material/Receipt";

import moment from "moment";
import DeleteAlert from "../../../components/DeleteAlert";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const PurchaseIndex = () => {
  const [purchases, setPurchases] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/purchases/${id}`);
        setPurchases((purchases) =>
          purchases.filter((purchase) => purchase.id !== id)
        );
        toast.success("Purchase deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleUnlink = (id) => {
    (async () => {
      try {
        await http.post(`/rs/purchases/${id}/unlink`);
        setPurchases((purchases) =>
          purchases.map((purchase) => {
            if (purchase.id === id) {
              return {
                ...purchase,
                PurchaseInvoiceId: null,
                PurchaseInvoice: null,
              };
            }
            return purchase;
          })
        );
        toast.success("Purchase unlinked from invoice.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setPurchases((await http.get("/rs/purchases")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "supplier", headerName: "Supplier", width: 100 },
    {
      field: "subtotalPrice",
      headerName: "Subtotal",
      width: 100,
      renderCell: (params) => (
        <NumericFormatRp value={params.row.subtotalPrice} />
      ),
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.cost} />,
    },
    {
      field: "totalPrice",
      headerName: "Total",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
    },

    {
      field: "totalDesignatedSales",
      headerName: "Des. Sales",
      width: 100,
    },

    {
      field: "paid",
      headerName: "Paid",
      width: 100,
      renderCell: (params) =>
        params.row.paid ? (
          <Chip label="Paid" size="small" color="success" variant="contained" />
        ) : (
          <Chip label="Unpaid" size="small" color="error" variant="contained" />
        ),
    },
    {
      field: "invoice",
      headerName: "Invoice",
      width: 100,
      renderCell: (params) =>
        params.row.invoice ? (
          <>
            <IconButton
              color="primary"
              component={Link}
              to={`/rs/purchase-invoices/${params.row.invoice.id}`}
            >
              <ReceiptIcon />
            </IconButton>
            <IconButton
              color="warning"
              onClick={() => handleUnlink(params.row.id)}
            >
              <LinkOff />
            </IconButton>
          </>
        ) : (
          <span>None</span>
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
              to={`/rs/purchases/edit/${params.row.id}`}
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
              to={`/rs/purchases/${params.row.id}`}
            >
              <ShowIcon />
            </IconButton>
            <IconButton
              disabled={!!!params.row.delivery}
              component={Link}
              to={`/rs/deliveries/${params.row.delivery?.id}`}
            >
              <LocalShippingIcon />
            </IconButton>
          </>
        );
      },
      width: 200,
    },
  ];
  return (
    <Box>
      <Box paddingBottom={2} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          component={Link}
          to={"/rs/purchases/create"}
        >
          New Purchase
        </Button>
        <Button variant="outlined" component={Link} to={"/rs/purchases/create"}>
          Manage Purchase Invoices
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={purchases.map((purchase) => ({
            id: purchase.id,
            date: moment(purchase.date).format("YYYY-MM-DD"),
            supplier: purchase.Supplier.name,
            totalPrice: purchase.totalPrice,
            subtotalPrice: purchase.subtotalPrice,
            cost: purchase.cost,
            totalDesignatedSales: purchase.totalDesignatedSales,
            delivery: purchase.Delivery,
            invoice: purchase.PurchaseInvoice,
            paid: !!purchase.PurchaseInvoice?.paid,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message="Deleting this purchase will also delete any related details."
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Purchase"
      />
    </Box>
  );
};

export default PurchaseIndex;
