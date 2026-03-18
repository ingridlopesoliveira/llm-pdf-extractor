import { BadRequestException, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
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
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado')
    }
    try {
      const response = await this.filesService.processFile(file.path)
      return new ResponseDTO(HttpStatus.CREATED, 'Arquivo processado com sucesso', response)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      throw new InternalServerErrorException('Erro ao processar o arquivo', message)
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getFilesData(@Query(new ZodValidationPipe(invoicesQuerySchema)) query: InvoicesQueryDto): Promise<ResponseDTO> {
    try {
      const response = await this.filesService.getFilesData(query)
      return new ResponseDTO(HttpStatus.OK, 'Dados dos arquivos obtidos com sucesso', response)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      throw new InternalServerErrorException('Erro ao obter os dados dos arquivos', message)
    }
  }
}
