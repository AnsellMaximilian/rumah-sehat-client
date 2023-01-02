import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";

const DrDiscountModelIndex = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    (async () => {
      setModels((await http.get("/dr/discount-models")).data.data);
    })();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "description", headerName: "Description", width: 130 },
    { field: "base", headerName: "Base", width: 130 },
    {
      field: "subtractor",
      headerName: "Subtractor",
      width: 200,
    },
    {
      field: "percentage",
      headerName: "Percentage",
      width: 200,
    },
  ];
  return (
    <Box>
      <Box paddingBottom={2}>
        <Button
          variant="contained"
          component={Link}
          to={"/dr/discount-models/create"}
        >
          New Model
        </Button>
      </Box>
      <Card>
        <SmartTable
          rows={models.map((model) => ({
            id: model.id,
            description: model.description,
            base: model.base,
            percentage: model.percentage,
            subtractor: model.subtractor,
          }))}
          columns={columns}
        />
      </Card>
    </Box>
  );
};

export default DrDiscountModelIndex;
