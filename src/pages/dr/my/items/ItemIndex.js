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
import NumericFormatRM from "../../../../components/NumericFormatRM";
import NumericFormatRp from "../../../../components/NumericFormatRp";
import DeleteAlert from "../../../../components/DeleteAlert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const DrMyItemIndex = () => {
  const [items, setItems] = useState([]);

  const [toDeleteId, setToDeleteId] = useState(null);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/dr/my/items/${id}`);
        setItems((items) => items.filter((item) => item.id !== id));
        toast.success("Deleted item.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  const cycleActiveStatus = async (id) => {
    try {
      const item = (await http.patch(`/dr/my/items/${id}/cycle-active-status`))
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
      setItems((await http.get("/dr/my/items?activeStatus=all")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "priceRM",
      headerName: "Price (RM)",
      width: 130,

      renderCell: (params) => <NumericFormatRM value={params.row.priceRM} />,
    },

    {
      field: "points",
      headerName: "Points",
      width: 100,
    },
    {
      field: "deliveryCost",
      headerName: "Delivery Cost (Rp)",
      width: 130,

      renderCell: (params) => (
        <NumericFormatRp value={params.row.deliveryCost} />
      ),
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
              to={`/dr/my/items/edit/${params.row.id}`}
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
        <Button variant="contained" component={Link} to={"/dr/my/items/create"}>
          New Item
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={items.map((item) => ({
            id: item.id,
            name: item.name,
            priceRM: item.priceRM,
            deliveryCost: item.deliveryCost,
            points: item.points,
            isActive: item.isActive,
          }))}
          columns={columns}
        />
      </Card>

      <DeleteAlert
        message={`Are you sure you want to delete MY item #${toDeleteId}?`}
        toDeleteId={toDeleteId}
        handleDelete={handleDelete}
        setToDeleteId={setToDeleteId}
        objectName="Item"
      />
    </Box>
  );
};

export default DrMyItemIndex;
