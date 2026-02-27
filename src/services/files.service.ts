import { Injectable } from '@nestjs/common'
import { ClientDTO } from 'src/dtos/client/client.dto'
import { InvoiceExtractedDTO } from 'src/dtos/invoice/invoice-extracted.dto'
import { InvoiceListDTO } from 'src/dtos/invoice/invoice-list.dto'
import { ClientRepository } from 'src/repositories/client.repository'
import { InvoicesRepository } from 'src/repositories/invoice.repository'
import { InvoicesQueryDto } from 'src/schema/invoice-query.schema'
import { LlmServiceMock } from 'src/services/llm-mock.service'
import { Invoice } from 'src/types/invoice.type'

@Injectable()
export class FilesService {
  constructor(
    private llmService: LlmServiceMock,
    private invoicesRepository: InvoicesRepository,
    private clientsRepository: ClientRepository,
  ) {}

  async processFile(filePath: string): Promise<any> {
    const extracted = await this.llmService.extractInvoice(filePath)

    const clientDTO = new ClientDTO(extracted.nomeCliente, extracted.numeroCliente)
    const existingClient = await this.clientsRepository.findOneByClienteNumber(clientDTO.clientNumber)
    if (!existingClient) await this.clientsRepository.create(clientDTO)

    const clientId = existingClient ? existingClient.clientNumber : clientDTO.clientNumber
    const invoiceDTO = this.processExtractedDataValues(extracted, clientId)
    const invoiceEntity = await this.invoicesRepository.create(invoiceDTO)
    return invoiceEntity
  }

  private processExtractedDataValues(extracted: Invoice, clientId: number): InvoiceExtractedDTO {
    const energyConsume = extracted.energia.kwh + extracted.energiaSceeeSIcms.kwh
    const energyCompensated = extracted.energiaCompensadaGdI.kwh
    const totalValueWithoutGd = extracted.energia.valor + extracted.energiaSceeeSIcms.valor + extracted.ilumPublica
    return new InvoiceExtractedDTO(extracted, energyConsume, energyCompensated, totalValueWithoutGd, clientId)
  }

  async getFilesData(query: InvoicesQueryDto): Promise<InvoiceListDTO[]> {
    const response = await this.invoicesRepository.findAll(query)
    return response.map((invoice) => new InvoiceListDTO(invoice))
  }
}
