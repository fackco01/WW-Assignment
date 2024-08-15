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
    //return file;
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
    //return file;
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  public async uploadArrayFile(@UploadedFiles() files :  Array<Express.Multer.File>) {
    console.log(files);
    //return file;
  }
}
