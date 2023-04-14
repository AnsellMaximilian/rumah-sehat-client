import html2canvas from "html2canvas";
import moment from "moment";

export const getWeek = () => {
  const currentDate = moment();
  const weekStart = currentDate
    .clone()
    .startOf("week")
    .add(1, "day")
    .format("yyyy-MM-DD");
  const weekEnd = currentDate
    .clone()
    .endOf("week")
    .add(1, "day")
    .format("yyyy-MM-DD");

  return { weekStart, weekEnd };
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
