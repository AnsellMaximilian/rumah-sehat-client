import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import SmartTable from "../../components/SmartTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import http from "../../http-common";
import DeleteAlert from "../../components/DeleteAlert";

export default function CustomerIndex() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, []);

  const [toDeleteId, setToDeleteId] = useState(null);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/customers/${id}`);
        setCustomers((customers) =>
          customers.filter((customer) => customer.id !== id)
        );
        toast.success("Customer deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "fullName", headerName: "Full Name", width: 250 },
    { field: "phone", headerName: "Phone", width: 130 },
    {
      field: "address",
      headerName: "Address",
      width: 200,
    },
    {
      field: "region",
      headerName: "Region",
      width: 75,
    },
    {
      field: "rsMember",
      headerName: "RS Member",
      width: 100,
      align: "center",
      renderCell: (params) => {
        return params.row.rsMember ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        );
      },
    },
    {
      field: "receiveDrDiscount",
      headerName: "Dr's Discount",
      width: 100,
      align: "center",
      renderCell: (params) => {
        return params.row.receiveDrDiscount ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        );
      },
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
              to={`/customers/edit/${params.row.id}`}
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
              to={`/customers/${params.row.id}`}
              component={Link}
            >
              <ShowIcon />
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
        <Button variant="contained" component={Link} to={"/customers/create"}>
          New Customer
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={customers.map((customer) => ({
            id: customer.id,
            fullName: customer.fullName,
            phone: customer.phone,
            address: customer.address,
            region: customer.Region?.name,
            rsMember: customer.rsMember,
            receiveDrDiscount: customer.receiveDrDiscount,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={`Are you sure you want to delete customer #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Customer"
      />
    </Box>
  );
}
