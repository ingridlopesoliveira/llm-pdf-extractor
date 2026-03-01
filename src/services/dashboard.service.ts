import { Injectable, Logger } from '@nestjs/common'
import { ListAggregatedInvoicesForDashboardDTO } from 'src/dtos/invoice/list-aggregated-invoices-for-dashboard.dto'
import { ListAggregatedInvoicesDTO } from 'src/dtos/invoice/list-aggregated-invoices.dto'
import { InvoicesRepository } from 'src/repositories/invoice.repository'
import { DashboardQueryDto } from 'src/schema/dashboard-query.schema'

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name)

  constructor(private invoicesRepository: InvoicesRepository) {}

  async aggregatedValuesByMonth(query: DashboardQueryDto): Promise<ListAggregatedInvoicesForDashboardDTO | ListAggregatedInvoicesDTO[]> {
    this.logger.log('Recieved request to aggreagted values by month')

    const aggregatedValues = await this.invoicesRepository.getAggregatedValues(query)

    if (query.visualizeOnDashboard) {
      const result: ListAggregatedInvoicesForDashboardDTO = {
        mes: [],
        energia_consumida: [],
        energia_conpensada: [],
        valor_total_sem_gd: [],
        economia_gd: [],
      }

      for (const row of aggregatedValues) {
        result.mes.push(row.month)
        result.energia_consumida.push(Number(row.totalEnergyConsume))
        result.energia_conpensada.push(Number(row.totalEnergyCompensated))
        result.valor_total_sem_gd.push(Number(row.totalValueWithoutGd))
        result.economia_gd.push(Number(row.totalEconomyGd))
      }

      return result
    }

    return aggregatedValues.map((it) => new ListAggregatedInvoicesDTO(it))
  }

  async getTotals(query: DashboardQueryDto): Promise<ListAggregatedInvoicesDTO> {
    this.logger.log('Recieved request to get totals values')

    const aggregatedValues = await this.invoicesRepository.getTotals(query)
    return new ListAggregatedInvoicesDTO(aggregatedValues)
  }
}
