import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { extname } from 'path';

export const DESIGN_MAX_FILE_SIZE = 25 * 1024 * 1024;

const TYPES = {
  '.png': {
    mime: 'image/png',
    magic: (b: Buffer) =>
      b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  },
  '.jpg': {
    mime: 'image/jpeg',
    magic: (b: Buffer) =>
      b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  '.jpeg': {
    mime: 'image/jpeg',
    magic: (b: Buffer) =>
      b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  '.psd': {
    mime: 'image/vnd.adobe.photoshop',
    magic: (b: Buffer) => b.subarray(0, 4).toString('ascii') === '8BPS',
  },
} as const;

export interface ValidatedDesignFile {
  fileName: string;
  extension: string;
  mimeType: string;
}
export interface DesignUploadFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class DesignFileValidator {
  validate(file?: DesignUploadFile): ValidatedDesignFile {
    if (!file?.buffer?.length)
      throw new BadRequestException('errors.DESIGN_FILE_REQUIRED');
    if (file.size > DESIGN_MAX_FILE_SIZE)
      throw new PayloadTooLargeException('errors.DESIGN_FILE_TOO_LARGE');
    const extension = extname(
      file.originalname,
    ).toLowerCase() as keyof typeof TYPES;
    const type = TYPES[extension];
    if (
      !type ||
      file.mimetype.toLowerCase() !== type.mime ||
      !type.magic(file.buffer)
    ) {
      throw new BadRequestException('errors.DESIGN_FILE_UNSUPPORTED');
    }
    const base = file.originalname
      .slice(0, -extension.length)
      .normalize('NFKC')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^[-.]+|[-.]+$/g, '')
      .slice(0, 100);
    return {
      fileName: `${base || 'design'}${extension === '.jpeg' ? '.jpg' : extension}`,
      extension: extension === '.jpeg' ? 'jpg' : extension.slice(1),
      mimeType: type.mime,
    };
  }
}
