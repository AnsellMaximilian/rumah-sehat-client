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
      <Typography
        variant="subtitle2"
        textTransform="uppercase"
        // color="gray"
        fontSize={14}
      >
        {label}
      </Typography>
      <Typography lineHeight={0.7}>
        {renderValue ? renderValue() : value}
      </Typography>
    </Box>
  );
}
