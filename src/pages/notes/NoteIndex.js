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
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import DeleteAlert from "../../components/DeleteAlert";
import { FORM_MODE } from "../../const";
import CustomDialog from "../../components/Dialog";

export default function NoteIndex() {
  const [notes, setNotes] = useState([]);

  // filter
  const [titleFilter, setTitleFilter] = useState("");
  const [contentFilter, setContentFilter] = useState("");

  // create edit
  const [formMode, setFormMode] = useState(FORM_MODE.NONE);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteToEditId, setNoteToEditId] = useState(null);

  useEffect(() => {
    (async () => {
      setNotes((await http.get("/notes")).data.data);
    })();
  }, []);

  const [toDeleteId, setToDeleteId] = useState(null);
  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/notes/${id}`);
        setNotes((prev) => prev.filter((reg) => reg.id !== id));
        toast.success("Note deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const handleClearFilter = async () => {
    setTitleFilter("");
    setContentFilter("");

    setNotes((await http.get("/notes")).data.data);
  };

  const handleFilter = async () => {
    const queryParams = formQueryParams({
      title: titleFilter,
      content: contentFilter,
    });
    setNotes((await http.get(`/notes?${queryParams}`)).data.data);
  };

  const reset = () => {
    setTitle("");
    setContent("");
    setNoteToEditId(null);
    setFormMode(FORM_MODE.NONE);
  };

  const handleSubmitNote = async () => {
    try {
      if (!title || title.length < 3)
        throw new Error("Title must at least be 3 characters long.");
      if (!content) throw new Error("Content cannot be empty.");

      const body = {
        title,
        content,
      };

      if (noteToEditId) {
        await http.patch(`/notes/${noteToEditId}`, body);
        toast.success("Updated note");
      } else {
        await http.post("/notes", body);
        toast.success("Created note");
      }

      reset();
      setNotes((await http.get("/notes")).data.data);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (noteToEditId) {
      const noteToEdit = notes.find((n) => n.id === noteToEditId);

      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);

      setFormMode(FORM_MODE.EDIT);
    } else {
      reset();
    }
  }, [noteToEditId, notes]);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "content", headerName: "Content", width: 350 },

    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="warning"
              onClick={() => {
                setNoteToEditId(params.row.id);
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
          New Note
        </Button>
      </Box>
      <Box marginTop={2}>
        <Typography variant="h6" fontWeight={500}>
          FILTERS
        </Typography>
        <Grid spacing={2} container marginTop={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Content"
              onChange={(e) => setContentFilter(e.target.value)}
              multiline
              value={contentFilter}
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
          rows={notes.map((note) => ({
            id: note.id,
            title: note.title,
            content: note.content,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={`Are you sure you want to delete note #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Note"
      />

      <CustomDialog
        open={formMode !== FORM_MODE.NONE}
        onClose={() => {
          reset();
        }}
        title={noteToEditId ? `Update Note #${noteToEditId}` : "Create a Note"}
        maxWidth="xl"
        actionLabel={noteToEditId ? "Update" : "Create"}
        action={() => {
          handleSubmitNote();
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
              label="Content"
              onChange={(e) => setContent(e.target.value)}
              multiline
              value={content}
              rows={5}
            />
          </Grid>
        </Grid>
      </CustomDialog>
    </Box>
  );
}
