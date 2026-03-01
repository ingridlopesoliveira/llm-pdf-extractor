import { Injectable, Logger } from '@nestjs/common'
import { ClientDTO } from 'src/dtos/client/client.dto'
import { InvoiceExtractedDTO } from 'src/dtos/invoice/invoice-extracted.dto'
import { InvoiceListDTO } from 'src/dtos/invoice/invoice-list.dto'
import { ClientRepository } from 'src/repositories/client.repository'
import { InvoicesRepository } from 'src/repositories/invoice.repository'
import { InvoicesQueryDto } from 'src/schema/invoice-query.schema'
import { InvoiceSchema } from 'src/schema/validation/invoice-parse.validation'
import { LLMService } from 'src/services/llm.service'
import { Invoice } from 'src/types/invoice.type'

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name)
  constructor(
    private llmService: LLMService,
    private invoicesRepository: InvoicesRepository,
    private clientsRepository: ClientRepository,
  ) {}

  async processFile(filePath: string): Promise<any> {
    this.logger.log('Recieved file and sending to llm service')
    const extracted = await this.llmService.extractInvoice(filePath)

    const result = InvoiceSchema.safeParse(extracted)
    if (!result.success) throw new Error('LLM retornou um JSON inválido')
    // TODO:
    // criar callback de retentativa para extração de informações. Criar fila de gerenciamento usando Redis (ou outro) para processamento posterior
    const invoice = result.data

    const clientDTO = new ClientDTO(invoice.nomeCliente, invoice.numeroCliente)
    const existingClient = await this.clientsRepository.findOneByClienteNumber(clientDTO.clientNumber)
    if (!existingClient) {
      this.logger.log('Client not found, creating new one')
      await this.clientsRepository.create(clientDTO)
    }

    const clientId = existingClient ? existingClient.clientNumber : clientDTO.clientNumber
    const invoiceDTO = this.processExtractedDataValues(invoice, clientId)
    const invoiceEntity = await this.invoicesRepository.create(invoiceDTO)
    this.logger.log('Invoice created')
    return invoiceEntity
  }

  private processExtractedDataValues(extracted: Invoice, clientId: number): InvoiceExtractedDTO {
    const energyConsume = extracted.energia.kwh + extracted.energiaSceeeSIcms.kwh
    const energyCompensated = extracted.energiaCompensadaGdI.kwh
    const totalValueWithoutGd = extracted.energia.valor + extracted.energiaSceeeSIcms.valor + extracted.ilumPublica
    return new InvoiceExtractedDTO(extracted, energyConsume, energyCompensated, totalValueWithoutGd, clientId)
  }

  async getFilesData(query: InvoicesQueryDto): Promise<InvoiceListDTO[]> {
    this.logger.log('Recieved request to find invoices files')
    const response = await this.invoicesRepository.findAll(query, ['client'])
    return response.map((invoice) => new InvoiceListDTO(invoice))
  }
}
