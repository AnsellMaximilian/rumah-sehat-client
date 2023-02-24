import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import http from "../../../http-common";

export default function Test() {
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    (async () => {
      setProducts((await http.get("/rs/products")).data.data);
      //   setValue(products[0]);
    })();
  }, [products]);
  return products.length > 0 ? (
    <div>
      <div>{`value: ${value !== null ? `'${value.name}'` : "null"}`}</div>
      <div>{`inputValue: '${inputValue}'`}</div>
      <br />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          console.log(newValue);

          setValue(newValue);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        // inputValue={inputValue}
        // onInputChange={(event, newInputValue) => {
        //   setInputValue(newInputValue);
        // }}
        options={products}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Product" />}
      />
    </div>
  ) : (
    <h1>Wait</h1>
  );
}
