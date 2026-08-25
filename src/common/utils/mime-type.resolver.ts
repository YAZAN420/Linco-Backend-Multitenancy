export class MimeTypeResolver {
  private static readonly MIME_MAP: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',

    pdf: 'application/pdf',
    txt: 'text/plain',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',

    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
  };

  static getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return this.MIME_MAP[ext] || 'application/octet-stream';
  }
}
