import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import SmartTable from "../../components/SmartTable";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { destroyCustomer, fetchCustomers } from "../../slices/customerSlice";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";

export default function CustomerIndex() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(destroyCustomer(id));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fullName", headerName: "Full Name", width: 130 },
    { field: "phone", headerName: "Phone", width: 130 },
    {
      field: "address",
      headerName: "Address",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton color="warning">
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
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
}
