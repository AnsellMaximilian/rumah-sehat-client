import { NumericFormat } from "react-number-format";

export default function NumericFormatRM({ value }) {
  return (
    <NumericFormat
      value={value}
      thousandSeparator="."
      decimalSeparator=","
      prefix="RM "
      displayType="text"
    />
  );
}
