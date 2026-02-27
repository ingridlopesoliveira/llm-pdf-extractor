import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ResponseDTO } from 'src/dtos/response-dto'
import { PdfUploadInterceptor } from 'src/interceptors/pdf-upload.interceptor'
import { type InvoicesQueryDto, invoicesQuerySchema } from 'src/schema/invoice-query.schema'
import { ZodValidationPipe } from 'src/schema/validation/zod-invoice.validation'
import { FilesService } from 'src/services/files.service'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(PdfUploadInterceptor('files'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<ResponseDTO> {
    try {
      const response = await this.filesService.processFile(file.path)
      return new ResponseDTO(HttpStatus.CREATED, 'Arquivo processado com sucesso', response)
    } catch (err) {
      throw new BadRequestException('Erro ao processar o arquivo', err.message)
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getFilesData(@Query(new ZodValidationPipe(invoicesQuerySchema)) query: InvoicesQueryDto): Promise<ResponseDTO> {
    try {
      const response = await this.filesService.getFilesData(query)
      return new ResponseDTO(HttpStatus.OK, 'Dados dos arquivos obtidos com sucesso', response)
    } catch (err) {
      throw new BadRequestException('Erro ao obter os dados dos arquivos', err.message)
    }
  }
}
