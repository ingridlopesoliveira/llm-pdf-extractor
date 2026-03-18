import { Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Query } from '@nestjs/common'
import { ResponseDTO } from 'src/dtos/response-dto'
import { type DashboardQueryDto, dashboardQuerySchema } from 'src/schema/dashboard-query.schema'
import { ZodValidationPipe } from 'src/schema/validation/zod-invoice.validation'
import { DashboardService } from 'src/services/dashboard.service'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getTotals(@Query(new ZodValidationPipe(dashboardQuerySchema)) query: DashboardQueryDto) {
    try {
      const response = await this.dashboardService.getTotals(query)
      return new ResponseDTO(HttpStatus.OK, 'Valores totais consultados com sucesso', response)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      throw new InternalServerErrorException('Erro ao obter os dados', message)
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('by-month')
  async getAggregatedDataByMonth(@Query(new ZodValidationPipe(dashboardQuerySchema)) query: DashboardQueryDto) {
    try {
      const response = await this.dashboardService.aggregatedValuesByMonth(query)
      return new ResponseDTO(HttpStatus.OK, 'Valores agregados por mês consultados com sucesso', response)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      throw new InternalServerErrorException('Erro ao obter os dados', message)
    }
  }
}
