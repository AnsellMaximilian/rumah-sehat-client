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
