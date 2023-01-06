import { NumericFormat } from "react-number-format";

export default function NumericFormatSGD({ value }) {
  return (
    <NumericFormat
      value={value}
      thousandSeparator="."
      decimalSeparator=","
      prefix="SGD "
      displayType="text"
    />
  );
}
