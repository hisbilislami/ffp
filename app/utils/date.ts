import dayjs from "dayjs";

export const convertDateStringToString = ({
  date,
  format = "DD/MM/YYYY",
}: {
  date: string;
  format?: string;
}) => {
  const includedT = date.includes("T");
  if (!includedT) {
    return date;
  }

  const result = dayjs(date).format(format);
  return result;
};
