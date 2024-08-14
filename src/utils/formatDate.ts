export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês é 0-indexado
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
