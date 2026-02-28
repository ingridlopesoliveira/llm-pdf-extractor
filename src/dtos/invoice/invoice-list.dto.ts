import { InvoiceEntity } from 'src/entities/invoice-entity'

export class InvoiceListDTO {
  nome_do_arquivo_processado: string
  numero_do_cliente: string
  mes_referencia: string

  constructor(invoice: InvoiceEntity) {
    this.nome_do_arquivo_processado = invoice.fileName
    this.numero_do_cliente = invoice.client?.clientNumber.toString() ?? 'N/A'
    this.mes_referencia = invoice.month.toLocaleDateString('pt-br', {
      year: 'numeric',
      month: 'long',
    })
  }
}
