import { Injectable } from '@nestjs/common'
import { InvoiceDTO } from 'src/dtos/invoice-dto'
import { InvoicesRepository } from 'src/repositories/invoice.repository'
import { LlmServiceMock } from 'src/services/llm-mock.service'
import { Invoice } from 'src/types/invoice.type'

@Injectable()
export class FilesService {
  constructor(
    private llmService: LlmServiceMock,
    private invoicesRepository: InvoicesRepository,
  ) {}

  async processFile(filePath: string): Promise<any> {
    const extracted = await this.llmService.extractInvoice(filePath)
    console.log('Extracted data:', extracted)
    const invoiceDTO = this.processExtractedDataValues(extracted)
    const invoice = await this.invoicesRepository.create(invoiceDTO)
    return invoice
  }

  private processExtractedDataValues(extracted: Invoice): InvoiceDTO {
    const energyConsume = extracted.energia.kwh + extracted.energiaSceeeSIcms.kwh
    const energyCompensated = extracted.energiaCompensadaGdI.kwh
    const totalValueWithoutGd = extracted.energia.valor + extracted.energiaSceeeSIcms.valor + extracted.ilumPublica
    return new InvoiceDTO(extracted, energyConsume, energyCompensated, totalValueWithoutGd)
  }

  async getFilesData() {
    return await this.invoicesRepository.findAll()
  }
}
