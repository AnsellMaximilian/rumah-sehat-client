import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../../http-common";
import { useEffect, useState } from "react";
import moment from "moment";

export default function DrIdItemCreate({ edit }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [priceRP, setPriceRP] = useState(0);
  const [points, setPoints] = useState(0);

  // STOCK
  const [keepStockSince, setKeepStockSince] = useState("");
  const [keepStock, setKeepStock] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      if (edit) {
        const item = (await http.get(`/dr/id/items/${id}`)).data.data;
        setName(item.name);
        setPriceRP(item.priceRP);
        setPoints(item.points);
        if (item.keepStockSince) {
          setKeepStock(true);
          setKeepStockSince(moment(item.keepStockSince).format("yyyy-MM-DD"));
        }
      }
    })();
  }, [edit, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: name,
        priceRP: priceRP,
        points: points,
        keepStockSince: keepStock ? keepStockSince : null,
      };

      if (!edit) {
        await http.post("/dr/id/items", body);
        toast.success("Created item.");
      } else {
        await http.patch(`/dr/id/items/${id}`, body);
        toast.success("Updated item.");
      }
      navigate("/dr/id/items");
    } catch ({ response: { data: error } }) {
      toast.error(error);
    }
  };
  return (
    <Box>
      <Typography component="h1" variant="h5">
        Add New
      </Typography>
      <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Price (Rp)"
              value={priceRP}
              onChange={(e) => setPriceRP(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Keep Stock Since"
              type="date"
              value={keepStockSince}
              onChange={(e) => setKeepStockSince(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <ToggleButtonGroup
              value={keepStock}
              exclusive
              fullWidth
              onChange={(e, value) => {
                setKeepStock(!!value);
              }}
              aria-label="text alignment"
            >
              <ToggleButton value={true} aria-label="left aligned">
                Keep Stock
              </ToggleButton>
              <ToggleButton value={false} aria-label="centered">
                Don't Keep Stock
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
