import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../../../http-common";
import SmartTable from "../../../../components/SmartTable";
import { toast } from "react-toastify";
import NumericFormatRp from "../../../../components/NumericFormatRp";
import DeleteAlert from "../../../../components/DeleteAlert";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { formQueryParams } from "../../../../helpers/common";
import BulkLoanForm from "../../../../components/dr/id/BulkLoanForm";
import BulkAdjustForm from "../../../../components/dr/id/BulkAdjustForm";

const DrIdItemIndex = () => {
  const [items, setItems] = useState([]);

  const [toDeleteId, setToDeleteId] = useState(null);

  // filters
  const [name, setName] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [bundleStatus, setBundleStatus] = useState("all");

  // bulk loan
  const [isBulkLoanOpen, setIsBulkLoanOpen] = useState(false);

  // bulk adjustment
  const [isBulkAdjustmentOpen, setIsBulkAdjustmentOpen] = useState(false);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/dr/id/items/${id}`);
        setItems((items) => items.filter((item) => item.id !== id));
        toast.success("Item deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleClearFilter = async () => {
    setName("");

    setItems((await http.get("/dr/id/items?activeStatus=all")).data.data);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      name,
      activeStatus,
      isBundle: bundleStatus === "all" ? undefined : bundleStatus,
    });
    setItems((await http.get(`/dr/id/items?${queryParams}`)).data.data);
  };

  const cycleActiveStatus = async (id) => {
    try {
      const item = (await http.patch(`/dr/id/items/${id}/cycle-active-status`))
        .data.data;
      toast.success(`Updated item #${item.id}`, { autoClose: 500 });
      setItems((prev) =>
        prev.map((cus) => {
          if (cus.id === id) return { ...cus, isActive: item.isActive };
          return cus;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      setItems((await http.get("/dr/id/items?activeStatus=all")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "priceRP",
      headerName: "Price (Rp)",
      width: 130,

      renderCell: (params) => <NumericFormatRp value={params.row.priceRP} />,
    },
    {
      field: "points",
      headerName: "Points",
      width: 200,
    },

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
              to={`/dr/id/items/edit/${params.row.id}`}
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
              to={`/dr/id/items/${params.row.id}`}
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
      <Box paddingBottom={2} display="flex" gap={2} justifyContent="start">
        <Button variant="contained" component={Link} to={"/dr/id/items/create"}>
          New Item
        </Button>
        <Button variant="outlined" onClick={() => setIsBulkLoanOpen(true)}>
          Loan
        </Button>
        <Button
          variant="outlined"
          onClick={() => setIsBulkAdjustmentOpen(true)}
        >
          Adjust
        </Button>
      </Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Name"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
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
          <Grid item xs={2}>
            <FormControl margin="none" fullWidth>
              <InputLabel id="demo-simple-select-label">
                Bundle Status
              </InputLabel>
              <Select
                size="small"
                label="Bundle Status"
                value={bundleStatus}
                fullWidth
                onChange={(e) => {
                  setBundleStatus(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Bundle</MenuItem>
                <MenuItem value="false">Singular</MenuItem>
              </Select>
            </FormControl>
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
          rows={items.map((item) => ({
            id: item.id,
            name: item.name,
            priceRP: item.priceRP,
            points: item.points,
            isActive: item.isActive,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={`Are you sure you want to delete ID item #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Item"
      />

      <BulkLoanForm isOpen={isBulkLoanOpen} setIsOpen={setIsBulkLoanOpen} />

      <BulkAdjustForm
        isOpen={isBulkAdjustmentOpen}
        setIsOpen={setIsBulkAdjustmentOpen}
      />
    </Box>
  );
};

export default DrIdItemIndex;
