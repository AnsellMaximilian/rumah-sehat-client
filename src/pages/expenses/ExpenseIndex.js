import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import IconButton from "@mui/material/IconButton";
import http from "../../http-common";
import SmartTable from "../../components/SmartTable";
import { toast } from "react-toastify";
import NumericFormatRp from "../../components/NumericFormatRp";
import DeleteAlert from "../../components/DeleteAlert";

const ExpenseIndex = () => {
  const [expenses, setExpenses] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

  const [deleteMsg, setDeleteMsg] = useState("Loading...");

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/expenses/${id}`);
        setExpenses((expenses) =>
          expenses.filter((product) => product.id !== id)
        );
        toast.success("Expense deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      try {
        if (toDeleteId) {
          setDeleteMsg(
            `Are you sure you want to delete expense #${toDeleteId}?`
          );
        } else {
          setDeleteMsg("Loading...");
        }
      } catch (error) {
        const errorValue = error?.response?.data?.error;
        const errorMsg = errorValue ? errorValue : error.message;
        toast.error(errorMsg);
      }
    })();
  }, [toDeleteId]);

  useEffect(() => {
    (async () => {
      setExpenses((await http.get("/expenses")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "unit", headerName: "Unit", width: 130 },
    {
      field: "amount",
      headerName: "Amount",
      width: 130,

      renderCell: (params) => <NumericFormatRp value={params.row.amount} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="warning"
              component={Link}
              to={`/expenses/edit/${params.row.id}`}
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
        <Button variant="contained" component={Link} to={"/expenses/create"}>
          New Expense
        </Button>
      </Box>
      <Card sx={{ marginTop: 4 }}>
        <SmartTable
          rows={expenses.map((expense) => ({
            id: expense.id,
            name: expense.name,
            amount: expense.amount,
            unit: expense.unit,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={deleteMsg}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Expense"
      />
    </Box>
  );
};

export default ExpenseIndex;
