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
