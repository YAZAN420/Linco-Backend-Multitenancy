export interface GenerateUploadUrl {
  uploadUrl: string;
  fileKey: string;
  isPublic: boolean;
  fields: any;
  cdnUrl: string | null;
}
