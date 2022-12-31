import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";

const DrIdItemIndex = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      setItems((await http.get("/dr/id/items")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "priceRP", headerName: "Price (Rp)", width: 130 },
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
              to={`/dr/id/items/edit/${params.row.id}`}
            >
              <Edit />
            </IconButton>
            <IconButton color="error">
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
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default DrIdItemIndex;