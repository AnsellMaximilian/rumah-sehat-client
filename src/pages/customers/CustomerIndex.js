import { Button, Card } from "@mui/material";
import SmartTable from "../../components/SmartTable";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCustomers } from "../../slices/customerSlice";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "fullName", headerName: "Full Name", width: 130 },
  { field: "phone", headerName: "Phone", width: 130 },
  {
    field: "address",
    headerName: "Address",
    width: 200,
  },
];

export default function CustomerIndex() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

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
