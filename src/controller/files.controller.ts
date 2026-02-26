import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { ResponseDTO } from 'src/dtos/response-dto'
import { FilesService } from 'src/services/files.service'

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('files', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          const extension = extname(file.originalname)
          callback(null, `${uniqueSuffix}${extension}`)
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(new BadRequestException('Apenas arquivos PDF são permitidos'), false)
        }
        callback(null, true)
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    try {
      const response = await this.filesService.processFile(file.path)
      return new ResponseDTO(HttpStatus.CREATED, 'Arquivo processado com sucesso', response)
    } catch (err) {
      throw new BadRequestException('Erro ao processar o arquivo', err.message)
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('files')
  async getFilesData() {
    try {
      const response = await this.filesService.getFilesData()
      return new ResponseDTO(HttpStatus.OK, 'Dados dos arquivos obtidos com sucesso', response)
    } catch (err) {
      throw new BadRequestException('Erro ao obter os dados dos arquivos', err.message)
    }
  }
}
