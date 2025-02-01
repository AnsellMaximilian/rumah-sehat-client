import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import http from "../../../http-common";
import Delete from "@mui/icons-material/Delete";
import NumericFormatRp from "../../../components/NumericFormatRp";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";

import AutoSelectTextField from "../../../components/AutoSelectTextField";
import SmartTable from "../../../components/SmartTable";
import DeleteAlert from "../../../components/DeleteAlert";
import ProductAnalysis from "../../../components/rs/ProductAnalysis";
import CustomDialog from "../../../components/Dialog";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function ProductShow() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);
  const [stockMatches, setStockMatches] = useState([]);

  const [drawAmount, setDrawAmount] = useState(0);
  const [drawDate, setDrawDate] = useState("");
  const [drawDescription, setDrawDescription] = useState("");

  const [productHistory, setProductHistory] = useState(null);

  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustDate, setAdjustDate] = useState("");
  const [adjustDescription, setAdjustDescription] = useState("");

  const [toDeleteDrawId, setToDeleteDrawId] = useState(null);
  const [toDeleteAdjustmentId, setToDeleteAdjustmentId] = useState(null);

  const [isStockMatchDialogOpen, setIsStockMatchDialogOpen] = useState(false);

  const handleDeleteDraw = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/draws/${id}`);
        refreshMetaData();
        toast.success("Draw deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleDeleteAdjustment = (id) => {
    (async () => {
      try {
        await http.delete(`/rs/stock-adjustments/${id}`);
        refreshMetaData();
        toast.success("Stock Adjustment deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleDraw = async () => {
    try {
      if (drawAmount <= 0) throw new Error("Amount can't be 0.");
      if (!drawDate) throw new Error("Date can't be empty");
      const body = {
        amount: drawAmount,
        date: drawDate,
        description: drawDescription ? drawDescription : null,
        ProductId: product.id,
      };
      const draw = (await http.post(`/rs/draws`, body)).data.data;
      refreshMetaData();
      setDrawAmount(0);
      setDrawDate("");
      setDrawDescription("");
      toast.success(`Succesfully drawn ${draw.amount}`);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
  };

  const handleAdjust = async () => {
    try {
      if (!adjustDate) throw new Error("Date can't be empty");
      const body = {
        amount: adjustAmount,
        date: adjustDate,
        description: adjustDescription ? adjustDescription : null,
      };
      const adjust = (await http.post(`/rs/products/${id}/adjust-stock`, body))
        .data.data;
      refreshMetaData();
      setAdjustAmount(0);
      setAdjustDate("");
      setAdjustDescription("");
      toast.success(`Succesfully adjusted ${adjust.amount}`);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
  };

  const handleMatchStock = async () => {
    try {
      const body = {
        qty: stock,
        date: moment(),
        description: null,
      };
      const match = (await http.post(`/rs/products/${id}/match-stock`, body))
        .data.data;
      refreshMetaData();
      toast.success(`Succesfully matched stock. ID: ${match.id}`);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
  };

  const refreshMetaData = useCallback(() => {
    (async () => {
      setStock((await http.get(`/rs/products/${id}/stock`)).data.data);
      setStockMatches(
        (await http.get(`/rs/products/${id}/stock-matches?limit=10`)).data.data
      );
      if (product.keepStockSince) {
        const his = (await http.get(`/rs/products/${id}/history`)).data.data;
        setProductHistory(his);
      }
    })();
  }, [product, id]);

  useEffect(() => {
    (async () => {
      const product = (await http.get(`/rs/products/${id}`)).data.data;
      setProduct(product);
      setStock((await http.get(`/rs/products/${id}/stock`)).data.data);
      setStockMatches(
        (await http.get(`/rs/products/${id}/stock-matches?limit=10`)).data.data
      );
      if (product.keepStockSince) {
        const his = (await http.get(`/rs/products/${id}/history`)).data.data;
        setProductHistory(his);
      }
    })();
  }, [id]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 125 },
      { field: "date", headerName: "Date", width: 125 },
      {
        field: "flow",
        headerName: "Flow",
        width: 130,
        renderCell: (params) => {
          return (
            <Typography
              color={params.row.flow === "IN" ? "success.main" : "error.main"}
              fontWeight="bold"
            >
              {params.row.flow}
            </Typography>
          );
        },
      },
      {
        field: "type",
        headerName: "Type",
        width: 130,
        renderCell: (params) => {
          return params.row.type === "DRAW" ? (
            <Typography>{params.row.type}</Typography>
          ) : (
            <Link
              color="primary"
              component={RouterLink}
              to={
                params.row.type === "PURCHASE"
                  ? `/rs/purchases/${params.row.parentId}`
                  : `/rs/deliveries/${params.row.parentId}`
              }
              underline="hover"
            >
              {params.row.type}
            </Link>
          );
        },
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 100,
        renderCell: (params) => {
          return (
            <Typography
              color={params.row.flow === "IN" ? "success.main" : "error.main"}
              fontWeight="bold"
            >
              {Math.abs(parseFloat(params.row.amount))}
            </Typography>
          );
        },
      },
      {
        field: "description",
        headerName: "Description",
        width: 250,
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => {
          return (
            <>
              {params.row.type === "DRAW" ? (
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setToDeleteDrawId(params.row.parentId);
                  }}
                >
                  <Delete />
                </IconButton>
              ) : params.row.type === "ADJUST" ? (
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setToDeleteAdjustmentId(params.row.parentId);
                  }}
                >
                  <Delete />
                </IconButton>
              ) : null}
            </>
          );
        },
        width: 200,
      },
    ],
    []
  );

  const productHistoryOrganized = useMemo(() => {
    if (!productHistory) return null;
    const purchases = productHistory.purchaseDetails.map((det) => ({
      id: `in-${det.id}`,
      parentId: det.Purchase.id,
      flow: "IN",
      type: "PURCHASE",
      amount: det.qty,
      date: det.Purchase.date,
      description: det.Purchase.note,
    }));
    const deliveries = productHistory.deliveryDetails.map((det) => ({
      id: `out-${det.id}`,
      parentId: det.Delivery.id,

      flow: "OUT",
      type: "SALE",
      amount: det.qty,
      date: det.Delivery.date,
      description: `Sold to ${det.Delivery.customerFullName}`,
    }));
    const draws = productHistory.draws.map((det) => ({
      id: `draw-${det.id}`,
      parentId: det.id,

      flow: "OUT",
      type: "DRAW",
      amount: det.amount,
      date: det.date,
      description: det.description,
    }));

    const adjustments = productHistory.adjustments.map((det) => ({
      id: `adj-${det.id}`,
      parentId: det.id,
      flow: det.amount < 0 ? "OUT" : "IN",
      type: "ADJUST",
      amount: det.amount,
      date: det.date,
      description: det.description,
    }));
    return [...draws, ...deliveries, ...purchases, ...adjustments];
  }, [productHistory]);

  return product ? (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
            >
              <Box marginBottom={2}>
                <Typography
                  variant="subtitle"
                  fontWeight="bold"
                  color="GrayText"
                >
                  #{product.id}
                </Typography>
                <Box>
                  <Typography variant="h5" fontWeight="bold" lineHeight={0.7}>
                    {product.name}
                  </Typography>
                  <Typography variant="subtitle1">
                    {product.Supplier.name}
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  component={RouterLink}
                  color="warning"
                  to={`/rs/products/edit/${id}`}
                >
                  Edit
                </Button>
              </Stack>
            </Box>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold">Price</Typography>
                <Typography>
                  <NumericFormatRp value={product.price} />
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold">Cost</Typography>
                <Typography>
                  <NumericFormatRp value={product.cost} />
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold">Restock Number</Typography>
                <Typography>
                  {product.restockNumber ? product.restockNumber : 1}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold">Stock Colors</Typography>
                <Stack direction="row" spacing={1}>
                  <Typography color="red">
                    {product.getStockColors.red}
                  </Typography>
                  <Typography color="orange">
                    {product.getStockColors.orange}
                  </Typography>
                  <Typography color="yellowgreen">
                    {product.getStockColors.yellow}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h4" fontWeight="bold">
                  Stock
                </Typography>
                <Typography>
                  {product.keepStockSince
                    ? `Since ${product.keepStockSince}`
                    : ""}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="subtitle" fontWeight="medium">
                  Latest Stock Match
                </Typography>
                {stockMatches.length > 0 ? (
                  <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems="center"
                    justifyContent="end"
                  >
                    <Typography>
                      {moment(stockMatches[0].date).format(
                        "DD-MM-YYYY HH:mm:ss"
                      )}{" "}
                      at {parseFloat(stockMatches[0].qty)}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        setIsStockMatchDialogOpen(true);
                      }}
                    >
                      <VisibilityIcon color="primary" />
                    </IconButton>
                  </Stack>
                ) : (
                  <Typography>No matches.</Typography>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleMatchStock}
                >
                  Match Stock
                </Button>
              </Stack>
              <Typography variant="h5" fontWeight="bold">
                {product.keepStockSince ? stock : "Not keeping stock"}
              </Typography>
              <Stack spacing={2} direction={"row"}>
                <TextField
                  label="Draw Date"
                  type="date"
                  value={drawDate}
                  onChange={(e) => setDrawDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
                <AutoSelectTextField
                  required
                  fullWidth
                  type="number"
                  label="Draw Amount"
                  autoFocus
                  value={drawAmount}
                  onChange={(e) => setDrawAmount(e.target.value)}
                />
                <TextField
                  fullWidth
                  value={drawDescription}
                  label="Description"
                  onChange={(e) => setDrawDescription(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleDraw}
                >
                  Personal Draw
                </Button>
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <TextField
                  label="Adjustment Date"
                  type="date"
                  value={adjustDate}
                  onChange={(e) => setAdjustDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
                <AutoSelectTextField
                  required
                  fullWidth
                  type="number"
                  label="Adjust Amount"
                  autoFocus
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                />
                <TextField
                  fullWidth
                  value={adjustDescription}
                  label="Description"
                  onChange={(e) => setAdjustDescription(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  onClick={handleAdjust}
                >
                  Adjust Stock
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        {productHistory && (
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, height: "100%" }}>
              <Stack spacing={2}>
                <Typography variant="h4" fontWeight="bold">
                  Product History
                </Typography>
                <SmartTable
                  rows={productHistoryOrganized.map((his) => ({
                    id: his.id,
                    date: his.date,
                    parentId: his.parentId,
                    type: his.type,
                    flow: his.flow,
                    amount: his.amount,
                    description: his.description,
                  }))}
                  columns={columns}
                />
              </Stack>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12}>
          <ProductAnalysis productId={id} />
        </Grid>
      </Grid>
      <DeleteAlert
        message="Are you sure you want to remove this draw?"
        toDeleteId={toDeleteDrawId}
        handleDelete={handleDeleteDraw}
        setToDeleteId={setToDeleteDrawId}
        objectName="Draw"
      />

      <DeleteAlert
        message="Are you sure you want to remove this adjustment?"
        toDeleteId={toDeleteAdjustmentId}
        handleDelete={handleDeleteAdjustment}
        setToDeleteId={setToDeleteAdjustmentId}
        objectName="Adjust"
      />

      <CustomDialog
        action={null}
        open={isStockMatchDialogOpen}
        onClose={() => setIsStockMatchDialogOpen(false)}
        title="Stock Matches"
        description="Stock matches for the selected product"
      >
        <TableContainer sx={{ marginTop: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockMatches.map((match) => {
                return (
                  <TableRow key={match.id}>
                    <TableCell>
                      {moment(match.date).format("DD-MM-YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell>{match.qty}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomDialog>
    </>
  ) : (
    <h1>Loading...</h1>
  );
}
