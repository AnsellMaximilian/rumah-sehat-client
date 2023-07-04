import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http-common";
import { toast } from "react-toastify";
import AutoSelectTextField from "../../../components/AutoSelectTextField";

export default function ProductShow() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);

  const [drawAmount, setDrawAmount] = useState(0);
  const [drawDate, setDrawDate] = useState("");
  const [drawDescription, setDrawDescription] = useState("");

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
      setStock((await http.get(`/rs/products/${id}/stock`)).data.data);
      toast.success(`Succesfully drawn ${draw.amount}`);
    } catch (error) {
      toast.error(error?.message || "Unknown error");
    }
  };

  useEffect(() => {
    (async () => {
      setProduct((await http.get(`/rs/products/${id}`)).data.data);
      setStock((await http.get(`/rs/products/${id}/stock`)).data.data);
    })();
  }, [id]);
  console.log({ stock });
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
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  ) : (
    <h1>Loading...</h1>
  );
}
