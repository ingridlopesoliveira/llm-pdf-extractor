// invoices.repository.ts

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InvoiceDTO } from 'src/dtos/invoice-dto'
import { InvoiceEntity } from 'src/entities/invoice-entity'
import { Repository } from 'typeorm'

@Injectable()
export class InvoicesRepository {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly repository: Repository<InvoiceEntity>,
  ) {}

  async create(data: InvoiceDTO): Promise<InvoiceEntity> {
    const invoice = this.repository.create(data)
    return this.repository.save(invoice)
  }

  async findById(id: number): Promise<InvoiceEntity | null> {
    return this.repository.findOne({ where: { id } })
  }

  async findAll(): Promise<InvoiceEntity[]> {
    return this.repository.find()
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id)
  }
}
