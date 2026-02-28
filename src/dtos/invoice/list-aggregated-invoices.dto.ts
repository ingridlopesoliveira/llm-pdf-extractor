export class ListAggregatedInvoicesDTO {
  mes: string
  resultados_energia: {
    energia_consumida: number
    energia_conpensada: number
  }
  resultados_financeiros: {
    valor_total_sem_gd: number
    economia_gd: number
  }

  constructor(invoice: RawDataAggregated) {
    this.mes = new Date(invoice.month).toLocaleDateString('pt-br', {
      year: 'numeric',
      month: 'long',
    })
    this.resultados_energia = {
      energia_conpensada: invoice.totalEnergyCompensated,
      energia_consumida: invoice.totalEnergyConsume,
    }
    this.resultados_financeiros = {
      valor_total_sem_gd: invoice.totalValueWithoutGd,
      economia_gd: invoice.totalEconomyGd,
    }
  }
}

type RawDataAggregated = {
  month: string
  totalEconomyGd: number
  totalValueWithoutGd: number
  totalEnergyCompensated: number
  totalEnergyConsume: number
}
