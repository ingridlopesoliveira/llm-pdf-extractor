import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from 'src/services/files.service'

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.processFile(file.path)
  }
}
