import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import { toast } from "react-toastify";
import DeleteAlert from "../../../components/DeleteAlert";
import { formQueryParams } from "../../../helpers/common";

const DrLoanIndex = () => {
  const [loans, setLoans] = useState([]);

  const [returnDate, setReturnDate] = useState("");
  const [selectedReturnLoan, setSelectedReturnLoan] = useState(null);

  const [toDeleteId, setToDeleteId] = useState(null);

  // FILTERS
  const [customers, setCustomers] = useState([]);
  const [drIdItems, setDrIdItems] = useState([]);
  const [drSgItems, setDrSgItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lendType, setLendType] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const getLoans = async (queryParams = "") => {
    const idLoans = (await http.get(`/dr/id/loans?${queryParams}`)).data.data;
    const sgLoans = (await http.get(`/dr/sg/loans?${queryParams}`)).data.data;

    return [
      ...idLoans.map((l) => ({ ...l, group: "ID", itemId: l.DrIdItemId })),
      ...sgLoans.map((l) => ({ ...l, group: "SG", itemId: l.DrSgItemId })),
    ];
  };

  useEffect(() => {
    (async () => {
      setLoans(await getLoans());
      setCustomers((await http.get("/customers")).data.data);

      setDrIdItems((await http.get("/dr/id/items?activeStatus=all")).data.data);
      setDrSgItems((await http.get("/dr/sg/items?activeStatus=all")).data.data);
    })();
  }, []);

  const handleDelete = (id_group) => {
    (async () => {
      const [id, group] = id_group.split("_");
      try {
        await http.delete(`/dr/${group === "ID" ? "id" : "sg"}/loans/${id}`);
        refreshMetaData();
        toast.success("Loan deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const refreshMetaData = async () => {
    setLoans(await getLoans());
    setCustomers((await http.get("/customers")).data.data);
    setDrIdItems((await http.get("/dr/id/items?activeStatus=all")).data.data);
    setDrSgItems((await http.get("/dr/sg/items?activeStatus=all")).data.data);
  };

  const handleClearFilter = async () => {
    setSelectedCustomer(null);
    setLendType("all");
    setSelectedItem(null);

    setLoans(await getLoans());
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
      ...(lendType === "all" ? {} : { lendType }),
      DrSgItemId: selectedItem ? selectedItem.id : undefined,
      DrIdItemId: selectedItem ? selectedItem.id : undefined,
    });
    setLoans(await getLoans(queryParams));
  };

  const handleReturn = async () => {
    try {
      if (!returnDate) throw new Error("Please choose return date.");
      if (!selectedReturnLoan) throw new Error("Please select loan to return.");
      await http.patch(
        `/dr/${selectedReturnLoan.group === "ID" ? "id" : "sg"}/loans/${
          selectedReturnLoan.id
        }/return`,
        {
          returnDate: returnDate,
        }
      );
      refreshMetaData();
      setReturnDate("");
      setSelectedReturnLoan(null);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
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
      field: "returned",
      headerName: "Returned",
      renderCell: (params) => {
        return params.row.isReturned && params.row.returnDate ? (
          <Typography>{params.row.returnDate}</Typography>
        ) : (
          <Button
            size="small"
            variant="contained"
            sx={{ fontSize: 10 }}
            onClick={() => setSelectedReturnLoan(params.row)}
          >
            Return
          </Button>
        );
      },
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setToDeleteId(`${params.row.id}_${params.row.group}`);
              }}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
      width: 200,
    },
  ];

  const allItems = useMemo(
    () => [
      ...drIdItems.map((i) => ({
        ...i,
        uniqueKey: `id-${i.id}`,
        itemType: "ID",
      })),
      ...drSgItems.map((i) => ({
        ...i,
        uniqueKey: `sg-${i.id}`,
        itemType: "SG",
      })),
    ],
    [drIdItems, drSgItems]
  );
  return (
    <Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={4}>
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
            <Autocomplete
              value={selectedItem}
              onChange={(e, newValue) => {
                setSelectedItem(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.uniqueKey === value.uniqueKey
              }
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <li {...props} key={option.uniqueKey}>
                  #{option.itemType} - {option.name}
                </li>
              )}
              options={allItems}
              renderInput={(params) => (
                <TextField {...params} label="Item" size="small" />
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
            isReturned: loan.isReturned,
          }))}
          columns={columns}
        />
      </Card>

      <Dialog
        open={!!selectedReturnLoan}
        onClose={() => setSelectedReturnLoan(null)}
        maxWidth="xl"
      >
        {selectedReturnLoan && (
          <Stack padding={4} spacing={2} minWidth={500}>
            <Typography fontWeight="bold" fontSize={24}>
              {selectedReturnLoan.lendType === "lend"
                ? `Take ${selectedReturnLoan.qty} ${selectedReturnLoan.name} back from ${selectedReturnLoan.customerName}?`
                : `Return ${selectedReturnLoan.qty} ${selectedReturnLoan.name} to ${selectedReturnLoan.customerName}?`}
            </Typography>
            <Stack spacing={2} direction="row">
              <TextField
                label="Return Date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <Button fullWidth variant="outlined" onClick={handleReturn}>
                Return
              </Button>
            </Stack>
          </Stack>
        )}
      </Dialog>

      <DeleteAlert
        message="Are you sure you want to remove this loan?"
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Draw"
      />
    </Box>
  );
};

export default DrLoanIndex;
