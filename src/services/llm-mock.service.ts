import { Injectable } from '@nestjs/common'
import { Invoice } from 'src/types/invoice.type'

@Injectable()
export class LlmServiceMock {
  constructor() {}

  async extractInvoice(filePath: string): Promise<Invoice> {
    return {
      fileName: filePath,
      numeroCliente: 7204076117,
      nomeCliente: 'Ingrid novo',
      mesReferencia: 'SET-2024',
      energia: {
        kwh: 100,
        valor: 1200,
      },
      energiaSceeeSIcms: {
        kwh: 150,
        valor: 1200,
      },
      energiaCompensadaGdI: {
        kwh: 0,
        valor: 0,
      },
      ilumPublica: 40,
    } as Invoice
  }
}
