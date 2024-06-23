export const formatDate = (date?: string | null | number) => {
  if (!date) return undefined;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const time = new Date(date);

  const day = time.getDate();
  const monthIndex = time.getMonth();
  const year = time.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
};
