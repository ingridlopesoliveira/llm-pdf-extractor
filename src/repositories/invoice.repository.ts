import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InvoiceExtractedDTO } from 'src/dtos/invoice/invoice-extracted.dto'
import { InvoiceEntity } from 'src/entities/invoice-entity'
import { DashboardQueryDto } from 'src/schema/dashboard-query.schema'
import { InvoicesQueryDto } from 'src/schema/invoice-query.schema'
import { convertStringToDate } from 'src/utils/convert-string-to-date'
import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm'

@Injectable()
export class InvoicesRepository {
  private readonly logger = new Logger(InvoicesRepository.name)
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly repository: Repository<InvoiceEntity>,
  ) {}

  async create(data: InvoiceExtractedDTO): Promise<InvoiceEntity> {
    const invoice = this.repository.create(data)
    return this.repository.save(invoice)
  }

  async findAll(query: InvoicesQueryDto, includes?: Array<string>): Promise<InvoiceEntity[]> {
    const where: FindManyOptions<InvoiceEntity>['where'] = {}
    if (query.month) {
      const converted = convertStringToDate(query.month)
      if (isNaN(converted.getTime())) {
        this.logger.warn(`Invalid month filter received: "${query.month}"`)
        throw new BadRequestException(`Mês inválido: "${query.month}". Use o formato MMM/AAAA, ex: SET/2024`)
      }
      where.month = converted
    }
    if (query.client) where.client = { clientNumber: Number(query.client) }

    return this.repository.find({
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      where,
      relations: includes,
    })
  }

  async getAggregatedValues(query: DashboardQueryDto): Promise<any[]> {
    const { client, month } = query
    const qb: SelectQueryBuilder<InvoiceEntity> = this.repository.createQueryBuilder('ie')

    qb.select('ie.month', 'month')
      .addSelect('SUM(ie.economyGd)', 'totalEconomyGd')
      .addSelect('SUM(ie.totalValueWithoutGd)', 'totalValueWithoutGd')
      .addSelect('SUM(ie.energyCompensated)', 'totalEnergyCompensated')
      .addSelect('SUM(ie.energyConsume)', 'totalEnergyConsume')
      .groupBy('ie.month')

    if (month) qb.andWhere('ie.month = :month', { month: convertStringToDate(month) })
    if (client) qb.andWhere('ie.clientId = :client', { client })

    return qb.getRawMany()
  }

  async getTotals(query: DashboardQueryDto): Promise<any> {
    const { client, month } = query
    const qb: SelectQueryBuilder<InvoiceEntity> = this.repository.createQueryBuilder('ie')

    qb.select('SUM(ie.economyGd)', 'totalEconomyGd')
      .addSelect('SUM(ie.totalValueWithoutGd)', 'totalValueWithoutGd')
      .addSelect('SUM(ie.energyCompensated)', 'totalEnergyCompensated')
      .addSelect('SUM(ie.energyConsume)', 'totalEnergyConsume')

    if (month) qb.andWhere('ie.month = :month', { month: convertStringToDate(month) })
    if (client) qb.andWhere('ie.clientId = :client', { client })

    return qb.getRawOne()
  }
}
