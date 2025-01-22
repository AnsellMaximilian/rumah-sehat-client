import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../../../http-common";
import SmartTable from "../../../../components/SmartTable";
import { toast } from "react-toastify";
import NumericFormatRp from "../../../../components/NumericFormatRp";
import DeleteAlert from "../../../../components/DeleteAlert";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const DrIdItemIndex = () => {
  const [items, setItems] = useState([]);

  const [toDeleteId, setToDeleteId] = useState(null);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/dr/id/items/${id}`);
        setItems((items) => items.filter((item) => item.id !== id));
        toast.success("Item deleted.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const cycleActiveStatus = async (id) => {
    try {
      const item = (await http.patch(`/dr/id/items/${id}/cycle-active-status`))
        .data.data;
      toast.success(`Updated item #${item.id}`, { autoClose: 500 });
      setItems((prev) =>
        prev.map((cus) => {
          if (cus.id === id) return { ...cus, isActive: item.isActive };
          return cus;
        })
      );
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      setItems((await http.get("/dr/id/items?activeStatus=all")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "priceRP",
      headerName: "Price (Rp)",
      width: 130,

      renderCell: (params) => <NumericFormatRp value={params.row.priceRP} />,
    },
    {
      field: "points",
      headerName: "Points",
      width: 200,
    },

    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      align: "center",
      renderCell: (params) => {
        return (
          <IconButton
            color={params.row.isActive ? "success" : "error"}
            onClick={(e) => {
              e.stopPropagation();
              cycleActiveStatus(params.row.id);
            }}
          >
            {params.row.isActive ? <CheckCircleIcon /> : <CancelIcon />}
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
              component={Link}
              to={`/dr/id/items/edit/${params.row.id}`}
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
              to={`/dr/id/items/${params.row.id}`}
            >
              <ShowIcon />
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
        <Button variant="contained" component={Link} to={"/dr/id/items/create"}>
          New Item
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={items.map((item) => ({
            id: item.id,
            name: item.name,
            priceRP: item.priceRP,
            points: item.points,
            isActive: item.isActive,
          }))}
          columns={columns}
        />
      </Card>
      <DeleteAlert
        message={`Are you sure you want to delete ID item #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Item"
      />
    </Box>
  );
};

export default DrIdItemIndex;
