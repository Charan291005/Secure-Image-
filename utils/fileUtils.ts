
export type FileType = 'image' | 'video' | 'audio' | 'pdf' | 'archive' | 'code' | 'text' | 'document' | 'unknown';

export function getFileType(fileName: string): FileType {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return 'unknown';

  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(extension)) return 'image';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) return 'video';
  if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) return 'audio';
  if (['pdf'].includes(extension)) return 'pdf';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive';
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'c', 'cpp'].includes(extension)) return 'code';
  if (['txt', 'md', 'rtf'].includes(extension)) return 'text';
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) return 'document';

  return 'unknown';
}
