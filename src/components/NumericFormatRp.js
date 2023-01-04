import { NumericFormat } from "react-number-format";

export default function NumericFormatRp({ value }) {
  return (
    <NumericFormat
      value={value}
      thousandSeparator="."
      decimalSeparator=","
      prefix="Rp"
      displayType="text"
    />
  );
}
