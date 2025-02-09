import { AxiosError } from "axios";
import html2canvas from "html2canvas";
import moment from "moment";
import { toast } from "react-toastify";

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

export const getMonthsInRange = (start, end) => {
  const startDate = moment(start);
  const endDate = moment(end);
  let current = startDate.clone();
  const months = [];

  while (current.isBefore(endDate) || current.isSame(endDate, "month")) {
    months.push(current.format("YYYY-MM"));
    current.add(1, "months");
  }
  return months;
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

export const toastError = (error) => {
  let errorMsg = "Unknown error";

  if (error instanceof AxiosError) {
    const {
      response: { data: axiosErrMsg },
    } = error;

    errorMsg = axiosErrMsg;
  } else {
    const errorValue = error?.response?.data?.error;
    errorMsg = errorValue ? errorValue : error.message;
  }

  toast.error(errorMsg);
};

export function getDateRange(startDate, endDate) {
  let dates = [];
  let currentDate = moment(startDate);
  let finalDate = moment(endDate);

  while (currentDate.isSameOrBefore(finalDate)) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate.add(1, "day");
  }

  return dates;
}
