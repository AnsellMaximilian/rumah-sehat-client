import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../http-common";

export default function ExpenseCreate({ edit }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      if (edit) {
        const expense = (await http.get(`/expenses/${id}`)).data.data;
        setName(expense.name);
        setAmount(expense.amount);
        setUnit(expense.unit);
        setDescription(expense.description);
      }
    })();
  }, [edit, id]);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: name,
        amount: amount,
        unit: unit ? unit : null,
        description,
      };

      if (!edit) {
        await http.post("/expenses", body);
        navigate("/expenses");
        toast.success("Created expense.");
      } else {
        await http.patch(`/expenses/${id}`, body);
        toast.success("Updated expense.");
        navigate(`/expenses`);
      }
    } catch ({ response: { data: error } }) {
      toast.error(error);
    }
  };
  return true ? (
    <Box>
      <Typography component="h1" variant="h5">
        Add New
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <Grid spacing={2} container>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              required
              type="number"
              fullWidth
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Unit"
              value={unit || ""}
              onChange={(e) => setUnit(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
              multiline
              value={description}
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
            >
              {edit ? "Update" : "Create"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : (
    <h1>
      Failed loading suppliers or categories. If you haven't please create at
      least one of each.
    </h1>
  );
}
