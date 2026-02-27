import { Invoice } from 'src/types/invoice.type'

export class InvoiceExtractedDTO {
  fileName: string
  month: string
  energyConsume: number
  energyCompensated: number
  totalValueWithoutGd: number
  economyGd: number
  clientId: number

  constructor(invoice: Invoice, energyConsume: number, energyCompensated: number, totalValueWithoutGd: number, clientId: number) {
    this.fileName = invoice.fileName
    this.month = invoice.mesReferencia
    this.energyConsume = energyConsume
    this.energyCompensated = energyCompensated
    this.totalValueWithoutGd = totalValueWithoutGd
    this.economyGd = invoice.energiaCompensadaGdI.valor
    this.clientId = clientId
  }
}
