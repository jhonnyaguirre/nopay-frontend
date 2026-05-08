// utils/fileUtils.ts
export const getFileTypeFromUrl = (url: string): 'image' | 'pdf' | 'document' | 'unknown' => {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
    return 'image';
  }
  if (extension === 'pdf') {
    return 'pdf';
  }
  // Puedes añadir más extensiones de documentos
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension)) {
    return 'document';
  }
  return 'unknown';
};

export const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return '/icons/pdf-icon.svg'; // o usa un componente de lucide-react
    case 'document':
      return '/icons/doc-icon.svg';
    case 'image':
      return '/icons/image-icon.svg';
    default:
      return '/icons/file-icon.svg';
  }
};