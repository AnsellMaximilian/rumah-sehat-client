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

const InvoiceIndex = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

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

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "customer", headerName: "Customer", width: 100 },
    {
      field: "totalPrice",
      headerName: "Total (Rp)",
      width: 100,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
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
              to={`/rs/invoices/edit/${params.row.id}`}
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
        <Button variant="contained" component={Link} to={"/rs/invoices/create"}>
          New Invoice
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={invoices.map((invoice) => ({
            id: invoice.id,
            date: invoice.date,
            customer: invoice.Customer.fullName,
            totalPrice: invoice.totalPrice,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default InvoiceIndex;