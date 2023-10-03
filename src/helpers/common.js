import html2canvas from "html2canvas";
import moment from "moment";

export const getWeek = () => {
  const currentDate = moment();
  const weekStart = currentDate.clone().startOf("isoWeek").format("yyyy-MM-DD");
  const weekEnd = currentDate.clone().endOf("isoWeek").format("yyyy-MM-DD");

  return { weekStart, weekEnd };
};

export const getLastWeek = () => {
  const currentDate = moment();
  const lastSunday = currentDate.clone().startOf("isoWeek").subtract(1, "day");
  const weekStart = lastSunday.startOf("isoWeek").format("yyyy-MM-DD");
  const weekEnd = lastSunday.endOf("isoWeek").format("yyyy-MM-DD");

  return { weekStart, weekEnd };
};

export const getMonth = () => {
  const currentDate = moment();
  const monthStart = currentDate.clone().startOf("month").format("yyyy-MM-DD");
  const monthEnd = currentDate.clone().endOf("month").format("yyyy-MM-DD");

  return { monthStart, monthEnd };
};

export const getLastMonth = () => {
  const currentDate = moment();
  const lastDay = currentDate.clone().startOf("month").subtract(1, "day");
  const monthStart = lastDay.startOf("month").format("yyyy-MM-DD");
  const monthEnd = lastDay.endOf("month").format("yyyy-MM-DD");

  return { monthStart, monthEnd };
};

export const getDaysInRange = (start, end) => {
  const startDate = moment(start);
  const endDate = moment(end);
  let current = startDate.clone();
  const dates = [];

  while (current.isSameOrBefore(endDate)) {
    dates.push(current.format("YYYY-MM-DD"));
    current.add(1, "days");
  }
  return dates;
};

export const formQueryParams = (obj) => {
  return Object.keys(obj)
    .filter((key) => obj[key])
    .map((key) => {
      return `${key}=${obj[key]}`;
    })
    .join("&");
};

export const formFileName = (obj) => {
  return Object.keys(obj)
    .filter((key) => obj[key])
    .map((key) => {
      return `${key}-${obj[key]}`;
    })
    .join("_");
};

export const copyElementToClipboard = async (el) => {
  try {
    const canvas = await html2canvas(el);
    canvas.toBlob((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const copyTextToClipboard = (text) => {
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};

export const rupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    currencySign: "accounting",
    minimumFractionDigits: 0,
  }).format(num);

export const sgd = (num) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    currencySign: "accounting",
    minimumFractionDigits: 0,
  }).format(num);

export const rm = (num) =>
  new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    currencySign: "accounting",
    minimumFractionDigits: 0,
  }).format(num);
