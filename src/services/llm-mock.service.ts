import { Injectable } from '@nestjs/common'
import { LLMService } from 'src/services/llm.service'
import { Invoice } from 'src/types/invoice.type'

@Injectable()
export class LlmServiceMock implements LLMService {
  constructor() {}

  extractInvoice(filePath: string): Promise<Invoice> {
    return Promise.resolve({
      fileName: filePath,
      numeroCliente: 7204076117,
      nomeCliente: 'Ingrid Lopes',
      mesReferencia: 'OUT/2024',
      energia: {
        kwh: 100,
        valor: 104.81,
      },
      energiaSceeeSIcms: {
        kwh: 1860,
        valor: 1081.12,
      },
      energiaCompensadaGdI: {
        kwh: 1860,
        valor: -1044.37,
      },
      ilumPublica: 47.57,
    })
  }
}
