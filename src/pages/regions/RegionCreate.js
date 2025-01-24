import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../http-common";

export default function RegionCreate({ edit }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      if (edit) {
        const region = (await http.get(`/regions/${id}`)).data.data;
        setName(region.name);
      }
    })();
  }, [edit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name,
      };

      if (!edit) {
        await http.post("/regions", body);
        toast.success("Created region.");
        navigate("/regions");
      } else {
        await http.patch(`/regions/${id}`, body);
        toast.success("Updated region.");
        navigate("/regions");
      }

      navigate("/regions");
    } catch ({ response: { data: error } }) {
      toast.error(error);
    }
  };
  return (
    <Box>
      <Typography component="h1" variant="h5">
        {edit ? `Editing Region #${id}` : "Add New Region"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1 }}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Box display="flex" gap={2}>
          <TextField
            required
            fullWidth
            label="Region Name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ flex: 4 }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {edit ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
}
