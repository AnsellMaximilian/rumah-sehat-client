import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NumericFormatRp from "../../../components/NumericFormatRp";
import ValueDisplay from "../../../components/ValueDisplay";
export default function InvoiceDisplay({ invoice }) {
  return (
    <Box>
      <Box display="flex" flexDirection="column">
        <Typography variant="h6" fontWeight="bold">
          INVOICE #{invoice.id}
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        marginTop={2}
      >
        <ValueDisplay value={invoice.customerFullName} label="Invoiced To" />
        <ValueDisplay value={invoice.date} label="Date" />
        <ValueDisplay
          renderValue={() => <NumericFormatRp value={invoice.totalPrice} />}
          label="Total"
        />
      </Box>
    </Box>
  );
}
