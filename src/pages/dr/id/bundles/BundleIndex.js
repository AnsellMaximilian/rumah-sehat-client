import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
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
import CustomDialog from "../../../../components/Dialog";
import { FORM_MODE } from "../../../../const";

const DrIdBundleIndex = () => {
  const [bundles, setBundles] = useState([]);

  const [toDeleteId, setToDeleteId] = useState(null);

  // CRUDs
  const [items, setItems] = useState([]);

  const [formMode, setFormMode] = useState(FORM_MODE.NONE);

  const [selectedBundleItems, setSelectedBundleItems] = useState([]);
  const [selectedParentItem, setSelectedParentItem] = useState(null);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/dr/id/bundles/${id}`);
        setBundles((bundles) => bundles.filter((bundle) => bundle.id !== id));
        toast.success("Bundle deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setBundles((await http.get("/dr/id/bundles")).data.data);

      setItems((await http.get("/dr/id/items")).data.data);
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
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="warning"
              component={Link}
              to={`/dr/id/bundles/edit/${params.row.id}`}
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
              to={`/dr/id/bundles/${params.row.id}`}
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
        <Button
          variant="contained"
          onClick={() => setFormMode(FORM_MODE.CREATE)}
        >
          New Bundle
        </Button>
      </Box>

      <Card sx={{ marginTop: 4 }}>
        <SmartTable
          rows={bundles.map((bundle) => ({
            id: bundle.id,
            name: bundle.DrIdItem.name,
            priceRP: bundle.DrIdItem.priceRP,
            points: bundle.DrIdItem.points,
            isActive: bundle.DrIdItem.isActive,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={`Are you sure you want to delete bundle #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Bundle"
      />

      <CustomDialog
        open={formMode !== FORM_MODE.NONE}
        onClose={() => setFormMode(FORM_MODE.NONE)}
        title="Create a Bundle"
      >
        <Grid container spacing={2} marginTop={1}>
          <Grid item sx={{ padding: 0 }}>
            <Autocomplete
              value={selectedParentItem}
              onChange={(e, newValue) => {
                setSelectedParentItem(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              getOptionLabel={(option) => `(#${option.id}) ${option.name}`}
              options={items}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: 200 }}
                  label="Parent Item"
                />
              )}
            />
          </Grid>
        </Grid>
      </CustomDialog>
    </Box>
  );
};

export default DrIdBundleIndex;
