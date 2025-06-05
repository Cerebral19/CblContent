export function generatePublicLink(clientName: string, month: number, year: number): string {
  const formattedClientName = clientName.toLowerCase().replace(/\s+/g, '-');
  return `${formattedClientName}/${month}/${year}`;
}

export function getMonthName(month: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1];
}