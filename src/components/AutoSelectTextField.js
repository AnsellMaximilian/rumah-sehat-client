import { TextField } from "@mui/material";

const AutoSelectTextField = (props) => {
  return <TextField {...props} onFocus={(e) => e.target.select()} />;
};

export default AutoSelectTextField;
