import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import IconButton from "@mui/material/IconButton";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import DeleteAlert from "../../../components/DeleteAlert";
import PayIcon from "@mui/icons-material/Paid";

const InvoiceIndex = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();
  const [toDeleteId, setToDeleteId] = useState(null);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/invoices/${id}`);
        setInvoices((invoices) =>
          invoices.filter((invoice) => invoice.id !== id)
        );
        toast.success("Invoice deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setInvoices((await http.get("/rs/invoices")).data.data);
    })();
  }, []);

  const pay = async (id) => {
    try {
      const invoice = (await http.patch(`/rs/invoices/${id}/pay`)).data.data;
      toast.success(`Updated invoice #${invoice.id}`);
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === id)
            return { ...inv, status: invoice.status, paid: invoice.paid };
          return inv;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "customer", headerName: "Customer", width: 250 },
    {
      field: "totalPrice",
      headerName: "Total (Rp)",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
    },
    { field: "status", headerName: "Status", width: 65 },

    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color={params.row.paid ? "success" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                pay(params.row.id);
              }}
            >
              <PayIcon />
            </IconButton>
            <IconButton
              color="warning"
              component={Link}
              to={`/rs/invoices/edit/${params.row.id}`}
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
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/rs/invoices/${params.row.id}`);
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
        <Button variant="contained" component={Link} to={"/rs/invoices/manage"}>
          Manage Invoices
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={invoices.map((invoice) => ({
            id: invoice.id,
            date: invoice.date,
            customer: invoice.Customer.fullName,
            totalPrice: invoice.totalPrice,
            status: invoice.status,
            paid: invoice.paid,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message="Deleting this invoice will also delete any related deliveries and its
          details."
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Invoice"
      />
    </Box>
  );
};

export default InvoiceIndex;
