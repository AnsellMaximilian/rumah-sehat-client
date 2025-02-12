import React, { useCallback, useEffect, useState } from "react";
import CustomDialog from "../../Dialog";
import http from "../../../http-common";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Cancel from "@mui/icons-material/Cancel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import AutoSelectTextField from "../../AutoSelectTextField";
import { toastError } from "../../../helpers/common";
export default function BulkAdjustForm({ isOpen, setIsOpen }) {
  const [items, setItems] = useState([]);
  const [universalDescription, setUniversalDescription] = useState("");
  const [adjustmentDate, setAdjustmentDate] = useState("");
  const [adjustmentItems, setAdjustmentItems] = useState([]);
  const fetchData = useCallback(async () => {
    setItems((await http.get("/dr/sg/items?activeStatus=all")).data.data);
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleAddAdjustmentItem = () => {
    const item = items[0];
    setAdjustmentItems((prev) => [
      ...prev,
      {
        key: uuidv4(),
        item,
        description: "",
        amount: 0,
      },
    ]);
  };
  const handleRemoveAdjustmentItem = (key) => {
    setAdjustmentItems((prev) => prev.filter((ai) => ai.key !== key));
  };
  const handleItemAttrChange = (attr, detailKey, customValue) => (e) => {
    setAdjustmentItems((prev) =>
      prev.map((detail) => {
        if (detail.key === detailKey) {
          return {
            ...detail,
            [attr]: customValue !== undefined ? customValue : e.target.value,
          };
        }
        return detail;
      })
    );
  };
  const handleSubmit = async () => {
    try {
      if (!adjustmentDate) throw new Error("Please select a date.");
      if (adjustmentItems.length <= 0)
        throw new Error("Please include at least 1 loan.");
      const body = {
        adjustmentItems: adjustmentItems.map((item) => {
          if (!item) throw new Error("Item required");
          return {
            date: adjustmentDate,
            amount: item.amount,
            DrSgItemId: item.item.id,
            description: item.description
              ? item.description
              : universalDescription,
          };
        }),
      };
      const adjustments = (
        await http.post(`/dr/sg/items/bulk-adjust-stock`, body)
      ).data.data;
      toast.success(`Created ${adjustments.length} adjustments.`);
      reset();
    } catch (error) {
      toastError(error);
    }
  };
  const reset = () => {
    setAdjustmentItems([]);
    setAdjustmentDate("");
    setUniversalDescription("");
  };
  return (
    <>
      <CustomDialog
        onClose={() => setIsOpen(false)}
        open={isOpen}
        maxWidth="xl"
        title="Bulk Adjustment"
        action={() => {
          handleSubmit();
          setIsOpen(false);
        }}
        actionLabel="Submit"
      >
        <Grid container gap={2} mt={1}>
          <Grid item xs={12}>
            <Box display="flex" gap={2} alignItems="stretch">
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Date"
                  type="date"
                  value={adjustmentDate}
                  onChange={(e) => setAdjustmentDate(e.target.value)}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  multiline
                  margin="none"
                  label="Universal Note"
                  value={universalDescription}
                  onChange={(e) => setUniversalDescription(e.target.value)}
                  rows={3}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={1}>
              <Box
                sx={{ backgroundColor: "primary.light", color: "white" }}
                padding={1}
                flex={1}
              >
                Adjustment Items
              </Box>
              <Button
                variant="outlined"
                onClick={() => handleAddAdjustmentItem()}
              >
                Add Row
              </Button>
            </Box>
            <TableContainer sx={{ marginTop: 1 }}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Actions</TableCell>
                    <TableCell align="left">Item</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adjustmentItems.map((item) => (
                    <TableRow
                      key={item.key}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box display="flex" gap={2}>
                          <IconButton
                            tabIndex={-1}
                            onClick={() => handleRemoveAdjustmentItem(item.key)}
                          >
                            <Cancel color="error" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Autocomplete
                          value={item.item}
                          onChange={(e, newValue) => {
                            handleItemAttrChange("item", item.key, newValue)(e);
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
                          options={items}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              sx={{ width: 200 }}
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
                          value={item.amount}
                          variant="standard"
                          inputProps={{ min: 0 }}
                          onChange={handleItemAttrChange("amount", item.key)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <AutoSelectTextField
                          fullWidth
                          size="small"
                          margin="none"
                          value={item.description}
                          variant="standard"
                          onChange={handleItemAttrChange(
                            "description",
                            item.key
                          )}
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
    </>
  );
}
