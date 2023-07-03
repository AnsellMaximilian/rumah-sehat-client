import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../http-common";
import SmartTable from "../../components/SmartTable";
import NumericFormatRp from "../../components/NumericFormatRp";
import { toast } from "react-toastify";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import moment from "moment";
import DeleteAlert from "../../components/DeleteAlert";
import PayIcon from "@mui/icons-material/Paid";

const ExpenditureIndex = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [toDeleteId, setToDeleteId] = useState(null);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/expenditures/${id}`);
        setExpenditures((expenditures) =>
          expenditures.filter((purchase) => purchase.id !== id)
        );
        toast.success("Expenditure deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setExpenditures((await http.get("/expenditures")).data.data);
    })();
  }, []);

  const handlePay = async (id) => {
    try {
      const expenditure = (await http.patch(`/expenditures/${id}/pay`)).data
        .data;
      toast.success(`Updated expenditure #${expenditure.id}`, {
        autoClose: 500,
      });
      setExpenditures((prev) =>
        prev.map((exp) => {
          if (exp.id === id) return { ...exp, paid: expenditure.paid };
          return exp;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 150 },
    {
      field: "subtotalAmount",
      headerName: "Subtotal",
      width: 100,
      renderCell: (params) => (
        <NumericFormatRp value={params.row.subtotalAmount} />
      ),
    },
    {
      field: "deliveryCost",
      headerName: "Delivery",
      width: 100,
      renderCell: (params) => (
        <NumericFormatRp value={params.row.deliveryCost} />
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total",
      width: 100,
      renderCell: (params) => (
        <NumericFormatRp value={params.row.totalAmount} />
      ),
    },

    {
      field: "paid",
      headerName: "Paid",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color={params.row.paid ? "success" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            handlePay(params.row.id);
          }}
        >
          <PayIcon />
        </IconButton>
      ),
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
              to={`/expenditures/edit/${params.row.id}`}
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
            <IconButton
              color="primary"
              component={Link}
              to={`/expenditures/${params.row.id}`}
            >
              <ShowIcon />
            </IconButton>
          </>
        );
      },
      width: 200,
    },
  ];
  return (
    <Box>
      <Box paddingBottom={2}>
        <Button
          variant="contained"
          component={Link}
          to={"/expenditures/create"}
        >
          New Expenditure
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={expenditures.map((expenditure) => ({
            id: expenditure.id,
            date: moment(expenditure.date).format("DD-MM-YYYY"),
            totalAmount: expenditure.totalAmount,
            subtotalAmount: expenditure.subtotalAmount,
            deliveryCost: expenditure.deliveryCost,
            paid: expenditure.paid,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message="Deleting this expenditure will also delete any related details."
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Purchase"
      />
    </Box>
  );
};

export default ExpenditureIndex;
