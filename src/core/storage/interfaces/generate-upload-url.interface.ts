export interface GenerateUploadUrl {
  uploadUrl: string;
  fileKey: string;
  isPublic: boolean;
  cdnUrl: string | null;
}
