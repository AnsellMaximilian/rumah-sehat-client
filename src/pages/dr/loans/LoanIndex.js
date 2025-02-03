import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import DeleteAlert from "../../../components/DeleteAlert";
import PayIcon from "@mui/icons-material/Paid";
import {
  formFileName,
  formQueryParams,
  getWeek,
} from "../../../helpers/common";

const DrLoanIndex = () => {
  const [loans, setLoans] = useState([]);

  const [toDeleteId, setToDeleteId] = useState(null);

  // FILTERS
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lendType, setLendType] = useState("all");

  const getLoans = async (queryParams = "") => {
    const idLoans = (await http.get(`/dr/id/loans?${queryParams}`)).data.data;
    const sgLoans = (await http.get(`/dr/sg/loans?${queryParams}`)).data.data;

    console.log({ idLoans, sgLoans });
    return [
      ...idLoans.map((l) => ({ ...l, group: "ID", itemId: l.DrIdItemId })),
      ...sgLoans.map((l) => ({ ...l, group: "SG", itemId: l.DrSgItemId })),
    ];
  };

  useEffect(() => {
    (async () => {
      setLoans(await getLoans());
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, []);

  const handleClearFilter = async () => {
    setSelectedCustomer(null);
    setLendType("all");

    setLoans(await getLoans());
  };

  console.log({ loans });

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
      ...(lendType === "all" ? {} : { lendType }),
    });
    setLoans(await getLoans(queryParams));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 75 },
    { field: "group", headerName: "Group", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    {
      field: "customerName",
      headerName: "Customer",
      width: 200,

      renderCell: (params) => {
        return (
          <Link
            color="primary"
            component={RouterLink}
            to={`/customers/${params.row.CustomerId}`}
            underline="hover"
          >
            {params.row.customerName}
          </Link>
        );
      },
    },
    {
      field: "item",
      headerName: "Item",
      width: 200,

      renderCell: (params) => {
        return (
          <Link
            color="primary"
            component={RouterLink}
            to={
              params.row.group === "ID"
                ? `/dr/id/items/${params.row.itemId}`
                : `/dr/sg/items/${params.row.itemId}`
            }
            underline="hover"
          >
            {params.row.item}
          </Link>
        );
      },
    },
    { field: "lendType", headerName: "Type", width: 50 },
    { field: "qty", headerName: "Qty", width: 50 },
    { field: "note", headerName: "Note", width: 100 },
    {
      field: "returnDate",
      headerName: "returnDate",
      width: 100,

      renderCell: (params) =>
        params.row.returnDate ? params.row.returnDate : "Not returned.",
    },
  ];
  return (
    <Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={8}>
            <Autocomplete
              value={selectedCustomer}
              onChange={(e, newValue) => {
                setSelectedCustomer(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Typography>{option.fullName}</Typography>
                </li>
              )}
              getOptionLabel={(option) => `(#${option.id}) ${option.fullName}`}
              options={customers}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Customer" size="small" />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl margin="none" fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                size="small"
                label="Type"
                value={lendType}
                fullWidth
                onChange={(e) => {
                  setLendType(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="lend">Lend</MenuItem>
                <MenuItem value="borrow">Borrow</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box display="flex" gap={2} mt={2}>
          <Button variant="outlined" fullWidth onClick={handleClearFilter}>
            Clear Filter
          </Button>
          <Button variant="contained" fullWidth onClick={handleFilter}>
            Filter
          </Button>
        </Box>
      </Box>

      <Card sx={{ marginTop: 4 }}>
        <SmartTable
          rows={loans.map((loan) => ({
            id: loan.id,
            note: loan.note,
            date: loan.date,
            lendType: loan.lendType,
            item: loan.item.name,
            qty: loan.qty,
            customerName: loan.Customer.fullName,
            returnDate: loan.returnDate,
            group: loan.group,
            itemId: loan.itemId,
            CustomerId: loan.CustomerId,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default DrLoanIndex;
