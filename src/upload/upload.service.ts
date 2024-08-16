import { BadRequestException, Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File) {
    if (!file || !file.path) {
      throw new BadRequestException('No file uploaded or file path is missing');
    }
    console.log(file);
    const uploadPath = './uploads';

    if (!fs.existsSync(uploadPath)){
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const newFilePath = path.join(uploadPath, file.filename);
    fs.renameSync(file.path, newFilePath);

    return {
      originalname: file.originalname,
      filename: file.filename,
      filesize: file.size,
      mimeType: file.mimetype,
    }
  };
}

