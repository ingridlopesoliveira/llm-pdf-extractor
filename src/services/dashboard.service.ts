import { Injectable } from '@nestjs/common'
import { InvoicesRepository } from 'src/repositories/invoice.repository'

@Injectable()
export class DashboardService {
  constructor(private invoicesRepository: InvoicesRepository) {}

  async getFilesData() {
    // const invoicesEntities = await this.invoicesRepository.findAll()
  }
}
