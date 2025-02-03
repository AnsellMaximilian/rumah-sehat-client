import React, { useEffect, useState } from "react";
import http from "../../../http-common";
import Box from "@mui/material/Box";
import { v4 as uuidv4 } from "uuid";

import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Fab from "@mui/material/Fab";
import Cancel from "@mui/icons-material/Cancel";
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AutoSelectTextField from "../../../components/AutoSelectTextField";

export default function BulkDraw() {
  const [products, setProducts] = useState([]);
  const [date, setDate] = useState(moment().format("yyyy-MM-DD"));
  const [draws, setDraws] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setProducts((await http.get("/rs/products")).data.data);
    })();
  }, []);

  const handleAddDraw = () => {
    const product = products[0];
    setDraws((prev) => {
      return [
        ...prev,
        {
          key: uuidv4(),
          amount: 0,
          product: product,
          date: date,
          description: "",
          ProductId: product.id,
          search: "",
        },
      ];
    });
  };

  const handleRemoveDraw = (drawKey) => () =>
    setDraws((prev) => prev.filter((draw) => draw.key !== drawKey));

  const handleChangeDraw = (attr, drawKey) => (e) => {
    setDraws((prev) => {
      return prev.map((draw) => {
        if (draw.key === drawKey)
          return {
            ...draw,
            [attr]: e.target.value,
          };
        return draw;
      });
    });
  };

  const handleSubmit = async () => {
    try {
      if (draws.length < 1)
        throw new Error("Please include at least one draw.");

      for (const draw of draws) {
        if (draw.amount < 1)
          throw new Error("Cannot draw 0 or negative items.");

        if (!(draw.ProductId && draw.product))
          throw new Error("Each draw must have a product.");
      }

      const body = {
        draws,
      };

      await http.post(`/rs/draws/bulk-draw`, body);
      toast.success(`Drawn ${draws.length} draws.`);
      navigate(`/rs/products/`);
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return products.length > 0 ? (
    <Box paddingBottom={10}>
      <Box display="flex" gap={2} alignItems="stretch">
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </Box>
      <Box marginTop={2}>
        <Box display="flex" gap={1}>
          <Box
            sx={{ backgroundColor: "primary.dark", color: "white" }}
            padding={1}
            flex={1}
          >
            Products
          </Box>
          <Button
            variant="contained"
            sx={{ boxShadow: "none" }}
            onClick={handleAddDraw}
          >
            Add Row
          </Button>
        </Box>
      </Box>
      <Box>
        <TableContainer sx={{ marginTop: 1 }}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell align="left">Product</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {draws.map((draw) => (
                <TableRow
                  key={draw.key}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box display="flex" gap={2}>
                      <IconButton
                        onClick={handleRemoveDraw(draw.key)}
                        tabIndex={-1}
                      >
                        <Cancel color="error" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Autocomplete
                      value={draw.product}
                      onInputChange={(e, newValue) => {
                        setDraws((prev) => {
                          return prev.map((currentDraw) => {
                            if (currentDraw.key === draw.key) {
                              return {
                                ...draw,
                                search: newValue,
                              };
                            }
                            return currentDraw;
                          });
                        });
                      }}
                      onChange={(event, newValue) => {
                        setDraws((prev) => {
                          return prev.map((currentDraw) => {
                            if (currentDraw.key === draw.key) {
                              return newValue
                                ? {
                                    ...draw,
                                    product: newValue,
                                    ProductId: newValue.id,
                                  }
                                : {
                                    ...draw,
                                    product: null,
                                    ProductId: null,
                                  };
                            }
                            return currentDraw;
                          });
                        });
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
                      options={products}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <AutoSelectTextField
                      size="small"
                      margin="none"
                      variant="standard"
                      sx={{ width: 75 }}
                      type="number"
                      value={draw.amount}
                      onChange={handleChangeDraw("amount", draw.key)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <AutoSelectTextField
                      size="small"
                      margin="none"
                      variant="standard"
                      type="text"
                      value={draw.description}
                      onChange={handleChangeDraw("description", draw.key)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ position: "absolute", right: 20, bottom: 20 }}>
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          onClick={handleSubmit}
        >
          Draw
        </Fab>
      </Box>
    </Box>
  ) : (
    <div>Loading...</div>
  );
}
