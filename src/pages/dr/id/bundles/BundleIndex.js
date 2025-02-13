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
import { formQueryParams, toastError } from "../../../../helpers/common";
import CustomDialog from "../../../../components/Dialog";
import { FORM_MODE } from "../../../../const";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Cancel from "@mui/icons-material/Cancel";
import Stack from "@mui/material/Stack";
import AutoSelectTextField from "../../../../components/AutoSelectTextField";

const DrIdBundleIndex = () => {
  const [bundles, setBundles] = useState([]);

  const [toDeleteId, setToDeleteId] = useState(null);

  // CRUDs
  const [items, setItems] = useState([]);
  const [uniqueItems, setUniqueItems] = useState([]);

  const [formMode, setFormMode] = useState(FORM_MODE.NONE);

  const [bundleItems, setBundleItems] = useState([]);
  const [selectedParentItem, setSelectedParentItem] = useState(null);

  const [bundleToEditId, setBundleToEditId] = useState(null);

  const [selectedBundle, setSelectedBundle] = useState(null);

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

  useEffect(() => {
    const uniqueItems = items.filter(
      (i) => !!!bundleItems.find((bi) => bi.item.id === i.id) && !i.isBundle
    );
    setUniqueItems(uniqueItems);
  }, [bundleItems, items]);

  useEffect(() => {
    if (bundleToEditId) {
      const bundleToEdit = bundles.find((b) => b.id === bundleToEditId);

      setFormMode(FORM_MODE.EDIT);
      setSelectedParentItem(bundleToEdit.DrIdItem);
      setBundleItems(
        bundleToEdit.DrIdBundleItems.map((bi) => ({
          item: bi.DrIdItem,
          qty: parseFloat(bi.qty),
        }))
      );
    } else {
      reset();
    }
  }, [bundleToEditId, bundles]);

  const handleAddBundleItem = () => {
    const item = uniqueItems[0];

    if (!item) {
      toast.error("No more item can be bundled.");
      return;
    }
    setBundleItems((prev) => [
      ...prev,
      {
        item,
        qty: 0,
      },
    ]);
  };

  const handleRemoveBundleItem = (bundleItem) => {
    setBundleItems((prev) =>
      prev.filter((bi) => bi.item.id !== bundleItem.item.id)
    );
  };

  const handleChangeBundleItem = (bundleItem, newItem) => {
    if (!uniqueItems.includes(newItem)) {
      toast.error("That item is already part of the bundle");
      return;
    }
    setBundleItems((prev) =>
      prev.map((bi) => {
        if (bi.item.id === bundleItem.item.id)
          return {
            ...bi,
            item: newItem,
          };

        return bi;
      })
    );
  };

  const handleChangeBundleItemQty = (bundleItem, qty) => {
    setBundleItems((prev) =>
      prev.map((bi) => {
        if (bi.item.id === bundleItem.item.id)
          return {
            ...bi,
            qty: qty,
          };
        return bi;
      })
    );
  };

  const reset = () => {
    setBundleItems([]);
    setFormMode(FORM_MODE.NONE);
    setSelectedParentItem(null);
    setBundleToEditId(null);
  };

  const handleSubmitBundle = async () => {
    console.log({ selectedParentItem, bundleItems });

    try {
      if (bundleItems.length === 0)
        throw new Error("Bundle must include at least one item");
      if (selectedParentItem === null)
        throw new Error("Bundle requires a parent item");

      if (bundleItems.some((bi) => bi.qty <= 0))
        throw new Error("Qty cannot be zero or negative");

      const body = {
        parentItemId: selectedParentItem.id,
        bundleItems: bundleItems.map((bi) => ({
          itemId: bi.item.id,
          qty: bi.qty,
        })),
      };

      if (bundleToEditId) {
        await http.patch(`/dr/id/bundles/${bundleToEditId}`, body);
        toast.success("updated bundle");
      } else {
        await http.post("/dr/id/bundles", body);
        toast.success("Created bundle");
      }

      reset();
      setBundles((await http.get("/dr/id/bundles")).data.data);

      setItems((await http.get("/dr/id/items")).data.data);
    } catch (error) {
      console.log(error);
      toastError(error);
    }
  };

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
              onClick={() => {
                setBundleToEditId(params.row.id);
              }}
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
              onClick={() =>
                setSelectedBundle(bundles.find((b) => b.id === params.row.id))
              }
            >
              <ShowIcon />
            </IconButton>
          </>
        );
      },
      width: 300,
    },
  ];

  if (items.length <= 0) return <Box>Loading...</Box>;

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
        onClose={() => {
          reset();
        }}
        title={
          bundleToEditId
            ? `Update bundle #${bundleToEditId}`
            : "Create a Bundle"
        }
        maxWidth="xl"
        actionLabel={bundleToEditId ? "Update" : "Create"}
        action={() => {
          handleSubmitBundle();
        }}
      >
        <Grid container gap={2} mt={1}>
          <Grid item xs={12}>
            <Autocomplete
              tabIndex={-1}
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
              options={items.filter(
                (i) => i.isBundle && bundles.every((b) => b.DrIdItemId !== i.id)
              )}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    tabIndex: -1,
                  }}
                  size="small"
                  fullWidth
                  label="Parent Item"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={1}>
              <Box
                sx={{ backgroundColor: "primary.light", color: "white" }}
                padding={1}
                flex={1}
              >
                Bundle Items
              </Box>
              <Button variant="outlined" onClick={() => handleAddBundleItem()}>
                Add Row
              </Button>
            </Box>
            <TableContainer sx={{ marginTop: 1 }}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Actions</TableCell>
                    <TableCell align="left">Item</TableCell>

                    <TableCell align="right">Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bundleItems.map((item) => (
                    <TableRow
                      key={item.item.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box display="flex" gap={2}>
                          <IconButton
                            tabIndex={-1}
                            onClick={() => handleRemoveBundleItem(item)}
                          >
                            <Cancel color="error" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Autocomplete
                          value={item.item}
                          onChange={(_, newValue) => {
                            handleChangeBundleItem(item, newValue);
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          getOptionLabel={(option) => option.name}
                          renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                              {option.name}
                            </li>
                          )}
                          options={[...uniqueItems, item.item]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              sx={{ width: 200 }}
                              inputProps={{
                                ...params.inputProps,
                                tabIndex: 0,
                              }}
                            />
                          )}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <AutoSelectTextField
                          size="small"
                          margin="none"
                          sx={{ width: 50 }}
                          type="number"
                          value={item.qty}
                          variant="standard"
                          inputProps={{ min: 0, tabIndex: 0 }}
                          onChange={(e) => {
                            handleChangeBundleItemQty(item, e.target.value);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CustomDialog>

      <CustomDialog
        open={selectedBundle !== null}
        onClose={() => {
          setSelectedBundle(null);
        }}
        title={`Bundle ${selectedBundle?.id}`}
        maxWidth="xl"
      >
        <Grid container gap={2} mt={1}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight="bold">Parent Item</Typography>
              <Typography>{selectedBundle?.DrIdItem?.name}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={1}>
              <Box
                sx={{ backgroundColor: "primary.light", color: "white" }}
                padding={1}
                flex={1}
              >
                Bundle Items
              </Box>
            </Box>
            <TableContainer sx={{ marginTop: 1 }}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Item</TableCell>
                    <TableCell align="right">Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedBundle?.DrIdBundleItems.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left">
                        <Typography>{item.DrIdItem.name}</Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography>{item.qty}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CustomDialog>
    </Box>
  );
};

export default DrIdBundleIndex;
