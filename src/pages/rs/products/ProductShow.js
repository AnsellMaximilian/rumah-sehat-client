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
import { toast } from "react-toastify";
import AutoSelectTextField from "../../../components/AutoSelectTextField";
import SmartTable from "../../../components/SmartTable";
const columns = [
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
];

export default function ProductShow() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);

  const [drawAmount, setDrawAmount] = useState(0);
  const [drawDate, setDrawDate] = useState("");
  const [drawDescription, setDrawDescription] = useState("");

  const [productHistory, setProductHistory] = useState(null);

  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustDate, setAdjustDate] = useState("");
  const [adjustDescription, setAdjustDescription] = useState("");

  const handleDraw = async () => {
    try {
      if (drawAmount <= 0) throw new Error("Amount can't be 0.");
      if (!drawDate) throw new Error("Date can't be empty");
      const body = {
        amount: drawAmount,
        date: drawDate,
        description: drawDescription ? drawDescription : null,
      };
      const draw = (await http.post(`/rs/products/${id}/draw`, body)).data.data;
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

  const refreshMetaData = useCallback(() => {
    (async () => {
      setStock((await http.get(`/rs/products/${id}/stock`)).data.data);
      if (product.keepStockSince) {
        const his = (await http.get(`/rs/products/${id}/history`)).data.data;
        console.log(his);
        setProductHistory(his);
      }
    })();
  }, [product, id]);

  useEffect(() => {
    (async () => {
      const product = (await http.get(`/rs/products/${id}`)).data.data;
      setProduct(product);
      setStock((await http.get(`/rs/products/${id}/stock`)).data.data);
      if (product.keepStockSince) {
        const his = (await http.get(`/rs/products/${id}/history`)).data.data;
        console.log(his);
        setProductHistory(his);
      }
    })();
  }, [id]);

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
        <Grid item xs={6}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Box display="flex" flexDirection="column">
              <Typography variant="subtitle" fontWeight="bold" color="GrayText">
                #{product.id}
              </Typography>
              <Typography variant="h5" fontWeight="bold" lineHeight={0.7}>
                {product.name}
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={2} marginTop={2}>
              {/* <ValueDisplay value={product.phone} label="Phone" />
              <ValueDisplay value={product.Region.name} label="Region" />
              <ValueDisplay value={product.address} label="Address" /> */}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2, height: "100%" }}>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight="bold">
                Stock
              </Typography>
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
      </Grid>
    </>
  ) : (
    <h1>Loading...</h1>
  );
}
