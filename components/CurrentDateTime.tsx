const GetCurrentDateTime = () => {
  const now = new Date();

  // Time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const time = `${formattedHours}:${formattedMinutes} ${amOrPm}`;

  // Date
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const date = `${year}-${month}-${day}`;

  return { time, date };
};

export default GetCurrentDateTime