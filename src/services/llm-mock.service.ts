import { Injectable } from '@nestjs/common'
import { randomInt } from 'crypto'
import { LLMService } from 'src/services/llm.service'
import { Invoice } from 'src/types/invoice.type'

@Injectable()
export class LlmServiceMock implements LLMService {
  constructor() {}

  async extractInvoice(filePath: string): Promise<Invoice> {
    return {
      fileName: filePath,
      numeroCliente: randomInt(11),
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
    } as Invoice
  }
}
