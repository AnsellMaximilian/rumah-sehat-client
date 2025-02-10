import { useEffect, useState } from "react";
import http from "../../http-common";
import { formQueryParams, toastError } from "../../helpers/common";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import SmartTable from "../../components/SmartTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import DeleteAlert from "../../components/DeleteAlert";
import { FORM_MODE } from "../../const";
import CustomDialog from "../../components/Dialog";

export default function TodoIndex() {
  const [searchParams] = useSearchParams();
  const isDoneQueryParam = searchParams.get("isDone");

  const [todos, setTodos] = useState([]);

  // filter
  const [titleFilter, setTitleFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [doneFilter, setDoneFilter] = useState("all");

  // create edit
  const [formMode, setFormMode] = useState(FORM_MODE.NONE);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todoToEditId, setTodoToEditId] = useState(null);

  useEffect(() => {
    (async () => {
      const isDoneParamValid =
        isDoneQueryParam === "true" || isDoneQueryParam === "false";
      const queryParams = formQueryParams({
        isDone: isDoneParamValid ? isDoneQueryParam : undefined,
      });

      if (isDoneParamValid) setDoneFilter(isDoneQueryParam);
      setTodos((await http.get(`/todos?${queryParams}`)).data.data);
    })();
  }, [isDoneQueryParam]);

  const [toDeleteId, setToDeleteId] = useState(null);
  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/todos/${id}`);
        setTodos((prev) => prev.filter((reg) => reg.id !== id));
        toast.success("Todo deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleClearFilter = async () => {
    setTitleFilter("");
    setDescriptionFilter("");
    setDoneFilter("all");

    setTodos((await http.get("/todos")).data.data);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      title: titleFilter,
      description: descriptionFilter,
      isDone: doneFilter === "all" ? undefined : doneFilter,
    });
    setTodos((await http.get(`/todos?${queryParams}`)).data.data);
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setTodoToEditId(null);
    setFormMode(FORM_MODE.NONE);
  };

  const handleSubmitTodo = async () => {
    try {
      if (!title || title.length < 3)
        throw new Error("Title must at least be 3 characters long.");

      const body = {
        title,
        description,
      };

      if (todoToEditId) {
        await http.patch(`/todos/${todoToEditId}`, body);
        toast.success("Updated note");
      } else {
        await http.post("/todos", body);
        toast.success("Created note");
      }

      reset();
      setTodos((await http.get("/todos")).data.data);
    } catch (error) {
      toastError(error);
    }
  };

  const toggleDone = async (id) => {
    try {
      const todo = (await http.patch(`/todos/${id}/toggle`)).data.data;
      toast.success(`Updated todo status #${todo.id}`, { autoClose: 500 });
      setTodos((prev) =>
        prev.map((existingTodo) => {
          if (existingTodo.id === id)
            return { ...existingTodo, isDone: todo.isDone };
          return existingTodo;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (todoToEditId) {
      const noteToEdit = todos.find((n) => n.id === todoToEditId);

      setTitle(noteToEdit.title);
      setDescription(noteToEdit.description);

      setFormMode(FORM_MODE.EDIT);
    } else {
      reset();
    }
  }, [todoToEditId, todos]);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 350 },
    {
      field: "isDone",
      headerName: "Done",
      width: 100,
      align: "center",
      renderCell: (params) => {
        return (
          <IconButton
            color={params.row.isDone ? "success" : "gray"}
            onClick={(e) => {
              e.stopPropagation();
              toggleDone(params.row.id);
            }}
          >
            {params.row.isDone ? <CheckCircleIcon /> : <CancelIcon />}
          </IconButton>
        );
      },
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
                setTodoToEditId(params.row.id);
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
          New Todo
        </Button>
      </Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              size="small"
              label="Title"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <FormControl margin="none" fullWidth>
              <InputLabel id="demo-simple-select-label">Done Status</InputLabel>
              <Select
                size="small"
                label="Done Status"
                value={doneFilter}
                fullWidth
                onChange={(e) => {
                  setDoneFilter(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Done</MenuItem>
                <MenuItem value="false">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Description"
              onChange={(e) => setDescriptionFilter(e.target.value)}
              multiline
              value={descriptionFilter}
              rows={3}
            />
          </Grid>
        </Grid>

        <Box display="flex" gap={2} marginTop={2}>
          <Button variant="outlined" fullWidth onClick={handleClearFilter}>
            Clear Filter
          </Button>
          <Button variant="contained" fullWidth onClick={handleFilter}>
            Filter
          </Button>
        </Box>
      </Box>
      <Card sx={{ marginTop: 4 }}>
        <SmartTable
          rows={todos.map((todo) => ({
            id: todo.id,
            title: todo.title,
            description: todo.description,
            isDone: todo.isDone,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={`Are you sure you want to delete note #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Todo"
      />

      <CustomDialog
        open={formMode !== FORM_MODE.NONE}
        onClose={() => {
          reset();
        }}
        title={todoToEditId ? `Update Todo #${todoToEditId}` : "Create a Todo"}
        maxWidth="xl"
        actionLabel={todoToEditId ? "Update" : "Create"}
        action={() => {
          handleSubmitTodo();
        }}
      >
        <Grid container gap={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
              multiline
              value={description}
              rows={5}
            />
          </Grid>
        </Grid>
      </CustomDialog>
    </Box>
  );
}
