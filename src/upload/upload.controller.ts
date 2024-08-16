import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import * as path from "node:path";

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file : Express.Multer.File) {
    console.log(file);
    //return await this.uploadService.uploadFile(file);
  }

  @Post('valid')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadValidFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({fileType: 'image/jpeg'})
      .addMaxSizeValidator({maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES})
      .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) file : Express.Multer.File, ) {
    console.log(file);
    //return await this.uploadService.uploadFile(file);
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
    public async uploadArrayFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    //return await this.uploadService.uploadFile(files);
  }

  //Upload Avatar
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      },
    }),
  }))
  public async uploadAvatar(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({fileType: 'image'})
      .addMaxSizeValidator({maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES})
      .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) file : Express.Multer.File) {
    console.log(file);
    const fileData = await this.uploadService.uploadFile(file);
    return `upload ${fileData.originalname} success`;
  }
}
