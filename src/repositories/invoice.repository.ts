import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InvoiceExtractedDTO } from 'src/dtos/invoice/invoice-extracted.dto'
import { InvoiceEntity } from 'src/entities/invoice-entity'
import { InvoicesQueryDto } from 'src/schema/invoice-query.schema'
import { convertStringToDate } from 'src/utils/convert-string-to-date'
import { FindManyOptions, Repository } from 'typeorm'

@Injectable()
export class InvoicesRepository {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly repository: Repository<InvoiceEntity>,
  ) {}

  async create(data: InvoiceExtractedDTO): Promise<InvoiceEntity> {
    const invoice = this.repository.create(data)
    return this.repository.save(invoice)
  }

  async findAll(query: InvoicesQueryDto): Promise<InvoiceEntity[]> {
    const where: FindManyOptions<InvoiceEntity>['where'] = {}
    if (query.month) where.month = convertStringToDate(query.month)
    if (query.client) where.client = { clientNumber: Number(query.client) }

    return this.repository.find({
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      where,
    })
  }
}
