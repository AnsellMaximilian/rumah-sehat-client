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
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import moment from "moment";
import DeleteAlert from "../../../components/DeleteAlert";
import PayIcon from "@mui/icons-material/Paid";

const PurchaseInvoiceIndex = () => {
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/purchase-invoices/${id}`);
        setPurchaseInvoices((purchaseInvoices) =>
          purchaseInvoices.filter((purchase) => purchase.id !== id)
        );
        toast.success("Purchase deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handlePay = async (id) => {
    try {
      const purchaseInvoice = (
        await http.patch(`/rs/purchase-invoices/${id}/pay`)
      ).data.data;
      toast.success(`Updated purchase invoice #${purchaseInvoice.id}`, {
        autoClose: 500,
      });
      setPurchaseInvoices((prev) =>
        prev.map((exp) => {
          if (exp.id === id) return { ...exp, paid: purchaseInvoice.paid };
          return exp;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      setPurchaseInvoices((await http.get("/rs/purchase-invoices")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "supplier", headerName: "Supplier", width: 100 },
    {
      field: "totalPrice",
      headerName: "Total",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
    },

    {
      field: "paid",
      headerName: "Paid",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color={params.row.paid ? "success" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            handlePay(params.row.id);
          }}
        >
          <PayIcon />
        </IconButton>
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
              to={`/rs/purchase-invoices/edit/${params.row.id}`}
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
              to={`/rs/purchase-invoices/${params.row.id}`}
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
      <Box paddingBottom={2} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          component={Link}
          to={"/rs/purchase-invoices/create"}
        >
          New Purchase Invoice
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to={"/rs/purchase-invoices/create"}
        >
          Manage Purchase Invoices
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={purchaseInvoices.map((purchase) => ({
            id: purchase.id,
            date: moment(purchase.date).format("DD-MM-YYYY"),
            supplier: purchase.Supplier.name,
            totalPrice: purchase.totalPrice,
            paid: purchase.paid,
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

export default PurchaseInvoiceIndex;
