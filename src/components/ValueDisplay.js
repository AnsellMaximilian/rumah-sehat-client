import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function ValueDisplay({
  value,
  label,
  containerProps,
  renderValue,
}) {
  return (
    <Box {...containerProps}>
      <Typography variant="subtitle2">{label}</Typography>
      <Typography>{renderValue ? renderValue() : value}</Typography>
    </Box>
  );
}
