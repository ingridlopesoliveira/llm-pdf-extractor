import { InvoiceEntity } from 'src/entities/invoice-entity'

export class InvoiceListDTO {
  nome_do_arquivo_processado: string
  numero_do_cliente: string
  mes_referencia: string
  nome_do_cliente: string
  energia_consumida: number
  energia_conpensada: number
  valor_total_sem_gd: number
  economia_gd: number

  constructor(invoice: InvoiceEntity) {
    this.nome_do_arquivo_processado = invoice.fileName
    this.numero_do_cliente = invoice.client?.clientNumber.toString() ?? 'N/A'
    this.nome_do_cliente = invoice.client?.clientName ?? 'N/A'
    this.mes_referencia = invoice.month.toLocaleDateString('pt-br', {
      year: 'numeric',
      month: 'long',
    })
    this.energia_consumida = invoice.energyConsume
    this.energia_conpensada = invoice.energyCompensated
    this.valor_total_sem_gd = invoice.totalValueWithoutGd
    this.economia_gd = invoice.economyGd
  }
}
