/**
 * Converte uma URL do Google Drive para um formato compatível com o componente Image
 */
export function convertGoogleDriveUrl(url: string): string {
  // Verifica se é uma URL do Google Drive
  if (!url || !url.includes('drive.google.com')) {
    return url;
  }
  
  // Caso 1: URL no formato /file/d/ID/view
  if (url.includes('/file/d/')) {
    // Extrai o ID do arquivo
    const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  
  // Caso 2: URL já está no formato correto
  if (url.includes('uc?export=view&id=')) {
    return url;
  }
  
  // Caso 3: URL no formato /open?id=
  if (url.includes('open?id=')) {
    const fileIdMatch = url.match(/open\?id=([^&]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  
  // Se não conseguiu converter, retorna a URL original
  return url;
}