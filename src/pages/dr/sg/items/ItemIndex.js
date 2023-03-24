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
import NumericFormatSGD from "../../../../components/NumericFormatSGD";
import NumericFormatRp from "../../../../components/NumericFormatRp";

const DrSgItemIndex = () => {
  const [items, setItems] = useState([]);

  const handleDelete = (id) => {
    (async () => {
      try {
        await http.delete(`/dr/sg/items/${id}`);
        setItems((items) => items.filter((item) => item.id !== id));
        toast.success("Deleted item.");
      } catch ({ response: { data: error } }) {
        toast.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      setItems((await http.get("/dr/sg/items")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    {
      field: "priceSGD",
      headerName: "Price (SGD)",
      width: 130,

      renderCell: (params) => <NumericFormatSGD value={params.row.priceSGD} />,
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
      field: "points",
      headerName: "Points",
      width: 200,
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
              to={`/dr/sg/items/edit/${params.row.id}`}
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(params.row.id);
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
        <Button variant="contained" component={Link} to={"/dr/sg/items/create"}>
          New Item
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={items.map((item) => ({
            id: item.id,
            name: item.name,
            priceSGD: item.priceSGD,
            deliveryCost: item.deliveryCost,
            points: item.points,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default DrSgItemIndex;
