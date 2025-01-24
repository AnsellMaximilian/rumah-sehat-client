import { useEffect, useState } from "react";
import http from "../../http-common";
import { formQueryParams } from "../../helpers/common";

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
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import DeleteAlert from "../../components/DeleteAlert";

export default function RegionIndex() {
  const [regions, setRegions] = useState([]);

  // filter
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      setRegions((await http.get("/regions")).data.data);
    })();
  }, []);

  const [toDeleteId, setToDeleteId] = useState(null);
  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/regions/${id}`);
        setRegions((prev) => prev.filter((reg) => reg.id !== id));
        toast.success("Region deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleClearFilter = async () => {
    setName("");

    setRegions((await http.get("/regions")).data.data);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      name,
    });
    // console.log(queryParams);
    setRegions((await http.get(`/regions?${queryParams}`)).data.data);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Name", width: 350 },
    { field: "totalCustomers", headerName: "Total Customers", width: 100 },

    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="warning"
              component={Link}
              to={`/regions/edit/${params.row.id}`}
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
          </>
        );
      },
      width: 300,
    },
  ];

  return (
    <Box>
      <Box paddingBottom={2}>
        <Button variant="contained" component={Link} to={"/regions/create"}>
          New Region
        </Button>
      </Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          rows={regions.map((reg) => ({
            id: reg.id,
            name: reg.name,
            totalCustomers: reg.Customers.length,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={`Are you sure you want to delete region #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Region"
      />
    </Box>
  );
}
