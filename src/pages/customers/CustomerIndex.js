import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import SmartTable from "../../components/SmartTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link, useSearchParams } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import http from "../../http-common";
import DeleteAlert from "../../components/DeleteAlert";

export default function CustomerIndex() {
  const [customers, setCustomers] = useState([]);

  const [regions, setRegions] = useState([]);
  const [regionsLoaded, setRegionsLoaded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.toString();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  useEffect(() => {
    (async () => {
      setRegions((await http.get("/regions")).data.data);
      setRegionsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!regionsLoaded) return;

    const params = new URLSearchParams(searchQuery);
    const queryFullName = params.get("fullName") || "";
    const queryAddress = params.get("address") || "";
    const queryPhone = params.get("phone") || "";
    const queryNote = params.get("note") || "";
    const regionId = params.get("RegionId");
    const requestedActiveStatus = params.get("activeStatus");
    const queryActiveStatus = ["active", "inactive"].includes(
      requestedActiveStatus
    )
      ? requestedActiveStatus
      : "all";

    setFullName(queryFullName);
    setAddress(queryAddress);
    setPhone(queryPhone);
    setNote(queryNote);
    setSelectedRegion(
      regions.find((region) => String(region.id) === regionId) || null
    );
    setActiveStatus(queryActiveStatus);

    const apiParams = new URLSearchParams();
    if (queryFullName) apiParams.set("fullName", queryFullName);
    if (queryAddress) apiParams.set("address", queryAddress);
    if (queryPhone) apiParams.set("phone", queryPhone);
    if (queryNote) apiParams.set("note", queryNote);
    if (regionId) apiParams.set("RegionId", regionId);
    apiParams.set("activeStatus", queryActiveStatus);

    let cancelled = false;
    (async () => {
      const response = await http.get(`/customers?${apiParams.toString()}`);
      if (!cancelled) setCustomers(response.data.data);
    })();

    return () => {
      cancelled = true;
    };
  }, [regions, regionsLoaded, searchQuery]);

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

  const handleClearFilter = () => {
    setFullName("");
    setAddress("");
    setPhone("");
    setNote("");
    setSelectedRegion(null);
    setActiveStatus("all");
    setSearchParams({});
  };

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (fullName.trim()) params.set("fullName", fullName.trim());
    if (address.trim()) params.set("address", address.trim());
    if (phone.trim()) params.set("phone", phone.trim());
    if (note.trim()) params.set("note", note.trim());
    if (selectedRegion) params.set("RegionId", selectedRegion.id);
    if (activeStatus !== "all") params.set("activeStatus", activeStatus);
    setSearchParams(params);
  };

  const cycleActiveStatus = async (id) => {
    try {
      const customer = (
        await http.patch(`/customers/${id}/cycle-active-status`)
      ).data.data;
      toast.success(`Updated customer #${customer.id}`, { autoClose: 500 });
      setCustomers((prev) =>
        prev.map((cus) => {
          if (cus.id === id) return { ...cus, isActive: customer.isActive };
          return cus;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "fullName", headerName: "Full Name", width: 250 },
    { field: "accountName", headerName: "Account Name", width: 220 },
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
    // {
    //   field: "rsMember",
    //   headerName: "RS Member",
    //   width: 100,
    //   align: "center",
    //   renderCell: (params) => {
    //     return params.row.rsMember ? (
    //       <CheckCircleIcon color="success" />
    //     ) : (
    //       <CancelIcon color="error" />
    //     );
    //   },
    // },
    // {
    //   field: "receiveDrDiscount",
    //   headerName: "Dr's Discount",
    //   width: 100,
    //   align: "center",
    //   renderCell: (params) => {
    //     return params.row.receiveDrDiscount ? (
    //       <CheckCircleIcon color="success" />
    //     ) : (
    //       <CancelIcon color="error" />
    //     );
    //   },
    // },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      align: "center",
      renderCell: (params) => {
        return (
          <IconButton
            color={params.row.isActive ? "success" : "error"}
            onClick={(e) => {
              e.stopPropagation();
              cycleActiveStatus(params.row.id);
            }}
          >
            {params.row.isActive ? <CheckCircleIcon /> : <CancelIcon />}
          </IconButton>
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
              target="_blank"
              rel="noopener noreferrer"
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
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={9}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl margin="none" fullWidth>
              <InputLabel id="demo-simple-select-label">
                Active Status
              </InputLabel>
              <Select
                size="small"
                label="Active Status"
                value={activeStatus}
                fullWidth
                onChange={(e) => {
                  setActiveStatus(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              value={selectedRegion}
              onChange={(e, newValue) => {
                setSelectedRegion(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Typography>{option.name}</Typography>
                </li>
              )}
              getOptionLabel={(option) => `(#${option.id}) ${option.name}`}
              options={regions}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Region" size="small" />
              )}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              size="small"
              label="Address"
              onChange={(e) => setAddress(e.target.value)}
              multiline
              value={address}
              rows={3}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="Note"
              onChange={(e) => setNote(e.target.value)}
              multiline
              value={note}
              rows={3}
            />
          </Grid>
        </Grid>

        <Box display="flex" gap={2} marginTop={2}>
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
          rows={customers.map((customer) => ({
            id: customer.id,
            fullName: customer.fullName,
            accountName: customer.accountName,
            phone: customer.phone,
            address: customer.address,
            region: customer.Region?.name,
            rsMember: customer.rsMember,
            receiveDrDiscount: customer.receiveDrDiscount,
            note: customer.note,
            isActive: customer.isActive,
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
