import { Invoice } from 'src/types/invoice.type'

export class InvoiceExtractedDTO {
  fileName: string
  client: string
  month: string
  energyConsume: number
  energyCompensated: number
  totalValueWithoutGd: number
  economyGd: number

  constructor(invoice: Invoice, energyConsume: number, energyCompensated: number, totalValueWithoutGd: number) {
    this.fileName = invoice.fileName
    this.client = invoice.cliente
    this.month = invoice.mesReferencia
    this.energyConsume = energyConsume
    this.energyCompensated = energyCompensated
    this.totalValueWithoutGd = totalValueWithoutGd
    this.economyGd = invoice.energiaCompensadaGdI.valor
  }
}
