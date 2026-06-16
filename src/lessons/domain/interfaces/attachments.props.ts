import { FilePath } from '../../../common/value-objects/file-path.vo';
import { Title } from '../value-objects/title.vo';

export interface AttachmentProps {
  name: Title;
  path: FilePath;
  mimeType: string | null;
  lessonId: string;
  createdAt: Date;
  updatedAt: Date;
}
